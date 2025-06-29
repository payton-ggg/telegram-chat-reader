"use client";
import { useEffect, useState } from "react";
import { getChats, logoutTelegram } from "@/lib/telegram";
import { Chat } from "@/types";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getChats();
        setChats(data);
      } catch (e) {
        console.error("Не вдалося отримати чати:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogoutTelegram = async () => {
    try {
      await logoutTelegram();
      router.push("/dashboard/telegram");
    } catch (err) {
      console.error("Помилка виходу з Telegram", err);
    }
  };

  const handleLogoutSystem = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between mb-4">
        <button
          onClick={handleLogoutTelegram}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Вийти з Telegram
        </button>
        <button
          onClick={handleLogoutSystem}
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
        >
          Вийти з системи
        </button>
      </div>

      <h2 className="text-xl font-bold mb-3">Ваші чати</h2>

      {loading ? (
        <p>Завантаження...</p>
      ) : chats.length === 0 ? (
        <p>Чати не знайдено.</p>
      ) : (
        <ul className="space-y-3">
          {chats.map((chat) => (
            <li
              key={chat.id}
              className="border rounded-md p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
              onClick={() => router.push(`/dashboard/chats/${chat.id}`)}
            >
              <p className="text-lg font-medium">
                {chat.title || `Чат ${chat.id}`}
              </p>
              <p className="text-sm text-gray-500">{chat.type}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
