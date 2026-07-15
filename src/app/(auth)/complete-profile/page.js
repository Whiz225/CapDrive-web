"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store";
import { userAPI, authAPI } from "@/services/api";
import {
  CameraIcon,
  UserIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [selectedRole, setSelectedRole] = useState("user");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isGoogleUser = user?.googleId;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      country: user?.country || "Nigeria",
      zipCode: user?.zipCode || "",
      companyName: user?.dealerProfile?.companyName || "",
      companyAddress: user?.dealerProfile?.companyAddress || "",
      dealerType: user?.dealerProfile?.dealerType || "individual",
      businessRegistration: user?.dealerProfile?.businessRegistration || "",
    },
  });

  const isDealer = selectedRole === "dealer";

  // Set mounted state to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Single mutation for complete profile with avatar
  const completeProfileMutation = useMutation({
    mutationFn: async (formData) => {
      // If avatar file exists, upload it with the profile data
      if (avatarFile) {
        const formDataWithAvatar = new FormData();
        formDataWithAvatar.append("avatar", avatarFile);
        formDataWithAvatar.append("data", JSON.stringify(formData));
        formDataWithAvatar.append("role", selectedRole);

        if (isGoogleUser) {
          return authAPI.completeGoogleProfileWithAvatar(formDataWithAvatar);
        }
        return userAPI.completeProfileWithAvatar(formDataWithAvatar);
      }

      // No avatar, just send profile data
      if (isGoogleUser) {
        return authAPI.completeGoogleProfile({
          ...formData,
          role: selectedRole,
        });
      }
      return userAPI.completeProfile({ ...formData, role: selectedRole });
    },
    onSuccess: (response) => {
      updateUser(response.data.user);
      toast.success("Profile completed successfully!");
      router.push("/verify");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to complete profile"
      );
    },
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    if (!agreeToTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    completeProfileMutation.mutate(data);
  };

  // If profile is already completed, redirect
  useEffect(() => {
    if (user?.profileCompleted) {
      router.push("/verify");
    }
  }, [user, router]);

  // Get user initials safely
  const getInitials = () => {
    if (!user) return "";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase();
  };

  // Don't render on server to avoid hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Complete Your Profile
            </h2>
            <p className="mt-2 text-gray-600">
              Please select your account type and provide the required
              information.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-full w-full object-cover"
                    />
                  ) : user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary-100">
                      <span className="text-2xl font-semibold text-primary-600">
                        {getInitials() || "U"}
                      </span>
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
                  <CameraIcon className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Click the camera icon to upload a photo
              </p>
            </div>

            {/* Role Selection */}
            <div className="border-b border-gray-200 pb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Account Type *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedRole("user")}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    selectedRole === "user"
                      ? "border-primary-600 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <UserIcon
                    className={`h-8 w-8 mx-auto mb-2 ${
                      selectedRole === "user"
                        ? "text-primary-600"
                        : "text-gray-400"
                    }`}
                  />
                  <div
                    className={`font-medium ${
                      selectedRole === "user"
                        ? "text-primary-600"
                        : "text-gray-700"
                    }`}
                  >
                    User
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Buy cars & book rides
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("dealer")}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    selectedRole === "dealer"
                      ? "border-primary-600 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <BuildingOfficeIcon
                    className={`h-8 w-8 mx-auto mb-2 ${
                      selectedRole === "dealer"
                        ? "text-primary-600"
                        : "text-gray-400"
                    }`}
                  />
                  <div
                    className={`font-medium ${
                      selectedRole === "dealer"
                        ? "text-primary-600"
                        : "text-gray-700"
                    }`}
                  >
                    Dealer
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Sell cars & manage listings
                  </p>
                </button>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  {...register("address", { required: "Address is required" })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 text-gray-900/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="123 Main St"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  {...register("city", { required: "City is required" })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 text-gray-900/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Lagos"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  {...register("state", { required: "State is required" })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 text-gray-900/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Lagos"
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.state.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  {...register("country")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 text-gray-900/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Nigeria"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  {...register("zipCode")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 text-gray-900/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="100001"
                />
              </div>
            </div>

            {/* Dealer specific fields */}
            {isDealer && (
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Dealer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      {...register("companyName", {
                        required: isDealer ? "Company name is required" : false,
                      })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 text-gray-900/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Premium Cars Ltd"
                    />
                    {errors.companyName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Address *
                    </label>
                    <input
                      {...register("companyAddress", {
                        required: isDealer
                          ? "Company address is required"
                          : false,
                      })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 text-gray-900/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="456 Business Ave"
                    />
                    {errors.companyAddress && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.companyAddress.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dealer Type
                    </label>
                    <select
                      {...register("dealerType")}
                      className="w-full px-3 py-2 border border-gray-300 text-gray-900/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="individual">Individual</option>
                      <option value="dealership">Dealership</option>
                      <option value="import">Import</option>
                      <option value="export">Export</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Registration (Optional)
                    </label>
                    <input
                      {...register("businessRegistration")}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 text-gray-900/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="RC Number"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Terms and Privacy Agreement */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeToTerms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="h-4 w-4 text-gray-900/80 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
                  />
                </div>
                <div className="ml-3">
                  <label
                    htmlFor="agreeToTerms"
                    className="text-sm text-gray-700"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      target="_blank"
                      className="text-primary-600 hover:text-primary-500 font-medium"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      className="text-primary-600 hover:text-primary-500 font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    By creating an account, you agree to our terms and privacy
                    policy.
                  </p>
                </div>
              </div>
              {!agreeToTerms && (
                <p className="mt-2 text-sm text-red-600">
                  You must agree to the Terms of Service and Privacy Policy to
                  continue.
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={completeProfileMutation.isLoading}
                className="flex-1 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {completeProfileMutation.isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Complete Profile & Agree"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
