"use client";
import { useEffect, useState } from "react";
import { getMessages } from "@/lib/telegram";
import { Message } from "@/types";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ChatMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const chatId = Number(params.chatId);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMessages(chatId);
        setMessages(data);
      } catch (err) {
        console.error("Помилка при завантаженні повідомлень:", err);
      } finally {
        setLoading(false);
      }
    };
    if (chatId) load();
  }, [chatId]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-4">
        <Link href="/dashboard/chats" className="text-blue-600 hover:underline">
          ← Назад до чатів
        </Link>
      </div>

      <h2 className="text-xl font-bold mb-4">Повідомлення чату {chatId}</h2>

      {loading ? (
        <p>Завантаження...</p>
      ) : messages.length === 0 ? (
        <p>Немає повідомлень.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className="border p-3 rounded-md shadow-sm bg-white dark:bg-gray-200"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-500">
                  From: {msg.from_id ?? "?"}
                </span>
                <span className="text-sm text-gray-400">
                  {new Date(msg.date).toLocaleString()}
                </span>
              </div>
              {msg.reply_to && (
                <div className="text-xs text-gray-400 mb-1">
                  ↪ У відповідь на повідомлення {msg.reply_to}
                </div>
              )}
              <p>
                {msg.message || <em className="text-gray-400">[без тексту]</em>}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
