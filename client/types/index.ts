export type FormInput = {
  email: string;
  password: string;
};

export type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
  checkAuth: () => void;
};
