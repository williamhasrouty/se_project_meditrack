import "./RegisterModal.css";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function RegisterModal({ isOpen, onClose, onRegister, onLoginClick }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };
    onRegister(userData);
  };

  return (
    <ModalWithForm
      title="Sign Up"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText="Sign Up"
    >
      <label htmlFor="register-email" className="register-form__label">
        Email
      </label>
      <input
        id="register-email"
        name="email"
        type="email"
        placeholder="Email*"
        className="register-form__input"
        required
      />

      <label htmlFor="register-password" className="register-form__label">
        Password
      </label>
      <input
        id="register-password"
        name="password"
        type="password"
        placeholder="Password*"
        className="register-form__input"
        required
      />

      <label htmlFor="register-name" className="register-form__label">
        Name
      </label>
      <input
        id="register-name"
        name="name"
        type="text"
        placeholder="Name*"
        className="register-form__input"
        required
      />

      <div className="register-modal__button-row">
        <button
          type="button"
          className="register-modal__login-btn"
          onClick={onLoginClick}
        >
          or Log in
        </button>
      </div>
    </ModalWithForm>
  );
}

export default RegisterModal;
