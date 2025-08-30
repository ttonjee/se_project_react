const baseUrl = "http://localhost:3001";

export const register = async ({ name, avatar, email, password }) => {
  const res = await fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, avatar, email, password }),
  });
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || "Registration failed");
  }
  return res.json();
};

export const login = async ({ email, password }) => {
  const res = await fetch(`${baseUrl}/signin`, {
    // changed BASE_URL to baseUrl
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

function checkResponse(res) {
  if (!res.ok) {
    return Promise.reject(`Error: ${res.status}`);
  }

  return res.status === 204 ? Promise.resolve() : res.json();
}

function getItems() {
  // Public route — no token needed
  return fetch(`${baseUrl}/items`).then(checkResponse);
}

function postItem(item, token) {
  return fetch(`${baseUrl}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(item),
  }).then(checkResponse);
}

function deleteItem(id, token) {
  return fetch(`${baseUrl}/items/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(checkResponse);
}
export { getItems, postItem, deleteItem, checkResponse };
