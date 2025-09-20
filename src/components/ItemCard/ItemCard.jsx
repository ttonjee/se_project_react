import "./ItemCard.css";
import { useContext, useState, useEffect } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ItemCard({ item, onCardClick, onCardLike }) {
  const currentUser = useContext(CurrentUserContext);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

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

  const handleImageError = () => {
    setImageError(true);
  };

  // Check if the image URL is valid when component mounts or item changes
  useEffect(() => {
    const imageUrl = item.link || item.imageUrl;

    // Check for obviously invalid URLs
    if (!imageUrl || imageUrl.includes("example.com") || imageUrl === "") {
      setImageError(true);
      return;
    }

    setImageSrc(imageUrl);
    setImageError(false);
  }, [item]);

  return (
    <li className="card">
      <h2 className="card__name">{item.name}</h2>
      {imageError ? (
        <div
          onClick={handleCardClick}
          className="card__image-placeholder"
          style={{
            backgroundColor: "#f0f0f0",
            border: "2px dashed #ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "328px",
            fontSize: "14px",
            color: "#666",
            cursor: "pointer",
            borderRadius: "10px",
          }}
        >
          📷 Image not available
        </div>
      ) : (
        <img
          onClick={handleCardClick}
          className="card__image"
          src={imageSrc}
          alt={item.name}
          onError={handleImageError}
        />
      )}

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
