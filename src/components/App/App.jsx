import Footer from "../Footer/Footer";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
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

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit(currentTemperatureUnit === "F" ? "C" : "F");
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
    postItem({ name, imageUrl, weather })
      .then((newItem) => {
        console.log("✅ New item received:", newItem);
        setClothingItems((prevItems) => [newItem, ...prevItems]);
      })
      .catch((error) => {
        console.error("Failed to post item:", error);
      });
  };

  useEffect(() => {
    getWeather(coordinates, APIkey)
      .then((data) => {
        console.log("Raw weather from API:", data);
        const filteredData = filterWeatherData(data);
        setweatherData(filteredData);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    getItems()
      .then((data) => {
        // Normalize and sort items so newest appear first
        const normalized = data
          .map((item) => ({
            ...item,
            link: item.link || item.imageUrl,
          }))
          .sort((a, b) => b._id - a._id); // sort by _id descending

        setClothingItems(normalized);
      })
      .catch(console.error);
  }, []);

  const handleDeleteCard = (cardToDelete) => {
    console.log("Deleting card:", cardToDelete);

    deleteItem(cardToDelete._id)
      .then(() => {
        // Update state after successful deletion
        const updatedItems = clothingItems.filter(
          (item) => item._id !== cardToDelete._id
        );
        setClothingItems(updatedItems);
        setActiveModal("");
      })
      .catch((err) => console.error("Failed to delete:", err));
  };

  return (
    <CurrentTemperatureUnitContext.Provider
      value={{ currentTemperatureUnit, handleToggleSwitchChange }}
    >
      <div className="page">
        <div className="page__content">
          <Header handleAddClick={handleAddClick} weatherData={weatherData} />
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
                <Profile
                  onCardClick={handleCardClick}
                  clothingItems={clothingItems}
                  handleAddClick={handleAddClick}
                />
              }
            />
          </Routes>
        </div>
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
          onDelete={handleDeleteCard}
        />
        <Footer />
      </div>
    </CurrentTemperatureUnitContext.Provider>
  );
}

export default App;
