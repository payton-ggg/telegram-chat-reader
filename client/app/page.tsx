import AuthForm from "../components/AuthForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Telegram Chat Reader</h1>
      <p className="text-gray-500">A simple way to read your Telegram chats</p>
      <AuthForm />
    </div>
  );
}
