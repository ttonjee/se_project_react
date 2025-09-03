import { useState } from "react";
import ClothesSection from "../ClothesSection/ClothesSection";
import "../Profile/Profile.css";
import SideBar from "../SideBar/SideBar";

function Profile({
  onCardClick,
  clothingItems,
  handleAddClick,
  onLogout,
  onCardLike,
  onEditProfileClick,
}) {
  return (
    <div className="profile">
      <section className="profile__sidebar">
        <SideBar />
        <div className="profile__info">
          <button className="profile__edit-button" onClick={onEditProfileClick}>
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
