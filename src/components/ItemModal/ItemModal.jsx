import "./ItemModal.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ItemModal({ activeModal, handleClose, card, onDelete }) {
  const currentUser = useContext(CurrentUserContext);

  if (!card) return null;

  // Check if the logged-in user is the owner of the item
  const isOwn = card.owner === currentUser?._id;

  // Conditionally apply a hidden class to the delete button
  const itemDeleteButtonClassName = `item__modal-delete-btn ${
    isOwn ? "" : "item__modal-delete-btn_hidden"
  }`;

  return (
    <div className={`modal ${activeModal === "preview" ? "modal_opened" : ""}`}>
      <div className="item__modal_content item__modal_content_image">
        <button
          type="button"
          className="item__modal-close"
          onClick={handleClose}
        ></button>

        <img
          className="card__image"
          src={card.link || card.imageUrl}
          alt={card.name}
        />

        <div className="item__footer">
          <h2 className="item__modal-caption">{card.name}</h2>
          <p className="item__modal-weather">Weather: {card.weather}</p>

          <button
            type="button"
            className={itemDeleteButtonClassName}
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
