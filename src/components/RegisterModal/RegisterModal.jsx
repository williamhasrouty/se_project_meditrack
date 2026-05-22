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
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    if (isOpen) {
      setValues({ email: "", password: "", firstName: "", lastName: "" });
    }
  }, [isOpen, setValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = `${values.firstName} ${values.lastName}`.trim();
    onRegister({ ...values, name });
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

      <label htmlFor="register-firstName" className="register-form__label">
        First Name
      </label>
      <input
        id="register-firstName"
        name="firstName"
        type="text"
        placeholder="First Name*"
        className="register-form__input"
        value={values.firstName}
        onChange={handleChange}
        required
        minLength={2}
        maxLength={30}
      />

      <label htmlFor="register-lastName" className="register-form__label">
        Last Name
      </label>
      <input
        id="register-lastName"
        name="lastName"
        type="text"
        placeholder="Last Name*"
        className="register-form__input"
        value={values.lastName}
        onChange={handleChange}
        required
        minLength={2}
        maxLength={30}
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
