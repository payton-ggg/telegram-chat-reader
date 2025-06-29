import { create } from "zustand";
import { Chat } from "@/types";

type TelegramState = {
  isConnected: boolean;
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  setConnected: (val: boolean) => void;
};

export const useTelegramStore = create<TelegramState>((set) => ({
  isConnected: false,
  chats: [],
  setChats: (chats) => set({ chats }),
  setConnected: (val) => set({ isConnected: val }),
}));
