import { useState } from "react";
import ClothesSection from "../ClothesSection/ClothesSection";
import "../Profile/Profile.css";
import SideBar from "../SideBar/SideBar";
// Remove this import:
// import EditProfileModal from "../EditProfileModal/EditProfileModal";

function Profile({
  onCardClick,
  clothingItems,
  handleAddClick,
  onLogout,
  onCardLike,
  onEditProfileClick, // Add this prop
}) {
  return (
    <div className="profile">
      <section className="profile__sidebar">
        <SideBar />
        <div className="profile__info">
          <button
            className="profile__edit-button"
            onClick={onEditProfileClick} // Use the prop from App
          >
            Change profile data
          </button>
          <button className="profile__sign-out-button" onClick={onLogout}>
            Log out
          </button>
        </div>
      </section>

      <section className="profile__clothes-items">
        <ClothesSection
          onCardClick={onCardClick}
          clothingItems={clothingItems}
          handleAddClick={handleAddClick}
          onCardLike={onCardLike}
        />
      </section>
    </div>
  );
}

export default Profile;
