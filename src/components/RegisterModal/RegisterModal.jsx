import "./RegisterModal.css";
import { useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../utils/hooks/useForm";

function RegisterModal({
  isOpen,
  onClose,
  onRegister,
  onLoginClick,
  errorMessage,
}) {
  const { values, handleChange, setValues } = useForm({
    email: "",
    password: "",
    name: "",
  });

  useEffect(() => {
    if (isOpen) {
      setValues({ email: "", password: "", name: "" });
    }
  }, [isOpen, setValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(values);
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
        value={values.email}
        onChange={handleChange}
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
        value={values.password}
        onChange={handleChange}
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
        value={values.name}
        onChange={handleChange}
        required
      />

      {errorMessage && <p className="register-form__error">{errorMessage}</p>}

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
