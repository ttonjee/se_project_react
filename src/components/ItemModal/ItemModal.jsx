import "./ItemModal.css";

function ItemModal({ activeModal, handleClose, card, onDelete }) {
  return (
    <div className={`modal ${activeModal === "preview" && "modal_opened"}`}>
      <div className="item__modal_content item__modal_content_image">
        <button
          type="button"
          className="item__modal-close"
          onClick={handleClose}
        ></button>
        <img src={card.imageUrl} alt="image" className="item__modal-image" />
        <div className="item__footer">
          <h2 className="item__modal-caption">{card.name}</h2>
          <p className="item__modal-weather">weather: {card.weather}</p>
          <button
            type="button"
            className="item__modal-delete-btn"
            onClick={() => onDelete(card)}
          >
            Delete item
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
