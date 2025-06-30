"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, initialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    useAuthStore.getState().init();
  }, []);

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, initialized, router]);

  if (!initialized) {
    return <div>Завантаження...</div>;
  }

  return <>{children}</>;
}
