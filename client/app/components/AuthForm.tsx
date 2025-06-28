"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const AuthForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log(data);
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
          Login
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
