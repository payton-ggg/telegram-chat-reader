"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { login, Register } from "@/lib/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const AuthForm = ({ type }: { type: "register" | "login" }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();
  const [success, setSuccess] = useState<boolean>(false);

  const setToken = useAuthStore((state) => state.setToken);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      let token: string | null = null;

      if (type === "register") {
        token = await Register(data);
        if (token) {
          setToken(token);
        }
      } else {
        token = await login(data);
        if (token) {
          setToken(token);
        }
        router.push("/dashboard");
      }

      setSuccess(true);
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col mt-2">
        <label htmlFor="email" className="text-gray-500">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div className="flex flex-col mt-2">
        <label htmlFor="password" className="text-gray-500">
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          id="password"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div className="flex flex-col mt-2">
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md px-3 py-2"
        >
          {type === "register" ? "Register" : "Login"}
        </button>
      </div>
      {success && <p className="text-green-500">Success!</p>}
    </form>
  );
};

export default AuthForm;
