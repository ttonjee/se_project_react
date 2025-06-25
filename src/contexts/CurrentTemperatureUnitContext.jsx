import { createContext } from "react";

const CurrentTemperatureUnitContext = createContext({
  currentTemperatureUnit: "F", // default
  handleToggleSwitchChange: () => {}, // placeholder
});

export default CurrentTemperatureUnitContext;
