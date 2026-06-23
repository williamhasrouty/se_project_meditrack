import { useState, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function EditMedicationModal({
  onClose,
  onEditMedication,
  onDeleteMedication,
  isOpen,
  medication,
}) {
  const [name, setName] = useState("");
  const [times, setTimes] = useState("");
  const [isPRN, setIsPRN] = useState(false);
  const [directions, setDirections] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (medication) {
      setName(medication.name);
      setIsPRN(medication.isPRN || false);
      setTimes(medication.times?.join(", ") || "");
      setDirections(medication.directions || "");
    }
  }, [medication]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Parse times (comma-separated) only if not PRN
    const timesArray = isPRN
      ? []
      : times
          .split(",")
          .map((time) => time.trim())
          .filter(Boolean);

    onEditMedication(medication._id, {
      name,
      times: timesArray,
      isPRN,
      directions,
    })
      .then(() => {
        onClose();
      })
      .catch((err) => {
        console.error("Error updating medication:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${medication.name}? This will remove all administration records for this medication.`,
      )
    ) {
      setIsLoading(true);
      onDeleteMedication(medication._id)
        .then(() => {
          onClose();
        })
        .catch((err) => {
          console.error("Error deleting medication:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const isFormValid =
    name.trim().length >= 2 && (isPRN || times.trim().length > 0);

  return (
    <ModalWithForm
      title="Edit Medication"
      onClose={onClose}
      onSubmit={handleSubmit}
      isOpen={isOpen}
      buttonText={isLoading ? "Saving..." : "Save Changes"}
      isFormValid={isFormValid}
    >
      <label className="modal__label">
        Medication Name *
        <input
          type="text"
          className="modal__input"
          placeholder="e.g., Aspirin 81mg"
          value={name}
          onChange={(e) => setName(e.target.value)}
          minLength={2}
          maxLength={100}
          required
        />
      </label>
      <label className="modal__label modal__label--checkbox">
        <input
          type="checkbox"
          className="modal__checkbox"
          checked={isPRN}
          onChange={(e) => setIsPRN(e.target.checked)}
        />
        <span>PRN / As-Needed Medication</span>
      </label>
      {isPRN && (
        <label className="modal__label">
          Directions / Instructions
          <textarea
            className="modal__input modal__input--textarea"
            placeholder="e.g., Give for pain level 5+, Max 3 doses in 24 hours"
            value={directions}
            onChange={(e) => setDirections(e.target.value)}
            maxLength={500}
            rows={2}
          />
          <span className="modal__hint">
            Add any special instructions or directions for this PRN medication
          </span>
        </label>
      )}
      {!isPRN && (
        <label className="modal__label">
          Administration Times *
          <input
            type="text"
            className="modal__input"
            placeholder="e.g., 8:00 AM, 2:00 PM, 8:00 PM"
            value={times}
            onChange={(e) => setTimes(e.target.value)}
            required
          />
          <span className="modal__hint">
            Separate multiple times with commas
          </span>
        </label>
      )}
      {isPRN && (
        <p className="modal__hint">
          PRN medications are given as needed and do not require scheduled
          times.
        </p>
      )}
      <button
        type="button"
        className="modal__delete-btn"
        onClick={handleDelete}
        disabled={isLoading}
      >
        Delete Medication
      </button>
    </ModalWithForm>
  );
}

export default EditMedicationModal;
