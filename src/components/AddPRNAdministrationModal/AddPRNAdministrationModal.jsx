import { useState, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function AddPRNAdministrationModal({ onClose, onAddPRN, isOpen, medication }) {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [administrationDate, setAdministrationDate] = useState("");
  const [administrationTime, setAdministrationTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Set default to current date and time when modal opens
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
      const timeStr = now.toTimeString().slice(0, 5); // HH:MM
      setAdministrationDate(dateStr);
      setAdministrationTime(timeStr);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Combine date and time (keep in local timezone, don't convert to UTC)
    const administeredAt = `${administrationDate}T${administrationTime}:00`;

    onAddPRN({
      medicationId: medication._id,
      medicationName: medication.name,
      reason,
      notes,
      administeredAt,
    })
      .then(() => {
        setReason("");
        setNotes("");
        onClose();
      })
      .catch((err) => {
        console.error("Error recording PRN administration:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const isFormValid =
    reason.trim().length > 0 &&
    administrationDate.length > 0 &&
    administrationTime.length > 0;

  return (
    <ModalWithForm
      title={`Give ${medication?.name || "PRN Medication"}`}
      onClose={onClose}
      onSubmit={handleSubmit}
      isOpen={isOpen}
      buttonText={isLoading ? "Recording..." : "Record Administration"}
      isFormValid={isFormValid}
    >
      <label className="modal__label">
        Reason for Administration *
        <input
          type="text"
          className="modal__input"
          placeholder="e.g., Pain, Anxiety, Nausea"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={200}
          required
        />
      </label>
      <label className="modal__label">
        Date Administered *
        <input
          type="date"
          className="modal__input"
          value={administrationDate}
          onChange={(e) => setAdministrationDate(e.target.value)}
          required
        />
      </label>
      <label className="modal__label">
        Time Administered *
        <input
          type="time"
          className="modal__input"
          value={administrationTime}
          onChange={(e) => setAdministrationTime(e.target.value)}
          required
        />
      </label>
      <label className="modal__label">
        Notes (optional)
        <textarea
          className="modal__input modal__input--textarea"
          placeholder="Additional observations or details"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={500}
          rows={3}
        />
      </label>
    </ModalWithForm>
  );
}

export default AddPRNAdministrationModal;
