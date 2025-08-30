import React, { useState } from "react";
import { register } from "../../utils/auth";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function RegisterModal({ isOpen, handleClose, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    onRegister({ name, avatar, email, password });
  };

  return (
    <ModalWithForm
      isOpen={isOpen}
      handleClose={handleClose}
      onSubmit={handleSubmit}
      titleText="Sign Up"
      buttonText={"Next"}
      secondaryButton={
        <button
          type="button"
          className="modal__login-btn"
          onClick={handleClose}
        >
          or Log In
        </button>
      }
    >
      <label>
        Email
        <input
          type="email"
          className="modal__input-line"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          className="modal__input-line"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <label>
        Name
        <input
          type="text"
          className="modal__input-line"
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Avatar URL
        <input
          type="url"
          className="modal__input-line"
          value={avatar}
          placeholder="Avatar URL"
          onChange={(e) => setAvatar(e.target.value)}
          required
        />
      </label>
    </ModalWithForm>
  );
}

export default RegisterModal;
