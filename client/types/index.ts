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

export type Chat = {
  id: number;
  title: string;
  type: string;
};

export type Message = {
  id: number;
  message: string;
  date: string;
  from_id: number | null;
  reply_to: number | null;
};
