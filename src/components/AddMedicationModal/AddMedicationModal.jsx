import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function AddMedicationModal({ onClose, onAddMedication, isOpen }) {
  const [name, setName] = useState("");
  const [times, setTimes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Parse times (comma-separated)
    const timesArray = times
      .split(",")
      .map((time) => time.trim())
      .filter(Boolean);

    onAddMedication({ name, times: timesArray })
      .then(() => {
        setName("");
        setTimes("");
        onClose();
      })
      .catch((err) => {
        console.error("Error adding medication:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const isFormValid = name.trim().length >= 2 && times.trim().length > 0;

  return (
    <ModalWithForm
      title="Add Medication"
      onClose={onClose}
      onSubmit={handleSubmit}
      isOpen={isOpen}
      buttonText={isLoading ? "Adding..." : "Add Medication"}
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
    </ModalWithForm>
  );
}

export default AddMedicationModal;
