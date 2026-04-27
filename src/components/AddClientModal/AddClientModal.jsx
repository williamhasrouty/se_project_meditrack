import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function AddClientModal({ onClose, onAddClient, isOpen }) {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    onAddClient({ name, region, imageUrl })
      .then(() => {
        setName("");
        setRegion("");
        setImageUrl("");
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
      <label className="modal__label">
        Region
        <select
          className="modal__input"
          name="region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          required
        >
          <option value="">Select a region</option>
          <option value="GGRC">GGRC</option>
          <option value="RCEB">RCEB</option>
          <option value="ACRC">ACRC</option>
          <option value="RCOC">RCOC</option>
          <option value="SDRC">SDRC</option>
        </select>
      </label>
      <label className="modal__label">
        Photo URL (optional)
        <input
          type="url"
          className="modal__input"
          name="imageUrl"
          placeholder="https://example.com/photo.jpg"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </label>
    </ModalWithForm>
  );
}

export default AddClientModal;
