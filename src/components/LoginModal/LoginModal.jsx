import "./LoginModal.css";
import { useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../utils/hooks/useForm";

function LoginModal({
  isOpen,
  onClose,
  onLogin,
  onRegisterClick,
  errorMessage,
}) {
  const { values, handleChange, setValues } = useForm({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isOpen) {
      setValues({ email: "", password: "" });
    }
  }, [isOpen, setValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(values);
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
        value={values.email}
        onChange={handleChange}
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
        value={values.password}
        onChange={handleChange}
        required
      />

      {errorMessage && <p className="login-form__error">{errorMessage}</p>}

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
