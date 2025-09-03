import React, { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function LoginModal({ isOpen, handleClose, onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onLogin({ email, password });
  }

  return (
    <ModalWithForm
      titleText="Log in"
      buttonText="Log in"
      alternativeButton={
        <button
          type="button"
          className="modal__alt-button"
          onClick={onSwitchToRegister} // Switch to register instead of closing
        >
          or Register
        </button>
      }
      isOpen={isOpen}
      handleClose={handleClose}
      onSubmit={handleSubmit}
    >
      <label>
        Email
        <input
          type="email"
          name="email"
          className="modal__input-line"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          name="password"
          className="modal__input-line"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
    </ModalWithForm>
  );
}

export default LoginModal;
