import axios from "axios";

const base_url = "http://127.0.0.1:8000/";

export const api = axios.create({
  baseURL: base_url,
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
