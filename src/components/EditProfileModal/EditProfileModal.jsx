import "./EditProfileModal.css";
import { useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../utils/hooks/useForm";

function EditProfileModal({ isOpen, onClose, onUpdateUser, currentUser }) {
  const { values, handleChange, setValues } = useForm({
    name: "",
    avatar: "",
    initials: "",
  });

  useEffect(() => {
    if (isOpen && currentUser) {
      setValues({
        name: currentUser.name || "",
        avatar: currentUser.avatar || "",
        initials: currentUser.initials || "",
      });
    }
  }, [isOpen, currentUser, setValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser(values);
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
      <label htmlFor="edit-profile-name" className="edit-profile-form__label">
        Name *
      </label>
      <input
        id="edit-profile-name"
        name="name"
        type="text"
        placeholder="Enter your name"
        className="edit-profile-form__input"
        value={values.name}
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
