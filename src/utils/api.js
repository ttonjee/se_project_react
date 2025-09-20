import { BASE_URL } from "../utils/constants.js";
import {
  ERROR_CODES,
  ValidationError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ServerError,
  NetworkError,
  createErrorFromStatus,
} from "./errors";

// Use the BASE_URL from constants directly
const baseUrl = BASE_URL;

// Add connection status monitoring
let serverStatus = {
  isOnline: false,
  lastCheck: 0,
  checkInterval: 30000, // 30 seconds
};

// Connection timeout and retry configuration
const TIMEOUT_MS = 10000; // 10 seconds
const MAX_RETRIES = 3;

// Enhanced fetch with timeout and retry logic
async function fetchWithTimeout(url, options = {}, retries = MAX_RETRIES) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Update server status on successful connection
    serverStatus.isOnline = true;
    serverStatus.lastCheck = Date.now();

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    // Update server status on failed connection
    serverStatus.isOnline = false;
    serverStatus.lastCheck = Date.now();

    // Handle abort/timeout errors
    if (error.name === "AbortError") {
      throw new NetworkError(
        "Request timed out. Please check your connection."
      );
    }

    // Handle network connectivity errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      if (retries > 0) {
        console.warn(
          `Connection failed, retrying... (${retries} attempts left)`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchWithTimeout(url, options, retries - 1);
      }
      throw new NetworkError(
        "Unable to connect to server. Please check your connection."
      );
    }

    throw error;
  }
}

// Enhanced checkResponse with better error parsing
async function checkResponse(res) {
  if (res.ok) {
    return res.status === 204 ? Promise.resolve() : res.json();
  }

  // Try to parse error message from response
  let errorDetails;
  try {
    errorDetails = await res.json();
  } catch {
    errorDetails = { message: `Request failed with status ${res.status}` };
  }

  const errorMessage =
    errorDetails.error ||
    errorDetails.message ||
    `Request failed with status ${res.status}`;

  // Throw appropriate error constructor
  throw createErrorFromStatus(res.status, errorMessage);
}

// Helper function to create consistent headers
function createAuthHeaders(token, includeContentType = true) {
  const headers = {};

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

// Enhanced API functions with better error handling
function getItems() {
  return fetchWithTimeout(`${baseUrl}/items`)
    .then(checkResponse)
    .catch((error) => {
      console.error("Failed to fetch items:", error.message);
      throw error;
    });
}

function postItem(item, token) {
  // Input validation
  if (!item || typeof item !== "object") {
    return Promise.reject(new ValidationError("Invalid item data provided"));
  }

  if (!token) {
    return Promise.reject(
      new AuthError("Authentication token required to create items")
    );
  }

  // Validate required item fields
  if (!item.name || !item.weather || !item.imageUrl) {
    return Promise.reject(
      new ValidationError("Item must have name, weather, and imageUrl")
    );
  }

  return fetchWithTimeout(`${baseUrl}/items`, {
    method: "POST",
    headers: createAuthHeaders(token),
    body: JSON.stringify(item),
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Failed to create item:", error.message);
      throw error;
    });
}

function deleteItem(id, token) {
  // Input validation
  if (!id) {
    return Promise.reject(
      new ValidationError("Item ID is required for deletion")
    );
  }

  if (!token) {
    return Promise.reject(
      new AuthError("Authentication token required to delete items")
    );
  }

  return fetchWithTimeout(`${baseUrl}/items/${id}`, {
    method: "DELETE",
    headers: createAuthHeaders(token, false),
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Failed to delete item:", error.message);
      throw error;
    });
}

function addCardLike(id, token) {
  // Input validation
  if (!id) {
    return Promise.reject(
      new ValidationError("Item ID is required to add like")
    );
  }

  if (!token) {
    return Promise.reject(
      new AuthError("Authentication token required to like items")
    );
  }

  return fetchWithTimeout(`${baseUrl}/items/${id}/likes`, {
    method: "PUT",
    headers: createAuthHeaders(token),
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Failed to add like:", error.message);
      throw error;
    });
}

function removeCardLike(id, token) {
  // Input validation
  if (!id) {
    return Promise.reject(
      new ValidationError("Item ID is required to remove like")
    );
  }

  if (!token) {
    return Promise.reject(
      new AuthError("Authentication token required to unlike items")
    );
  }

  return fetchWithTimeout(`${baseUrl}/items/${id}/likes`, {
    method: "DELETE",
    headers: createAuthHeaders(token),
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Failed to remove like:", error.message);
      throw error;
    });
}

// Health check function for connection monitoring
function checkServerHealth() {
  return fetchWithTimeout(`${baseUrl}/health`, { method: "GET" }, 1)
    .then(checkResponse)
    .then((data) => {
      console.log("Server health check passed:", data);
      return data;
    })
    .catch((error) => {
      console.warn("Health check failed:", error.message);
      throw new NetworkError("Server is not available");
    });
}

// Add function to get server status
function getServerStatus() {
  return {
    ...serverStatus,
    baseUrl,
    isStale: Date.now() - serverStatus.lastCheck > serverStatus.checkInterval,
  };
}

// Add function to get current base URL
function getCurrentBaseUrl() {
  return baseUrl;
}

export {
  getItems,
  postItem,
  deleteItem,
  addCardLike,
  removeCardLike,
  checkResponse,
  checkServerHealth,
  getServerStatus,
  getCurrentBaseUrl,
};
