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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (medication) {
      setName(medication.name);
      setTimes(medication.times.join(", "));
    }
  }, [medication]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Parse times (comma-separated)
    const timesArray = times
      .split(",")
      .map((time) => time.trim())
      .filter(Boolean);

    onEditMedication(medication._id, { name, times: timesArray })
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
        `Are you sure you want to delete ${medication.name}? This will remove all administration records for this medication.`
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

  const isFormValid = name.trim().length >= 2 && times.trim().length > 0;

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
        <span className="modal__hint">Separate multiple times with commas</span>
      </label>
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
