import { BASE_URL } from "../utils/constants.js";
import { checkResponse } from "./api";
import { ValidationError, AuthError, NetworkError } from "./errors";

const baseUrl = "http://localhost:3001";

// Helper function to validate required fields using custom error constructors
const validateAuthInput = (data, requiredFields) => {
  for (const field of requiredFields) {
    if (!data[field] || !data[field].trim()) {
      throw new ValidationError(
        `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      );
    }
  }
};

export const register = async ({ name, avatar, email, password }) => {
  try {
    // Validate required fields
    validateAuthInput({ name, email, password }, ["name", "email", "password"]);

    const res = await fetch(`${baseUrl}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, avatar, email, password }),
    });
    return checkResponse(res);
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new NetworkError(
        "Unable to connect to server. Please check your connection."
      );
    }
    throw error; // Re-throw validation and API errors
  }
};

export const login = async ({ email, password }) => {
  try {
    // Validate required fields
    validateAuthInput({ email, password }, ["email", "password"]);

    const res = await fetch(`${baseUrl}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return checkResponse(res);
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new NetworkError(
        "Unable to connect to server. Please check your connection."
      );
    }
    throw error; // Re-throw validation and API errors
  }
};

export const checkToken = async (token) => {
  try {
    // Validate token using custom error constructor
    if (!token) {
      throw new AuthError("Authentication token is required");
    }

    const res = await fetch(`${baseUrl}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return checkResponse(res);
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new NetworkError(
        "Unable to connect to server. Please check your connection."
      );
    }
    throw error; // Re-throw validation and API errors
  }
};

export const updateUser = async ({ name, avatar }, token) => {
  try {
    // Validate token using custom error constructor
    if (!token) {
      throw new AuthError("Authentication token is required to update profile");
    }

    // Validate at least one field is provided using custom error constructor
    if (!name && !avatar) {
      throw new ValidationError(
        "At least one field (name or avatar) must be provided for update"
      );
    }

    const res = await fetch(`${baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, avatar }),
    });
    return checkResponse(res);
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new NetworkError(
        "Unable to connect to server. Please check your connection."
      );
    }
    throw error; // Re-throw validation and API errors
  }
};
