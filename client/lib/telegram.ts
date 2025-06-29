import api from "./axios";

export const sendCode = async (phone: string) => {
  return await api.post("/telegram/send-code", { phone });
};

export const signIn = async (data: {
  phone: string;
  code: string;
  password?: string;
}) => {
  return await api.post("/telegram/sign-in", data);
};

export const getChats = async () => {
  const res = await api.get("/telegram/chats");
  return res.data;
};

export const getMessages = async (chatId: number, limit = 50, offsetId = 0) => {
  const res = await api.get(`/telegram/chats/${chatId}/messages`, {
    params: { limit, offset_id: offsetId },
  });
  return res.data;
};

export const logoutTelegram = async () => {
  return await api.post("/telegram/logout");
};
