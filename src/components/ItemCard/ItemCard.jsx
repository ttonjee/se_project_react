import "./ItemCard.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ItemCard({ item, onCardClick, onCardLike }) {
  const currentUser = useContext(CurrentUserContext);

  const handleCardClick = () => {
    onCardClick(item);
  };

  // Check if the item was liked by the current user
  const isLiked =
    currentUser && item.likes
      ? item.likes.some((id) => id === currentUser._id)
      : false;

  // Class name for like button: add active class if liked
  const itemLikeButtonClassName = `card__like-button ${
    isLiked ? "card__like-button_active" : ""
  }`;

  const handleLike = () => {
    if (!currentUser) return;
    onCardLike({ id: item._id, isLiked });
  };

  return (
    <li className="card">
      <h2 className="card__name">{item.name}</h2>
      <img
        onClick={handleCardClick}
        className="card__image"
        src={item.link || item.imageUrl}
        alt={item.name}
      />

      {/* Show like button only if user is logged in */}
      {currentUser && (
        <button
          className={itemLikeButtonClassName}
          onClick={handleLike}
          aria-label={isLiked ? "Unlike item" : "Like item"}
        >
          {isLiked ? "❤️" : "🤍"}
        </button>
      )}
    </li>
  );
}

export default ItemCard;
