const baseUrl = "http://localhost:3001"; // Update this to your backend port if needed

export const register = async ({ name, avatar, email, password }) => {
  const res = await fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, avatar, email, password }),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
};

// ✅ Log in an existing user
export const login = async ({ email, password }) => {
  const res = await fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json(); // should return { token: "..." }
};

// ✅ Check if token is valid and get user info
export const checkToken = async (token) => {
  const res = await fetch(`${baseUrl}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Token is invalid or expired");
  return res.json(); // should return user data
};

export const updateUser = async ({ name, avatar }, token) => {
  const res = await fetch(`${baseUrl}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, avatar }),
  });

  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
};
