import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response?.status);
    return Promise.reject(error);
  }
);

export default api;