import "./ModalWithForm.css";
function ModalWithForm({
  children,
  buttonText,
  alternativeButton,
  titleText,
  isOpen,
  handleClose,
  onSubmit,
}) {
  return (
    <div className={`modal ${isOpen ? "modal_opened" : ""}`}>
      <div className="modal__content">
        <h2 className="modal__title">{titleText}</h2>
        <button
          type="button"
          className="modal__close"
          onClick={handleClose}
        ></button>

        <form onSubmit={onSubmit} className="modal__form">
          {children}
          {(buttonText || alternativeButton) && (
            <div className="modal__button-row">
              {buttonText && (
                <button type="submit" className="modal__submit">
                  {buttonText}
                </button>
              )}
              {alternativeButton}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ModalWithForm;
