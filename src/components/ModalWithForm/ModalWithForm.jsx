import "./ModalWithForm.css";
function ModalWithForm({
  children,
  buttonText,
  titleText,
  activeModal,
  handleClose,
}) {
  return (
    <div
      className={`modal ${activeModal === "add-garment" ? "modal_opened" : ""}`}
    >
      <div className="modal__content">
        <h2 className="modal__title">New garment</h2>
        <button
          type="button"
          className="modal__close"
          onClick={handleClose}
        ></button>

        <form className="modal__form">
          {children}
          <button type="submit" className="modal__submit">
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModalWithForm;
