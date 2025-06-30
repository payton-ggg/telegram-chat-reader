import { create } from "zustand";

type AuthStore = {
  token: string | null;
  isAuthenticated: boolean;
  initialized: boolean;
  setToken: (token: string) => void;
  logout: () => void;
  init: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  isAuthenticated: false,
  initialized: false,

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, isAuthenticated: false });
  },

  init: () => {
    const token = localStorage.getItem("token");
    set({
      token,
      isAuthenticated: Boolean(token),
      initialized: true,
    });
  },
}));
