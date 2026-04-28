import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function AddClientModal({ onClose, onAddClient, isOpen }) {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [allergies, setAllergies] = useState("");
  const [diagnoses, setDiagnoses] = useState("");
  const [emergencyContacts, setEmergencyContacts] = useState("");
  const [prescribingPhysician, setPrescribingPhysician] = useState("");
  const [pharmacyInfo, setPharmacyInfo] = useState("");
  const [notes, setNotes] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    onAddClient({
      name,
      region,
      imageUrl,
      dateOfBirth,
      allergies,
      diagnoses,
      emergencyContacts,
      prescribingPhysician,
      pharmacyInfo,
      notes,
      isActive,
    })
      .then(() => {
        setName("");
        setRegion("");
        setImageUrl("");
        setDateOfBirth("");
        setAllergies("");
        setDiagnoses("");
        setEmergencyContacts("");
        setPrescribingPhysician("");
        setPharmacyInfo("");
        setNotes("");
        setIsActive(true);
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
      <label className="modal__label">
        Date of Birth (optional)
        <input
          type="date"
          className="modal__input"
          name="dateOfBirth"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
      </label>
      <label className="modal__label">
        Allergies (optional)
        <textarea
          className="modal__input modal__input--textarea"
          name="allergies"
          placeholder="Enter known allergies"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          rows={2}
        />
      </label>
      <label className="modal__label">
        Diagnoses / Conditions (optional)
        <textarea
          className="modal__input modal__input--textarea"
          name="diagnoses"
          placeholder="Enter diagnoses or conditions"
          value={diagnoses}
          onChange={(e) => setDiagnoses(e.target.value)}
          rows={2}
        />
      </label>
      <label className="modal__label">
        Emergency Contacts (optional)
        <textarea
          className="modal__input modal__input--textarea"
          name="emergencyContacts"
          placeholder="Enter emergency contact information"
          value={emergencyContacts}
          onChange={(e) => setEmergencyContacts(e.target.value)}
          rows={2}
        />
      </label>
      <label className="modal__label">
        Prescribing Physician (optional)
        <input
          type="text"
          className="modal__input"
          name="prescribingPhysician"
          placeholder="Enter physician name and contact"
          value={prescribingPhysician}
          onChange={(e) => setPrescribingPhysician(e.target.value)}
        />
      </label>
      <label className="modal__label">
        Pharmacy Information (optional)
        <input
          type="text"
          className="modal__input"
          name="pharmacyInfo"
          placeholder="Enter pharmacy name and contact"
          value={pharmacyInfo}
          onChange={(e) => setPharmacyInfo(e.target.value)}
        />
      </label>
      <label className="modal__label">
        Notes (optional)
        <textarea
          className="modal__input modal__input--textarea"
          name="notes"
          placeholder="Enter any additional notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </label>
      <label className="modal__label modal__label--checkbox">
        <input
          type="checkbox"
          className="modal__checkbox"
          name="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        <span>Active Client</span>
      </label>
    </ModalWithForm>
  );
}

export default AddClientModal;
