import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api"
});

// Attach JWT token if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

export default API;