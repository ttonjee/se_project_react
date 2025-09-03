import React, { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function RegisterModal({ isOpen, handleClose, onRegister, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    console.log("Submitting registration with:", {
      name,
      avatar,
      email,
      password,
    });
    onRegister({
      name: name.trim(),
      avatar: avatar.trim(),
      email: email.trim(),
      password,
    });
  };

  return (
    <ModalWithForm
      titleText="Sign up"
      buttonText="Sign up"
      alternativeButton={
        <button
          type="button"
          className="modal__alt-button"
          onClick={onSwitchToLogin}
        >
          or Log in
        </button>
      }
      isOpen={isOpen}
      handleClose={handleClose}
      onSubmit={handleSubmit}
    >
      <label>
        Email*
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
        Password*
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
        Name*
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
          placeholder="Avatar URL (optional)"
          onChange={(e) => setAvatar(e.target.value)}
        />
      </label>
    </ModalWithForm>
  );
}

export default RegisterModal;
