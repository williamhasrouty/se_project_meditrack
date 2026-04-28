import "./MedicationLog.css";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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

function MedicationLog({
  clients,
  currentUser,
  refreshClients,
  onEditClient,
  onDeleteClient,
}) {
  const { clientId } = useParams();
  const client = clients?.find((c) => c._id === clientId);
  const currentDate = new Date();

  // State for selected month/year (defaults to current month)
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  const [administrations, setAdministrations] = useState({});
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [medicationInfo, setMedicationInfo] = useState(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [isLoadingAdministrations, setIsLoadingAdministrations] =
    useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [editingMedication, setEditingMedication] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(true);
  const saveTimeoutRef = useRef(null);
  const menuRef = useRef(null);

  const isAdmin = currentUser?.role === "admin";

  // Toggle profile expansion
  const toggleProfile = () => {
    setIsProfileExpanded(!isProfileExpanded);
  };

  // Month navigation functions
  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleCurrentMonth = () => {
    setSelectedMonth(currentDate.getMonth());
    setSelectedYear(currentDate.getFullYear());
  };

  const isCurrentMonth =
    selectedMonth === currentDate.getMonth() &&
    selectedYear === currentDate.getFullYear();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[selectedMonth];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isMenuOpen]);

  // Load administrations from API on mount and when month/year changes
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token || !clientId) return;

    setIsLoadingAdministrations(true);
    getMedicationAdministrations(clientId, selectedMonth, selectedYear, token)
      .then((data) => {
        setAdministrations(data.records || {});
        setIsLoadingAdministrations(false);
      })
      .catch((error) => {
        console.error("Error loading administrations:", error);
        setIsLoadingAdministrations(false);
      });
  }, [clientId, selectedMonth, selectedYear]);

  // Save administrations to API whenever they change (with debounce)
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token || !clientId || isLoadingAdministrations) return;

    // Don't save if there are no administrations
    if (Object.keys(administrations).length === 0) return;

    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce the save by 500ms
    saveTimeoutRef.current = setTimeout(() => {
      // Group administrations by medication and filter out empty values
      const medicationGroups = {};
      Object.keys(administrations).forEach((key) => {
        const [medicationId] = key.split("-");
        // Validate medicationId format (24-character hex string)
        if (!medicationId || medicationId.length !== 24) return;

        // Only include non-empty values
        const value = administrations[key];
        if (value && value.trim() !== "") {
          if (!medicationGroups[medicationId]) {
            medicationGroups[medicationId] = {};
          }
          medicationGroups[medicationId][key] = value;
        }
      });

      // Save each medication's administrations (skip if no records)
      Object.keys(medicationGroups).forEach((medicationId) => {
        const records = medicationGroups[medicationId];

        // Skip if no records to save
        if (Object.keys(records).length === 0) return;

        saveMedicationAdministration(
          {
            clientId,
            month: selectedMonth,
            year: selectedYear,
            medicationId,
            records,
          },
          token,
        ).catch((error) => {
          console.error("Error saving administrations:", error);
        });
      });
    }, 500);

    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    administrations,
    clientId,
    selectedMonth,
    selectedYear,
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

  const getInitials = (name) => {
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

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
              Medication Administration Record - {monthName} {selectedYear}
            </h2>
          </div>
          {isAdmin && (
            <div className="medication-log__menu-wrapper" ref={menuRef}>
              <button
                className="medication-log__menu-btn"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Actions menu"
              >
                <span className="medication-log__menu-icon"></span>
                <span className="medication-log__menu-icon"></span>
                <span className="medication-log__menu-icon"></span>
              </button>
              {isMenuOpen && (
                <div className="medication-log__dropdown">
                  <button
                    className="medication-log__dropdown-item medication-log__dropdown-item--add"
                    onClick={() => {
                      setIsMenuOpen(false);
                      openAddMedicationModal();
                    }}
                  >
                    <span className="medication-log__dropdown-icon">+</span>
                    Add Medication
                  </button>
                  <button
                    className="medication-log__dropdown-item medication-log__dropdown-item--edit"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onEditClient(client);
                    }}
                  >
                    <span className="medication-log__dropdown-icon">✎</span>
                    Edit Client
                  </button>
                  <button
                    className="medication-log__dropdown-item medication-log__dropdown-item--delete"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowDeleteConfirmation(true);
                    }}
                  >
                    <span className="medication-log__dropdown-icon">🗑</span>
                    Delete Client
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Client Profile Section */}
      <div className="medication-log__profile">
        <div
          className="medication-log__profile-header"
          onClick={toggleProfile}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleProfile();
            }
          }}
        >
          <div className="medication-log__profile-avatar">
            {client.imageUrl ? (
              <img
                src={client.imageUrl}
                alt={client.name}
                className="medication-log__profile-avatar-image"
              />
            ) : (
              <div className="medication-log__profile-avatar-initials">
                {getInitials(client.name)}
              </div>
            )}
          </div>
          <div className="medication-log__profile-header-info">
            <h3 className="medication-log__profile-name">{client.name}</h3>
            <span
              className={`medication-log__profile-status ${
                client.isActive
                  ? "medication-log__profile-status--active"
                  : "medication-log__profile-status--inactive"
              }`}
            >
              {client.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div
            className={`medication-log__profile-chevron ${
              isProfileExpanded
                ? "medication-log__profile-chevron--expanded"
                : ""
            }`}
          >
            ▼
          </div>
        </div>

        <div
          className={`medication-log__profile-body ${
            isProfileExpanded ? "medication-log__profile-body--visible" : ""
          }`}
        >
          <div className="medication-log__profile-section">
            <h4 className="medication-log__profile-section-title">
              Personal Information
            </h4>
            <div className="medication-log__profile-grid">
              <div className="medication-log__profile-field">
                <span className="medication-log__profile-label">
                  Date of Birth:
                </span>
                <span className="medication-log__profile-value">
                  {formatDate(client.dateOfBirth)}
                </span>
              </div>
              <div className="medication-log__profile-field">
                <span className="medication-log__profile-label">Region:</span>
                <span className="medication-log__profile-value">
                  {client.region}
                </span>
              </div>
            </div>
          </div>

          {(client.allergies || client.diagnoses) && (
            <div className="medication-log__profile-section">
              <h4 className="medication-log__profile-section-title">
                Medical Information
              </h4>
              {client.allergies && (
                <div className="medication-log__profile-field medication-log__profile-field--full">
                  <span className="medication-log__profile-label">
                    Allergies:
                  </span>
                  <span className="medication-log__profile-value">
                    {client.allergies}
                  </span>
                </div>
              )}
              {client.diagnoses && (
                <div className="medication-log__profile-field medication-log__profile-field--full">
                  <span className="medication-log__profile-label">
                    Diagnoses / Conditions:
                  </span>
                  <span className="medication-log__profile-value">
                    {client.diagnoses}
                  </span>
                </div>
              )}
            </div>
          )}

          {(client.prescribingPhysician || client.pharmacyInfo) && (
            <div className="medication-log__profile-section">
              <h4 className="medication-log__profile-section-title">
                Healthcare Providers
              </h4>
              {client.prescribingPhysician && (
                <div className="medication-log__profile-field medication-log__profile-field--full">
                  <span className="medication-log__profile-label">
                    Prescribing Physician:
                  </span>
                  <span className="medication-log__profile-value">
                    {client.prescribingPhysician}
                  </span>
                </div>
              )}
              {client.pharmacyInfo && (
                <div className="medication-log__profile-field medication-log__profile-field--full">
                  <span className="medication-log__profile-label">
                    Pharmacy Information:
                  </span>
                  <span className="medication-log__profile-value">
                    {client.pharmacyInfo}
                  </span>
                </div>
              )}
            </div>
          )}

          {client.emergencyContacts && (
            <div className="medication-log__profile-section">
              <h4 className="medication-log__profile-section-title">
                Emergency Contacts
              </h4>
              <div className="medication-log__profile-field medication-log__profile-field--full">
                <span className="medication-log__profile-value">
                  {client.emergencyContacts}
                </span>
              </div>
            </div>
          )}

          {client.notes && (
            <div className="medication-log__profile-section">
              <h4 className="medication-log__profile-section-title">Notes</h4>
              <div className="medication-log__profile-field medication-log__profile-field--full">
                <span className="medication-log__profile-value medication-log__profile-value--notes">
                  {client.notes}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Month Navigation */}
      <div className="medication-log__month-nav">
        <button
          className="medication-log__month-btn"
          onClick={handlePreviousMonth}
          aria-label="Previous month"
        >
          ‹
        </button>
        <div className="medication-log__month-display">
          <span className="medication-log__month-name">
            {monthName} {selectedYear}
          </span>
          {!isCurrentMonth && (
            <button
              className="medication-log__current-month-btn"
              onClick={handleCurrentMonth}
              title="Go to current month"
            >
              Today
            </button>
          )}
        </div>
        <button
          className="medication-log__month-btn"
          onClick={handleNextMonth}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="medication-log__table-container">
        <table className="medication-log__table">
          <thead>
            <tr>
              <th className="medication-log__th medication-log__th_medication">
                Medication
              </th>
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
                  key={`${medication._id}-${time}`}
                  className="medication-log__row"
                >
                  {timeIndex === 0 && (
                    <td
                      className="medication-log__medication-cell medication-log__medication-cell_clickable"
                      rowSpan={medication.times.length}
                      onClick={() => handleMedicationClick(medication)}
                    >
                      <div className="medication-log__medication-content">
                        <span className="medication-log__medication-name">
                          {medication.name}
                        </span>
                        {isAdmin && (
                          <button
                            className="medication-log__edit-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditMedicationModal(medication);
                            }}
                            aria-label="Edit medication"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                  <td className="medication-log__time-cell">{time}</td>
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const key = `${medication._id}-${day}-${time}`;
                    return (
                      <td
                        key={day}
                        className="medication-log__td medication-log__td_cell"
                        onClick={() =>
                          handleCellClick(medication._id, day, time)
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div
          className="confirmation-modal"
          onClick={() => setShowDeleteConfirmation(false)}
        >
          <div
            className="confirmation-modal__content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="confirmation-modal__close"
              onClick={() => setShowDeleteConfirmation(false)}
            >
              ×
            </button>
            <div className="confirmation-modal__icon confirmation-modal__icon--warning">
              ⚠️
            </div>
            <h2 className="confirmation-modal__title">Delete Client?</h2>
            <p className="confirmation-modal__message">
              Are you sure you want to delete <strong>{client.name}</strong>?
              This will permanently delete all their medications and
              administration records.
            </p>
            <p className="confirmation-modal__warning">
              This action cannot be undone.
            </p>
            <div className="confirmation-modal__actions">
              <button
                className="confirmation-modal__btn confirmation-modal__btn--cancel"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="confirmation-modal__btn confirmation-modal__btn--delete"
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  onDeleteClient(client._id).then(() => {
                    window.location.href = "/";
                  });
                }}
              >
                Delete Client
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MedicationLog;
