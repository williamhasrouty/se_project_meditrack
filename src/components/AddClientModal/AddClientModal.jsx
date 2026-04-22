import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function AddClientModal({ onClose, onAddClient, isOpen }) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    onAddClient({ name })
      .then(() => {
        setName("");
        onClose();
      })
      .catch((err) => {
        console.error("Error adding client:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <ModalWithForm
      title="Add New Client"
      buttonText={isLoading ? "Saving..." : "Add Client"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label className="modal__label">
        Client Name
        <input
          type="text"
          className="modal__input"
          name="name"
          placeholder="Enter client name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          maxLength={50}
        />
      </label>
    </ModalWithForm>
  );
}

export default AddClientModal;
