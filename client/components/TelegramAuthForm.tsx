"use client";
import { useState } from "react";
import { sendCode, signIn } from "@/lib/telegram";
import { useRouter } from "next/navigation";

const TelegramAuthForm = () => {
  const router = useRouter();

  const [step, setStep] = useState<"phone" | "code" | "password">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSendCode = async () => {
    try {
      await sendCode(phone);
      setStep("code");
    } catch (err) {
      setError("Невірний номер або помилка підключення");
      console.error(err);
    }
  };

  const handleSignIn = async () => {
    try {
      await signIn({ phone, code, password: password || undefined });
      router.push("/dashboard/chats");
    } catch (err: { response: { data: { detail: string } } } | any) {
      const detail = err?.response?.data?.detail || "";
      if (detail.includes("password is required")) {
        setStep("password");
      } else {
        setError("Невірний код або пароль");
      }
      console.error(err);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded-lg shadow bg-white">
      <h2 className="text-xl font-semibold mb-4 text-center">Telegram Login</h2>

      {step === "phone" && (
        <>
          <label className="text-gray-500 mb-1">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+380123456789"
            className="w-full px-3 py-2 border rounded-md mb-3"
          />
          <button
            onClick={handleSendCode}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Надіслати код
          </button>
        </>
      )}

      {step === "code" && (
        <>
          <label className="text-gray-500 mb-1">Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Код із Telegram"
            className="w-full px-3 py-2 border rounded-md mb-3"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="2FA password"
            className="w-full px-3 py-2 border rounded-md mb-3"
          />
          <button
            onClick={handleSignIn}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Увійти
          </button>
        </>
      )}

      {error && (
        <p className="text-red-500 mt-3 text-sm text-center">{error}</p>
      )}
    </div>
  );
};

export default TelegramAuthForm;
