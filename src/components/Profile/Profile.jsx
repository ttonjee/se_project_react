import { useState } from "react";
import ClothesSection from "../ClothesSection/ClothesSection";
import "../Profile/Profile.css";
import SideBar from "../SideBar/SideBar";
import EditProfileModal from "../EditProfileModal/EditProfileModal";

function Profile({
  onCardClick,
  clothingItems,
  handleAddClick,
  onLogout,
  onUpdateUser,
}) {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const openEditProfileModal = () => setIsEditProfileOpen(true);
  const closeEditProfileModal = () => setIsEditProfileOpen(false);

  return (
    <div className="profile">
      <section className="profile__sidebar">
        <SideBar />
        <div className="profile__info">
          <button
            className="profile__edit-button"
            onClick={openEditProfileModal}
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
        />
      </section>

      <EditProfileModal
        isOpen={isEditProfileOpen}
        handleClose={closeEditProfileModal}
        onUpdateUser={onUpdateUser}
      />
    </div>
  );
}

export default Profile;
