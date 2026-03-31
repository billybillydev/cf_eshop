"use client";

import { useAuth } from "$pages/authentication/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRequireAuth(redirectTo: string = "/login") {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace(redirectTo);
    }
  }, [token, redirectTo, router]);

  return { token };
}
