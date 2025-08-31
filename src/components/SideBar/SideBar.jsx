import "../SideBar/SideBar.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import avatar from "../../assets/avatar.png";

function SideBar({ handleLogout }) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <div className="sidebar">
      <img
        className="sidebar__avatar"
        src={currentUser?.avatar || avatar}
        alt={
          currentUser?.name ? `${currentUser.name}'s avatar` : "Default avatar"
        }
      />
      <p className="sidebar__username">{currentUser?.name || "Guest"}</p>
    </div>
  );
}

export default SideBar;
