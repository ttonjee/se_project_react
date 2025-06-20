import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnit";
import "../ToggleSwitch/ToggleSwitch.css";
import { useContext } from "react";

function ToggleSwitch() {
  const { handleToggleSwitchChange, currentTemperatureUnit } = useContext(
    CurrentTemperatureUnitContext
  );
  console.log(currentTemperatureUnit);
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        onChange={handleToggleSwitchChange}
        className="toggle-switch__checkbox"
      />
      <span className="toggle-switch__slider"></span>
      <span
        style={{ color: `${currentTemperatureUnit === "F" ? "white" : ""}` }}
        className="toggle-switch__label toggle-switch__label-F"
      >
        °F
      </span>
      <span
        style={{ color: `${currentTemperatureUnit === "C" ? "white" : ""}` }}
        className="toggle-switch__label toggle-switch__label-C"
      >
        °C
      </span>
    </label>
  );
}

export default ToggleSwitch;
