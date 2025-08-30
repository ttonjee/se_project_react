import "./Header.css";
import avatar from "../../assets/avatar.png";
import logo from "../../assets/logo.svg";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { Link } from "react-router-dom";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function Header({
  handleAddClick,
  weatherData,
  handleSignUpClick,
  handleLoginClick,
  handleLogout,
  isLoggedIn,
}) {
  const currentUser = useContext(CurrentUserContext);

  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
  });

  const renderAvatar = () => {
    if (currentUser?.avatar) {
      return (
        <img
          src={currentUser.avatar}
          alt={`${currentUser.name}'s avatar`}
          className="header__avatar"
        />
      );
    } else if (currentUser?.name) {
      const firstLetter = currentUser.name.charAt(0).toUpperCase();
      return <div className="header__avatar-placeholder">{firstLetter}</div>;
    }
    return null;
  };

  return (
    <header className="header">
      <Link to="/">
        <img className="header__logo" src={logo} alt="logo" />
      </Link>

      <p className="header__date-and-location">
        {currentDate}, {weatherData.city}
      </p>

      <ToggleSwitch />

      {isLoggedIn && currentUser ? (
        <>
          <button
            onClick={handleAddClick}
            type="button"
            className="header__signup-btn"
          >
            + Add Clothes
          </button>

          <Link to="/profile" className="header__user-container">
            <p className="header__username">{currentUser.name}</p>
            {renderAvatar()}
          </Link>
        </>
      ) : (
        <>
          <button
            onClick={handleSignUpClick}
            type="button"
            className="header__signup-btn"
          >
            Sign Up
          </button>
          <button
            onClick={handleLoginClick}
            type="button"
            className="header__login-btn"
          >
            Log In
          </button>
        </>
      )}
    </header>
  );
}

export default Header;
