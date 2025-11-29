import "./EditProfileModal.css";
import { useState, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function EditProfileModal({ isOpen, onClose, onUpdateUser, currentUser }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [initials, setInitials] = useState("");

  useEffect(() => {
    if (isOpen && currentUser) {
      setName(currentUser.name || "");
      setAvatar(currentUser.avatar || "");
      setInitials(currentUser.initials || "");
    }
  }, [isOpen, currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser({ name, avatar, initials });
  };

  return (
    <ModalWithForm
      title="Change profile data"
      name="edit-profile"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText="Save changes"
    >
      <label htmlFor="edit-profile-name" className="edit-profile-form__label">
        Name *
      </label>
      <input
        id="edit-profile-name"
        name="name"
        type="text"
        placeholder="Enter your name"
        className="edit-profile-form__input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        minLength={2}
        maxLength={30}
      />
      <label
        htmlFor="edit-profile-initials"
        className="edit-profile-form__label"
      >
        Initials *
      </label>
      <input
        id="edit-profile-initials"
        name="initials"
        type="text"
        placeholder="Enter your initials (e.g., JD)"
        className="edit-profile-form__input"
        value={initials}
        onChange={(e) => setInitials(e.target.value.toUpperCase())}
        required
        minLength={1}
        maxLength={3}
      />
      <label htmlFor="edit-profile-avatar" className="edit-profile-form__label">
        Avatar URL
      </label>
      <input
        id="edit-profile-avatar"
        name="avatar"
        type="url"
        placeholder="Enter avatar URL"
        className="edit-profile-form__input"
        value={avatar}
        onChange={(e) => setAvatar(e.target.value)}
      />
    </ModalWithForm>
  );
}

export default EditProfileModal;
