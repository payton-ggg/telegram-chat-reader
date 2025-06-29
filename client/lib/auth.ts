import { FormInput } from "@/types";
import api from "./axios";

export const login = async (data: FormInput) => {
  const response = await api.post("/login", data);
  const { access_token } = response.data;

  if (access_token) {
    localStorage.setItem("token", access_token);
  }

  return access_token;
};

export const Register = async (data: FormInput) => {
  const response = await api.post("/register", data);
  const { access_token } = response.data;

  if (access_token) {
    localStorage.setItem("token", access_token);
  }

  return access_token;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};
