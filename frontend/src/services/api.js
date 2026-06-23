const BASE_URL = "http://localhost:3000";

export const getVersions = async (search) => {
  const query = search?.trim() ? `?search=${encodeURIComponent(search)}` : "";
  const response = await fetch(`${BASE_URL}/versions${query}`);
  return response.json();
};

export const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const updateVersion = async (id, data) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/versions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const createVersion = async (data) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/versions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};
