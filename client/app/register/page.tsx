import AuthForm from "@/components/AuthForm";
import Link from "next/link";

export default function Register() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold">Telegram Chat Reader</h1>
        <p className="text-gray-500">
          A simple way to read your Telegram chats
        </p>
        <AuthForm type="register" />
        <p className="text-gray-500">
          Already registered?{" "}
          <Link href="/" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </>
  );
}
