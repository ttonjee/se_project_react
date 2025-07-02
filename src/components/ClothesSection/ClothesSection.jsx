import "../ClothesSection/ClothesSection.css";
import Profile from "../Profile/Profile";
import ItemCard from "../ItemCard/ItemCard";

function ClothesSection({ onCardClick, clothingItems, handleAddClick }) {
  return (
    <div className="clothes__section">
      <div className="clothes__section-content">
        <p className="clothes__section-title">Your Item</p>
        <button
          type="button"
          className="clothes__section_add-btn"
          onClick={handleAddClick}
        >
          + Add new
        </button>
      </div>
      <ul className="cards__list">
        {clothingItems.map((item) => {
          return (
            <ItemCard key={item._id} item={item} onCardClick={onCardClick} />
          );
        })}
      </ul>
    </div>
  );
}

export default ClothesSection;
