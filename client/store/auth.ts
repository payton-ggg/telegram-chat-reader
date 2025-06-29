import { AuthState } from "@/types";
import { create } from "zustand";

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,

  setToken: (token) => {
    localStorage.setItem("token", token);
    console.log("TOKEN IN STORE:", useAuthStore.getState().token);
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const token = localStorage.getItem("token");
    if (token) {
      set({ token, isAuthenticated: true });
    } else {
      set({ token: null, isAuthenticated: false });
    }
  },
}));
