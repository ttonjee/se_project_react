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
import { getItems, postItem, deleteItem } from "../../utils/api";
import LoginModal from "../LoginModal/LoginModal";
import { register, login, checkToken, updateUser } from "../../utils/auth";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import RegisterModal from "../RegisterModal/RegisterModal";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import EditProfileModal from "../EditProfileModal/EditProfileModal";

function App() {
  const [weatherData, setweatherData] = useState({
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

  const handleLogin = ({ email, password }) => {
    login({ email, password })
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        return getUserInfo(res.token);
      })
      .then((userData) => {
        setCurrentUser(userData);
        setActiveModal("");
      })
      .catch((err) => {
        console.error("Login failed:", err);
        alert("Login failed. Please try again.");
      });
  };

  const handleRegister = ({ name, avatar, email, password }) => {
    register({ name, avatar, email, password })
      .then(() => login({ email, password }))
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        return getUserInfo(res.token);
      })
      .then((userData) => {
        setCurrentUser(userData);
        setActiveModal("");
      })
      .catch((err) => {
        // Show the actual error message from backend if available
        console.error("Registration or login failed:", err);
        alert(
          err.message ||
            err ||
            "Registration or login failed. Please try again."
        );
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
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

  const handleAddItemModalSubmit = ({ name, imageUrl, weather }) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      alert("Please log in to add items.");
      return;
    }

    postItem({ name, imageUrl, weather }, token)
      .then((newItem) => {
        setClothingItems((prevItems) => [newItem, ...prevItems]);
        setActiveModal(""); // Close modal on success
      })
      .catch((error) => {
        console.error("Failed to post item:", error);
        alert("Failed to add item.");
      });
  };

  // New: handle updating user profile
  const handleUpdateUser = ({ name, avatar }) => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      alert("Please log in to update your profile.");
      return;
    }

    updateUser({ name, avatar }, token)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        setIsEditProfileOpen(false);
      })
      .catch((err) => {
        console.error("Failed to update user:", err);
        alert("Failed to update profile. Please try again.");
      });
  };

  useEffect(() => {
    getWeather(coordinates, APIkey)
      .then((data) => {
        const filteredData = filterWeatherData(data);
        setweatherData(filteredData);
      })
      .catch(console.error);
  }, []);

  // Auto-login from localStorage
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      getUserInfo(token)
        .then((userData) => {
          setCurrentUser(userData);
        })
        .catch((err) => {
          console.error("Token invalid or expired:", err);
          localStorage.removeItem("jwt");
        });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      console.warn("No token found, skipping items fetch");
      return;
    }

    getItems(token)
      .then((data) => {
        const normalized = data
          .map((item) => ({
            ...item,
            link: item.link || item.imageUrl,
          }))
          .sort((a, b) => b._id - a._id); // sort by _id descending

        setClothingItems(normalized);
      })
      .catch((err) => {
        console.error("Failed to fetch items:", err);
      });
  }, [currentUser]);

  const handleDeleteCard = (cardToDelete) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      alert("Please log in to delete items.");
      return;
    }

    if (!cardToDelete?._id) {
      console.warn("Invalid card object:", cardToDelete);
      alert("Unable to delete this item. Please try again.");
      return;
    }

    deleteItem(cardToDelete._id, token)
      .then(() => {
        const updatedItems = clothingItems.filter(
          (item) => item._id !== cardToDelete._id
        );
        setClothingItems(updatedItems);
        setIsDeleteConfirmOpen(false); // Close modal after delete
        setCardToDelete(null);
        setActiveModal("");
      })
      .catch((err) => {
        console.error("Failed to delete item:", err);
        alert("Failed to delete item. Please try again.");
      });
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

  const handleCardLike = ({ id, isLiked }) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      alert("Please log in to like items.");
      return;
    }

    if (!isLiked) {
      // Add like
      api
        .addCardLike(id, token)
        .then((updatedCard) => {
          setClothingItems((items) =>
            items.map((item) => (item._id === id ? updatedCard : item))
          );
        })
        .catch((err) => console.log(err));
    } else {
      // Remove like
      api
        .removeCardLike(id, token)
        .then((updatedCard) => {
          setClothingItems((items) =>
            items.map((item) => (item._id === id ? updatedCard : item))
          );
        })
        .catch((err) => console.log(err));
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
                      // Pass down the handler to open edit profile modal to Profile page
                      onEditProfileClick={openEditProfileModal}
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
          />

          <RegisterModal
            isOpen={activeModal === "signup"}
            handleClose={closeActiveModal}
            onRegister={handleRegister}
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
