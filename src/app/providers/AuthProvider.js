"use client";

import { useEffect } from "react";
import { useAuthStore } from "../../store";
import { useRouter } from "next/navigation";

export function AuthProvider({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on mount
    const storedAuth = localStorage.getItem("auth-storage");
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        if (authData.state?.isAuthenticated) {
          // User is authenticated
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
      }
    }
  }, []);

  return <>{children}</>;
}
