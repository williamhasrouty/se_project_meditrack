import { useState, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function EditClientModal({ onClose, onEditClient, isOpen, client }) {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (client) {
      setName(client.name || "");
      setRegion(client.region || "");
    }
  }, [client]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    onEditClient({ name, region })
      .then(() => {
        onClose();
      })
      .catch((err) => {
        console.error("Error editing client:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <ModalWithForm
      title="Edit Client"
      buttonText={isLoading ? "Saving..." : "Save Changes"}
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
    </ModalWithForm>
  );
}

export default EditClientModal;
