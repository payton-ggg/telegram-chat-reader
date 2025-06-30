"use client";
import { useEffect, useState } from "react";
import { getMessages } from "@/lib/telegram";
import { Message } from "@/types/telegram";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ChatMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const params = useParams();
  const chatId = Number(params.chatId);

  const PAGE_SIZE = 50;

  useEffect(() => {
    if (chatId) {
      loadMessages();
    }
  }, [chatId]);

  const loadMessages = async (offsetId = 0) => {
    try {
      const data: Message[] = await getMessages(chatId, PAGE_SIZE, offsetId);
      if (data.length < PAGE_SIZE) setHasMore(false);

      setMessages((prev) => {
        const all = [...prev, ...data];
        const unique = Array.from(new Map(all.map((m) => [m.id, m])).values());
        return unique;
      });
    } catch (err) {
      console.error("Помилка при завантаженні повідомлень:", err);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    const lastMessageId = messages[messages.length - 1]?.id ?? 0;
    loadMessages(lastMessageId);
  };

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
      ) : (
        <>
          <ul className="space-y-4">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className="border p-3 rounded-md shadow-sm bg-white"
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
                  {msg.message || (
                    <em className="text-gray-400">[без тексту]</em>
                  )}
                </p>
              </li>
            ))}
          </ul>

          {hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isLoadingMore ? "Завантаження..." : "Завантажити ще"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
