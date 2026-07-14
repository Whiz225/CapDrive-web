"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store";
import { authAPI } from "@/services/api";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      const refreshToken = searchParams.get("refreshToken");
      const userId = searchParams.get("userId");
      const errorParam = searchParams.get("error");

      console.log("Callback params:", {
        token,
        refreshToken,
        userId,
        errorParam,
      });

      if (errorParam) {
        setError(errorParam);
        setLoading(false);
        toast.error("Google authentication failed");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      if (!token || !userId) {
        setError("Invalid callback parameters");
        setLoading(false);
        toast.error("Invalid authentication callback");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      try {
        // Get user data from backend
        const response = await authAPI.handleGoogleCallback({
          token,
          refreshToken,
          userId,
        });

        console.log("Google callback response:", response.data);

        if (response.data.success) {
          const {
            user,
            token: newToken,
            refreshToken: newRefreshToken,
          } = response.data.data;
          setAuth(user, newToken, newRefreshToken);

          toast.success(`Welcome ${user.firstName || "User"}!`);

          // Redirect based on profile completion
          if (!user.profileCompleted) {
            router.push("/complete-profile");
          } else if (!user.isEmailVerified || !user.isPhoneVerified) {
            router.push("/verify");
          } else {
            // Redirect based on role
            if (user.role === "admin") {
              router.push("/admin");
            } else if (user.role === "dealer") {
              router.push("/dealer");
            } else {
              router.push("/");
            }
          }
        } else {
          throw new Error(
            response.data.message || "Failed to authenticate with Google"
          );
        }
      } catch (error) {
        console.error("Google callback error:", error);
        setError(error.message || "Authentication failed");
        toast.error(
          error.response?.data?.message || "Failed to authenticate with Google"
        );
        setTimeout(() => router.push("/login"), 2000);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, router, setAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">
            Authenticating with Google...
          </h2>
          <p className="text-gray-600 mt-2">
            Please wait while we complete your sign in.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Authentication Failed
          </h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}
