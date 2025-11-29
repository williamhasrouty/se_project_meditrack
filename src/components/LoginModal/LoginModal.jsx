import "./LoginModal.css";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function LoginModal({ isOpen, onClose, onLogin, onRegisterClick }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    onLogin(credentials);
  };

  return (
    <ModalWithForm
      title="Log In"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText="Log In"
    >
      <label htmlFor="login-email" className="login-form__label">
        Email
      </label>
      <input
        id="login-email"
        name="email"
        type="email"
        placeholder="Email"
        className="login-form__input"
        required
      />

      <label htmlFor="login-password" className="login-form__label">
        Password
      </label>
      <input
        id="login-password"
        name="password"
        type="password"
        placeholder="Password"
        className="login-form__input"
        required
      />

      <div className="login-modal__button-row">
        <button
          type="button"
          className="login-modal__register-btn"
          onClick={onRegisterClick}
        >
          or Register
        </button>
      </div>
    </ModalWithForm>
  );
}

export default LoginModal;
