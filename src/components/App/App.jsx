import Footer from "../Footer/Footer";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Header from "../Header/Header";
import Main from "../Main/Main";
import WeatherCard from "../../components/WeatherCard/WeatherCard";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import ItemModal from "../ItemModal/ItemModal";
import { filterWeatherData, getWeather } from "../../utils/weatherApi";
import { coordinates, APIkey } from "../../utils/constants";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import AddItemModal from "../AddItemModal/AddItemModal";
import { defaultClothingItems } from "../../utils/constants";
import Profile from "../Profile/Profile";
import SideBar from "../SideBar/SideBar";
import { AuthError, ValidationError, NetworkError } from "../../utils/errors";
import {
  getItems,
  postItem,
  deleteItem,
  addCardLike,
  removeCardLike,
} from "../../utils/api";
import LoginModal from "../LoginModal/LoginModal";
import { register, login, checkToken, updateUser } from "../../utils/auth";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import RegisterModal from "../RegisterModal/RegisterModal";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import logger from "../../utils/logger";

function App() {
  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 999, C: 999 },
    city: "",
    condition: "",
    isDay: "false",
  });
  const [clothingItems, setClothingItems] = useState(defaultClothingItems);
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);

  // Sync isLoggedIn with currentUser state
  useEffect(() => {
    setIsLoggedIn(!!currentUser);
  }, [currentUser]);

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit(currentTemperatureUnit === "F" ? "C" : "F");
  };

  const getUserInfo = (token) => {
    return checkToken(token);
  };

  const handleLogin = async ({ email, password }) => {
    logger.auth("login_attempt", { email });

    try {
      const res = await login({ email, password });
      localStorage.setItem("jwt", res.token);
      const userData = await getUserInfo(res.token);
      setCurrentUser(userData);
      setActiveModal("");

      logger.info("Login successful", {
        userId: userData._id,
        email: userData.email,
      });
      logger.auth("login_success", { userId: userData._id });
    } catch (error) {
      if (error instanceof AuthError) {
        logger.error("Authentication error during login", error, { email });
        alert("Invalid email or password. Please try again.");
      } else if (error instanceof ValidationError) {
        logger.error("Validation error during login", error, { email });
        alert(`Please check your input: ${error.message}`);
      } else if (error instanceof NetworkError) {
        logger.error("Network error during login", error, { email });
        alert("Connection issue. Please check your internet and try again.");
      } else {
        logger.error("Unexpected login error", error, { email });
        alert(`Login failed: ${error.message || "Please try again."}`);
      }

      logger.auth("login_failed", { email, errorType: error.constructor.name });
    }
  };

  const handleRegister = async ({ name, avatar, email, password }) => {
    logger.auth("registration_attempt", { email, name });

    try {
      await register({ name, avatar, email, password });
      const res = await login({ email, password });
      localStorage.setItem("jwt", res.token);
      const userData = await getUserInfo(res.token);
      setCurrentUser(userData);
      closeActiveModal();

      logger.info("Registration and login successful", {
        userId: userData._id,
        email: userData.email,
        name: userData.name,
      });
      logger.auth("registration_success", { userId: userData._id });
    } catch (error) {
      if (error instanceof AuthError) {
        logger.error("Authentication error during registration", error, {
          email,
          name,
        });
        alert("Registration failed. Email may already be in use.");
      } else if (error instanceof ValidationError) {
        logger.error("Validation error during registration", error, {
          email,
          name,
        });
        alert(`Please check your input: ${error.message}`);
      } else if (error instanceof NetworkError) {
        logger.error("Network error during registration", error, {
          email,
          name,
        });
        alert("Connection issue. Please check your internet and try again.");
      } else {
        logger.error("Unexpected registration error", error, { email, name });
        alert(`Registration failed: ${error.message || "Please try again."}`);
      }

      logger.auth("registration_failed", {
        email,
        name,
        errorType: error.constructor.name,
      });
    }
  };

  const handleLogout = () => {
    const userId = currentUser?._id;
    localStorage.removeItem("jwt");
    setCurrentUser(null);

    logger.auth("logout", { userId });
    logger.info("User logged out", { userId });
  };

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };

  const handleAddClick = () => {
    setActiveModal("add-garment");
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  const handleSwitchToRegister = () => {
    setActiveModal("signup");
  };

  const handleSwitchToLogin = () => {
    setActiveModal("login");
  };

  // Enhanced handleAddItemModalSubmit with centralized error handling
  const handleAddItemModalSubmit = async ({ name, imageUrl, weather }) => {
    const token = localStorage.getItem("jwt");
    const userId = currentUser?._id;

    logger.userAction("item_creation_attempt", { name, weather, userId });

    try {
      const newItem = await postItem({ name, imageUrl, weather }, token);
      setClothingItems((prevItems) => [newItem, ...prevItems]);
      closeActiveModal();

      logger.info("Item created successfully", {
        itemId: newItem._id,
        name: newItem.name,
        userId,
      });
      logger.userAction("item_creation_success", {
        itemId: newItem._id,
        userId,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        logger.error("Authentication error during item creation", error, {
          name,
          weather,
          userId,
        });
        alert("Please log in to add items.");
        setActiveModal("login");
      } else if (error instanceof ValidationError) {
        logger.error("Validation error during item creation", error, {
          name,
          weather,
          userId,
        });
        alert(`Invalid data: ${error.message}`);
      } else if (error instanceof NetworkError) {
        logger.error("Network error during item creation", error, {
          name,
          weather,
          userId,
        });
        alert("Connection issue. Please check your internet and try again.");
      } else {
        logger.error("Unexpected error during item creation", error, {
          name,
          weather,
          userId,
        });
        alert(`Failed to add item: ${error.message || "Please try again."}`);
      }

      logger.userAction("item_creation_failed", {
        name,
        weather,
        userId,
        errorType: error.constructor.name,
      });
    }
  };

  // Enhanced handleUpdateUser with centralized error handling
  const handleUpdateUser = async ({ name, avatar }) => {
    const token = localStorage.getItem("jwt");
    const userId = currentUser?._id;

    logger.userAction("profile_update_attempt", { name, userId });

    try {
      const updatedUser = await updateUser({ name, avatar }, token);
      setCurrentUser(updatedUser);
      setIsEditProfileOpen(false);

      logger.info("Profile updated successfully", {
        userId: updatedUser._id,
        name: updatedUser.name,
      });
      logger.userAction("profile_update_success", { userId });
    } catch (error) {
      if (error instanceof AuthError) {
        logger.error("Authentication error during profile update", error, {
          name,
          userId,
        });
        alert("Please log in to update your profile.");
        setActiveModal("login");
      } else if (error instanceof ValidationError) {
        logger.error("Validation error during profile update", error, {
          name,
          userId,
        });
        alert(`Please check your input: ${error.message}`);
      } else if (error instanceof NetworkError) {
        logger.error("Network error during profile update", error, {
          name,
          userId,
        });
        alert("Connection issue. Please check your internet and try again.");
      } else {
        logger.error("Unexpected error during profile update", error, {
          name,
          userId,
        });
        alert(
          `Failed to update profile: ${error.message || "Please try again."}`
        );
      }

      logger.userAction("profile_update_failed", {
        name,
        userId,
        errorType: error.constructor.name,
      });
    }
  };

  // Update useEffect hooks with logging
  useEffect(() => {
    logger.info("Fetching weather data", { coordinates });

    getWeather(coordinates, APIkey)
      .then((data) => {
        const filteredData = filterWeatherData(data);
        setWeatherData(filteredData);
        logger.info("Weather data loaded successfully", {
          city: filteredData.city,
        });
      })
      .catch((error) => {
        logger.error("Failed to fetch weather data", error, { coordinates });
      });
  }, []);

  useEffect(() => {
    logger.info("Fetching clothing items");

    getItems()
      .then((data) => {
        const normalized = data
          .map((item) => ({
            ...item,
            link: item.imageUrl || item.link,
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setClothingItems(normalized);
        logger.info("Clothing items loaded successfully", {
          itemCount: normalized.length,
        });
      })
      .catch((err) => {
        logger.error("Failed to fetch items", err);
        setClothingItems(defaultClothingItems);
        logger.warn("Fallback to default items", {
          defaultItemCount: defaultClothingItems.length,
        });
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      logger.info("Validating existing token");

      getUserInfo(token)
        .then((userData) => {
          setCurrentUser(userData);
          logger.auth("token_validation_success", { userId: userData._id });
        })
        .catch((err) => {
          logger.error("Token validation failed", err);
          localStorage.removeItem("jwt");
          logger.auth("token_validation_failed");
        });
    }
  }, []);

  // Enhanced handleDeleteCard with centralized error handling
  const handleDeleteCard = async (cardToDelete) => {
    const token = localStorage.getItem("jwt");
    const userId = currentUser?._id;

    logger.userAction("item_deletion_attempt", {
      itemId: cardToDelete._id,
      userId,
    });

    try {
      await deleteItem(cardToDelete._id, token);
      const updatedItems = clothingItems.filter(
        (item) => item._id !== cardToDelete._id
      );
      setClothingItems(updatedItems);
      setIsDeleteConfirmOpen(false);
      setCardToDelete(null);
      closeActiveModal();

      logger.info("Item deleted successfully", {
        itemId: cardToDelete._id,
        userId,
      });
      logger.userAction("item_deletion_success", {
        itemId: cardToDelete._id,
        userId,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        logger.error("Authentication error during item deletion", error, {
          itemId: cardToDelete._id,
          userId,
        });
        alert("Please log in to delete items.");
        setActiveModal("login");
      } else if (error instanceof ValidationError) {
        logger.error("Validation error during item deletion", error, {
          itemId: cardToDelete._id,
          userId,
        });
        alert(`Invalid request: ${error.message}`);
      } else if (error instanceof NetworkError) {
        logger.error("Network error during item deletion", error, {
          itemId: cardToDelete._id,
          userId,
        });
        alert("Connection issue. Please check your internet and try again.");
      } else {
        logger.error("Unexpected error during item deletion", error, {
          itemId: cardToDelete._id,
          userId,
        });
        alert(`Failed to delete item: ${error.message || "Please try again."}`);
      }

      logger.userAction("item_deletion_failed", {
        itemId: cardToDelete._id,
        userId,
        errorType: error.constructor.name,
      });
    }
  };

  // Add this new function to open the confirmation modal
  const handleDeleteRequest = (card) => {
    setCardToDelete(card);
    setIsDeleteConfirmOpen(true);
  };

  // Open Edit Profile modal handler
  const openEditProfileModal = () => {
    setIsEditProfileOpen(true);
  };

  // Close Edit Profile modal handler
  const closeEditProfileModal = () => {
    setIsEditProfileOpen(false);
  };

  const handleCardLike = async ({ id, isLiked }) => {
    const action = isLiked ? "unlike" : "like";
    const userId = currentUser?._id;

    logger.userAction(`item_${action}_attempt`, { itemId: id, userId });

    try {
      const token = localStorage.getItem("jwt");
      let updatedCard;

      if (!isLiked) {
        updatedCard = await addCardLike(id, token);
      } else {
        updatedCard = await removeCardLike(id, token);
      }

      setClothingItems((items) =>
        items.map((item) => (item._id === id ? updatedCard : item))
      );

      logger.userAction(`item_${action}_success`, { itemId: id, userId });
    } catch (error) {
      if (error instanceof AuthError) {
        logger.error(`Authentication error during ${action}`, error, {
          itemId: id,
          userId,
        });
        alert("Please log in to like items.");
        setActiveModal("login");
      } else if (error instanceof ValidationError) {
        logger.error(`Validation error during ${action}`, error, {
          itemId: id,
          userId,
        });
        alert(`Invalid request: ${error.message}`);
      } else if (error instanceof NetworkError) {
        logger.error(`Network error during ${action}`, error, {
          itemId: id,
          userId,
        });
        alert("Connection issue. Please check your internet and try again.");
      } else {
        logger.error(`Unexpected error during ${action}`, error, {
          itemId: id,
          userId,
        });
        alert(`Failed to update like: ${error.message || "Please try again."}`);
      }

      logger.userAction(`item_${action}_failed`, {
        itemId: id,
        userId,
        errorType: error.constructor.name,
      });
    }
  };

  return (
    <CurrentTemperatureUnitContext.Provider
      value={{ currentTemperatureUnit, handleToggleSwitchChange }}
    >
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <div className="page__content">
            <Header
              handleAddClick={handleAddClick}
              weatherData={weatherData}
              handleSignUpClick={() => setActiveModal("signup")}
              handleLoginClick={() => setActiveModal("login")}
              handleLogout={handleLogout}
              currentUser={currentUser}
              isLoggedIn={isLoggedIn}
              // Add a prop or button callback to open edit profile modal here if needed
            />
            <Routes>
              <Route
                path="/"
                element={
                  <Main
                    weatherData={weatherData}
                    handleCardClick={handleCardClick}
                    clothingItems={clothingItems}
                    onCardLike={handleCardLike}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute currentUser={currentUser}>
                    <Profile
                      onCardClick={handleCardClick}
                      clothingItems={clothingItems}
                      handleAddClick={handleAddClick}
                      currentUser={currentUser}
                      onLogout={handleLogout}
                      onEditProfileClick={openEditProfileModal}
                      onCardLike={handleCardLike}
                      onUpdateUser={handleUpdateUser}
                    />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>

          {/* Modals */}
          <LoginModal
            isOpen={activeModal === "login"}
            handleClose={closeActiveModal}
            onLogin={handleLogin}
            onSwitchToRegister={handleSwitchToRegister}
          />

          <RegisterModal
            isOpen={activeModal === "signup"}
            handleClose={closeActiveModal}
            onRegister={handleRegister}
            onSwitchToLogin={handleSwitchToLogin}
          />

          <AddItemModal
            handleClose={closeActiveModal}
            isOpen={activeModal === "add-garment"}
            onSubmit={handleAddItemModalSubmit}
            activeModal={activeModal}
          />

          <ItemModal
            activeModal={activeModal}
            card={selectedCard}
            handleClose={closeActiveModal}
            onDelete={handleDeleteRequest} // <-- change from handleDeleteCard to handleDeleteRequest
          />

          {/* New: Edit Profile Modal */}
          <EditProfileModal
            isOpen={isEditProfileOpen}
            handleClose={closeEditProfileModal}
            onUpdateUser={handleUpdateUser}
          />
          <ModalWithForm
            isOpen={isDeleteConfirmOpen}
            handleClose={() => setIsDeleteConfirmOpen(false)}
            titleText="Delete Item"
            // Don't pass buttonText or onSubmit
          >
            <p className="modal__confirmation-text">
              Are you sure you want to delete this item? This action is
              irreversible.
            </p>
            <div className="modal__button-container">
              <button
                type="button"
                className="modal__delete-button"
                onClick={() => handleDeleteCard(cardToDelete)}
              >
                Yes, delete item
              </button>
              <button
                type="button"
                className="modal__cancel-button"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
            </div>
          </ModalWithForm>

          <Footer />
        </div>
      </CurrentUserContext.Provider>
    </CurrentTemperatureUnitContext.Provider>
  );
}

export default App;
