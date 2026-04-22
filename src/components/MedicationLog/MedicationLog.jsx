import "./MedicationLog.css";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getMedicationByBrandName,
  parseMedicationData,
} from "../../utils/fdaApi";
import {
  getMedicationAdministrations,
  saveMedicationAdministration,
  addMedication,
  updateMedication,
  deleteMedication,
} from "../../utils/api";
import AddMedicationModal from "../AddMedicationModal/AddMedicationModal";
import EditMedicationModal from "../EditMedicationModal/EditMedicationModal";

function MedicationLog({ clients, currentUser, refreshClients }) {
  const { clientId } = useParams();
  const client = clients?.find((c) => c._id === clientId);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const [administrations, setAdministrations] = useState({});
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [medicationInfo, setMedicationInfo] = useState(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [isLoadingAdministrations, setIsLoadingAdministrations] =
    useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [editingMedication, setEditingMedication] = useState(null);

  const isAdmin = currentUser?.role === "admin";

  // Load administrations from API on mount
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token || !clientId) return;

    setIsLoadingAdministrations(true);
    getMedicationAdministrations(clientId, currentMonth, currentYear, token)
      .then((data) => {
        setAdministrations(data.records || {});
        setIsLoadingAdministrations(false);
      })
      .catch((error) => {
        console.error("Error loading administrations:", error);
        setIsLoadingAdministrations(false);
      });
  }, [clientId, currentMonth, currentYear]);

  // Save administrations to API whenever they change
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token || !clientId || isLoadingAdministrations) return;

    // Don't save if there are no administrations
    if (Object.keys(administrations).length === 0) return;

    // Group administrations by medication
    const medicationGroups = {};
    Object.keys(administrations).forEach((key) => {
      const [medicationId] = key.split("-");
      // Validate medicationId format (24-character hex string)
      if (!medicationId || medicationId.length !== 24) return;
      if (!medicationGroups[medicationId]) {
        medicationGroups[medicationId] = {};
      }
      medicationGroups[medicationId][key] = administrations[key];
    });

    // Save each medication's administrations
    Object.keys(medicationGroups).forEach((medicationId) => {
      saveMedicationAdministration(
        {
          clientId,
          month: currentMonth,
          year: currentYear,
          medicationId,
          records: medicationGroups[medicationId],
        },
        token,
      ).catch((error) => {
        console.error("Error saving administrations:", error);
      });
    });
  }, [
    administrations,
    clientId,
    currentMonth,
    currentYear,
    isLoadingAdministrations,
  ]);

  if (!client) {
    return (
      <section className="medication-log">
        <h2 className="medication-log__error">Client not found</h2>
      </section>
    );
  }

  const handleCellClick = (medicationId, day, time) => {
    const key = `${medicationId}-${day}-${time}`;
    const userInitials =
      currentUser?.initials ||
      currentUser?.name?.substring(0, 2).toUpperCase() ||
      "ST";

    setAdministrations((prev) => {
      const existingValue = prev[key];

      // If cell is empty, add current user's initials
      if (!existingValue) {
        return {
          ...prev,
          [key]: userInitials,
        };
      }

      // If cell has current user's initials, allow removal
      if (existingValue === userInitials) {
        return {
          ...prev,
          [key]: "",
        };
      }

      // If cell has someone else's initials, don't allow changes
      return prev;
    });
  };

  const handleMedicationClick = (medication) => {
    setSelectedMedication(medication);
    setIsLoadingInfo(true);
    setMedicationInfo(null);

    // Extract medication name without dosage
    const medicationName = medication.name.split(" ")[0];

    getMedicationByBrandName(medicationName)
      .then((data) => {
        const parsedInfo = parseMedicationData(data, medicationName);
        setMedicationInfo(parsedInfo);
        setIsLoadingInfo(false);
      })
      .catch((error) => {
        console.error("Error fetching medication info:", error);
        setMedicationInfo({
          brandName: medication.name,
          genericName: "Error loading information",
          purpose: "Error loading information",
          warnings: "Error loading information",
          dosageAndAdministration: "Error loading information",
          activeIngredient: "Error loading information",
        });
        setIsLoadingInfo(false);
      });
  };

  const closeMedicationModal = () => {
    setSelectedMedication(null);
    setMedicationInfo(null);
  };

  const handleAddMedication = (medicationData) => {
    const token = localStorage.getItem("jwt");
    if (!token) return Promise.reject(new Error("No token"));

    return addMedication(clientId, medicationData, token).then(() => {
      // Refresh clients data without page reload
      if (refreshClients) {
        return refreshClients();
      }
    });
  };

  const handleEditMedication = (medicationId, medicationData) => {
    const token = localStorage.getItem("jwt");
    if (!token) return Promise.reject(new Error("No token"));

    return updateMedication(clientId, medicationId, medicationData, token).then(
      () => {
        // Refresh clients data without page reload
        if (refreshClients) {
          return refreshClients();
        }
      },
    );
  };

  const handleDeleteMedication = (medicationId) => {
    const token = localStorage.getItem("jwt");
    if (!token) return Promise.reject(new Error("No token"));

    return deleteMedication(clientId, medicationId, token).then(() => {
      // Refresh clients data without page reload
      if (refreshClients) {
        return refreshClients();
      }
    });
  };

  const openAddMedicationModal = () => {
    setActiveModal("add-medication");
  };

  const openEditMedicationModal = (medication) => {
    setEditingMedication(medication);
    setActiveModal("edit-medication");
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingMedication(null);
  };

  const monthName = new Date(currentYear, currentMonth).toLocaleString(
    "default",
    {
      month: "long",
    },
  );

  return (
    <section className="medication-log">
      <div className="medication-log__header">
        <Link to="/" className="medication-log__back-btn">
          ← Back to Client List
        </Link>
        <div className="medication-log__header-content">
          <div>
            <h1 className="medication-log__title">{client.name}</h1>
            <h2 className="medication-log__subtitle">
              Medication Administration Record - {monthName} {currentYear}
            </h2>
          </div>
          {isAdmin && (
            <button
              className="medication-log__add-btn"
              onClick={openAddMedicationModal}
            >
              + Add Medication
            </button>
          )}
        </div>
      </div>

      <div className="medication-log__table-container">
        <table className="medication-log__table">
          <thead>
            <tr>
              <th className="medication-log__th medication-log__th_medication">
                Medication
              </th>
              {isAdmin && (
                <th className="medication-log__th medication-log__th_edit">
                  Edit
                </th>
              )}
              <th className="medication-log__th medication-log__th_time">
                Time
              </th>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <th
                  key={i + 1}
                  className="medication-log__th medication-log__th_day"
                >
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {client.medications.map((medication) =>
              medication.times.map((time, timeIndex) => (
                <tr
                  key={`${medication.id}-${time}`}
                  className="medication-log__row"
                >
                  {timeIndex === 0 && (
                    <td
                      className="medication-log__medication-cell medication-log__medication-cell_clickable"
                      rowSpan={medication.times.length}
                      onClick={() => handleMedicationClick(medication)}
                    >
                      {medication.name}
                    </td>
                  )}
                  {isAdmin && timeIndex === 0 && (
                    <td
                      className="medication-log__edit-cell"
                      rowSpan={medication.times.length}
                    >
                      <button
                        className="medication-log__edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditMedicationModal(medication);
                        }}
                      >
                        ✏️
                      </button>
                    </td>
                  )}
                  <td className="medication-log__time-cell">{time}</td>
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const key = `${medication.id}-${day}-${time}`;
                    return (
                      <td
                        key={day}
                        className="medication-log__td medication-log__td_cell"
                        onClick={() =>
                          handleCellClick(medication.id, day, time)
                        }
                      >
                        {administrations[key] || ""}
                      </td>
                    );
                  })}
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>

      <div className="medication-log__footer">
        <p className="medication-log__instructions">
          Click on medication name for details. Click on any cell to add your
          initials for medication administration.
        </p>
      </div>

      {selectedMedication && (
        <div className="medication-modal" onClick={closeMedicationModal}>
          <div
            className="medication-modal__content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="medication-modal__close"
              onClick={closeMedicationModal}
            >
              ×
            </button>
            <h2 className="medication-modal__title">
              {selectedMedication.name}
            </h2>
            {isLoadingInfo ? (
              <p className="medication-modal__loading">
                Loading information...
              </p>
            ) : medicationInfo ? (
              <div className="medication-modal__info">
                <div className="medication-modal__section">
                  <h3 className="medication-modal__label">Brand Name:</h3>
                  <p className="medication-modal__text">
                    {medicationInfo.brandName}
                  </p>
                </div>
                <div className="medication-modal__section">
                  <h3 className="medication-modal__label">Generic Name:</h3>
                  <p className="medication-modal__text">
                    {medicationInfo.genericName}
                  </p>
                </div>
                <div className="medication-modal__section">
                  <h3 className="medication-modal__label">
                    Active Ingredient:
                  </h3>
                  <p className="medication-modal__text">
                    {medicationInfo.activeIngredient}
                  </p>
                </div>
                <div className="medication-modal__section">
                  <h3 className="medication-modal__label">Purpose:</h3>
                  <p className="medication-modal__text">
                    {medicationInfo.purpose}
                  </p>
                </div>
                <div className="medication-modal__section">
                  <h3 className="medication-modal__label">
                    Dosage & Administration:
                  </h3>
                  <p className="medication-modal__text">
                    {medicationInfo.dosageAndAdministration}
                  </p>
                </div>
                <div className="medication-modal__section">
                  <h3 className="medication-modal__label">Warnings:</h3>
                  <p className="medication-modal__text">
                    {medicationInfo.warnings}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <AddMedicationModal
        isOpen={activeModal === "add-medication"}
        onClose={closeModal}
        onAddMedication={handleAddMedication}
      />

      <EditMedicationModal
        isOpen={activeModal === "edit-medication"}
        onClose={closeModal}
        onEditMedication={handleEditMedication}
        onDeleteMedication={handleDeleteMedication}
        medication={editingMedication}
      />
    </section>
  );
}

export default MedicationLog;
