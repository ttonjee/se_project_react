import "./WeatherCard.css";
import sunny from "../../assets/day/sunny.png";
import { weatherOptions } from "../../utils/constants";

function WeatherCard({ weatherData }) {
  const filteredOptions = weatherOptions.filter((option) => {
    return (
      option.day === weatherData.isDay &&
      option.condition === weatherData.condition
    );
  });

  const weatherOptionUrl = filteredOptions[0]?.url;
  const weatherOptionCondition = filteredOptions[0]?.condition;
  const backgroundClass = weatherData.isDay
    ? `weather-card--${weatherData.condition}-day`
    : `weather-card--${weatherData.condition}-night`;

  return (
    <section className={`weather-card ${backgroundClass}`}>
      <p className="weather-card__temp">{weatherData.temp.F} &deg; F</p>
      <img
        src={weatherOptionUrl}
        alt={weatherOptionCondition}
        className="weather-card__image"
      />
    </section>
  );
}

export default WeatherCard;
