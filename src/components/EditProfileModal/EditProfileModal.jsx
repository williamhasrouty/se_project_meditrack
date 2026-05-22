import "./EditProfileModal.css";
import { useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../utils/hooks/useForm";

function EditProfileModal({ isOpen, onClose, onUpdateUser, currentUser }) {
  const { values, handleChange, setValues } = useForm({
    firstName: "",
    lastName: "",
    avatar: "",
    initials: "",
  });

  useEffect(() => {
    if (isOpen && currentUser) {
      const nameParts = (currentUser.name || "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName =
        nameParts.length >= 2 ? nameParts.slice(1).join(" ") : "";
      setValues({
        firstName,
        lastName,
        avatar: currentUser.avatar || "",
        initials: currentUser.initials || "",
      });
    }
  }, [isOpen, currentUser, setValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = `${values.firstName} ${values.lastName}`.trim();
    onUpdateUser({ ...values, name });
  };

  const handleInitialsChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value.toUpperCase() });
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
      <label
        htmlFor="edit-profile-firstName"
        className="edit-profile-form__label"
      >
        First Name *
      </label>
      <input
        id="edit-profile-firstName"
        name="firstName"
        type="text"
        placeholder="Enter your first name"
        className="edit-profile-form__input"
        value={values.firstName}
        onChange={handleChange}
        required
        minLength={2}
        maxLength={30}
      />
      <label
        htmlFor="edit-profile-lastName"
        className="edit-profile-form__label"
      >
        Last Name *
      </label>
      <input
        id="edit-profile-lastName"
        name="lastName"
        type="text"
        placeholder="Enter your last name"
        className="edit-profile-form__input"
        value={values.lastName}
        onChange={handleChange}
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
        value={values.initials}
        onChange={handleInitialsChange}
        required
        minLength={1}
        maxLength={3}
        disabled={currentUser?.initials}
      />
      {currentUser?.initials && (
        <p className="edit-profile-form__info">
          Initials cannot be changed once chosen
        </p>
      )}
      <label htmlFor="edit-profile-avatar" className="edit-profile-form__label">
        Avatar URL
      </label>
      <input
        id="edit-profile-avatar"
        name="avatar"
        type="url"
        placeholder="Enter avatar URL"
        className="edit-profile-form__input"
        value={values.avatar}
        onChange={handleChange}
      />
    </ModalWithForm>
  );
}

export default EditProfileModal;
