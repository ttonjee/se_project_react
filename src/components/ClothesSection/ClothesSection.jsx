import "../ClothesSection/ClothesSection.css";
import ItemCard from "../ItemCard/ItemCard";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ClothesSection({
  onCardClick,
  clothingItems,
  handleAddClick,
  onCardLike,
}) {
  const currentUser = useContext(CurrentUserContext);

  // Filter clothing items to only include those owned by the current user
  const userItems = clothingItems.filter(
    (item) => item.owner === currentUser?._id
  );

  return (
    <div className="clothes__section">
      <div className="clothes__section-content">
        <p className="clothes__section-title">Your Items</p>
        <button
          type="button"
          className="clothes__section_add-btn"
          onClick={handleAddClick}
        >
          + Add new
        </button>
      </div>
      {userItems.length > 0 ? (
        <ul className="cards__list">
          {userItems.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onCardClick={onCardClick}
              onCardLike={onCardLike} // Add this prop
            />
          ))}
        </ul>
      ) : (
        <p className="clothes__section-empty">
          You haven't added any items yet.
        </p>
      )}
    </div>
  );
}

export default ClothesSection;
