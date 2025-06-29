import { useAuthStore } from "@/store/auth";
import axios from "axios";

const base_url = "http://127.0.0.1:8000/";

export const api = axios.create({
  baseURL: base_url,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
