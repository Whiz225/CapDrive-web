"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import Layout from "../../components/Layout";
import { useAuthStore } from "../../store";
import { userAPI } from "../../services/api";
import {
  UserCircleIcon,
  CameraIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ChartBarIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import SimpleLayout from "@/components/SimpleLayout";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser, refreshUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch user profile
  const {
    data: profile,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await userAPI.getProfile();
      if (response.data.success) {
        updateUser(response.data.data);
        return response.data;
      }
      return response.data;
    },
    enabled: isAuthenticated && isMounted,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data) => userAPI.updateProfile(data),
    onSuccess: (response) => {
      updateUser(response.data);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  // Update avatar mutation
  const updateAvatarMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await userAPI.updateAvatar(formData);
      return response.data;
    },
    onSuccess: (response) => {
      updateUser({ avatar: response.data.avatar });
      toast.success("Avatar updated successfully");
      setAvatarFile(null);
      setAvatarPreview(null);
      refetch();
    },
    onError: (error) => {
      console.error("Avatar upload error:", error);
      toast.error(error.response?.data?.message || "Failed to update avatar");
    },
  });

  useEffect(() => {
    if (profile?.data) {
      setValue("firstName", profile.data.firstName);
      setValue("lastName", profile.data.lastName);
      setValue("email", profile.data.email);
      setValue("phone", profile.data.phone);
      setValue("address", profile.data.address || "");
      setValue("city", profile.data.city || "");
      setValue("state", profile.data.state || "");
      setValue("country", profile.data.country || "Nigeria");
      setValue("zipCode", profile.data.zipCode || "");
    }
  }, [profile, setValue]);

  useEffect(() => {
    if (isAuthenticated && isMounted) {
      refreshUser();
    }
  }, [isAuthenticated, isMounted]);

  const onProfileSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

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

  const handleAvatarUpload = () => {
    if (avatarFile) {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      updateAvatarMutation.mutate(formData);
    }
  };

  const cancelAvatarUpload = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  // Don't render on server
  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  const currentUser = profile?.data || user;

  const getVerificationPercentage = () => {
    let percentage = 0;
    if (currentUser?.isEmailVerified) percentage += 20;
    if (currentUser?.isPhoneVerified) percentage += 20;
    if (currentUser?.isIdVerified) percentage += 60;
    return percentage;
  };

  const verificationPercentage =
    currentUser?.verificationPercentage || getVerificationPercentage();

  const stats = [
    {
      label: "Listings",
      value: profile?.data?.stats?.listings || 0,
      icon: BuildingOfficeIcon,
    },
    {
      label: "Favorites",
      value: profile?.data?.stats?.favorites || 0,
      icon: StarIcon,
    },
    {
      label: "Bookings",
      value: profile?.data?.stats?.bookings || 0,
      icon: CalendarIcon,
    },
    {
      label: "Rides",
      value: profile?.data?.stats?.rides || 0,
      icon: ChartBarIcon,
    },
  ];

  return (
    <SimpleLayout title="My Profile - CapDrive">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-20 transition-colors duration-300">
              {/* Profile Header */}
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 px-4 sm:px-6 py-6 sm:py-8 text-center">
                <div className="relative inline-block">
                  <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-white p-1 mx-auto shadow-lg">
                    <img
                      src={
                        avatarPreview ||
                        currentUser?.avatar ||
                        "/default-avatar.png"
                      }
                      alt={`${currentUser?.firstName} ${currentUser?.lastName}`}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 cursor-pointer">
                      <div className="h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-primary-500">
                        <CameraIcon className="h-4 w-4 text-primary-600" />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white mt-3 sm:mt-4">
                  {currentUser?.firstName} {currentUser?.lastName}
                </h2>
                <p className="text-primary-100 text-xs sm:text-sm">
                  {currentUser?.role === "dealer" ? "Dealer" : "Member"}
                </p>

                {/* Verification Badge */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 px-3 sm:px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                  <ShieldCheckIcon
                    className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                      verificationPercentage === 100
                        ? "text-green-400"
                        : verificationPercentage >= 40
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                  <span className="text-xs sm:text-sm font-medium text-white">
                    {verificationPercentage}% Verified
                  </span>
                </div>

                {/* Avatar Upload Controls */}
                {avatarFile && (
                  <div className="mt-3 sm:mt-4 flex justify-center gap-2 flex-wrap">
                    <button
                      onClick={cancelAvatarUpload}
                      className="px-3 py-1 text-xs bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAvatarUpload}
                      disabled={updateAvatarMutation.isLoading}
                      className="px-3 py-1 text-xs bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50"
                    >
                      {updateAvatarMutation.isLoading
                        ? "Uploading..."
                        : "Upload"}
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="p-3 sm:p-4 grid grid-cols-2 gap-2 sm:gap-3 border-b border-gray-100 dark:border-gray-700">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                  >
                    <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500 mx-auto mb-1" />
                    <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Account Info */}
              <div className="p-3 sm:p-4 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">Role</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {currentUser?.role}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">
                    Joined
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {currentUser?.createdAt
                      ? new Date(currentUser.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">
                    Status
                  </span>
                  <span
                    className={`font-medium ${
                      currentUser?.profileCompleted
                        ? "text-green-600 dark:text-green-400"
                        : "text-yellow-600 dark:text-yellow-400"
                    }`}
                  >
                    {currentUser?.profileCompleted
                      ? "Complete ✓"
                      : "Incomplete"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    Verification
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full">
                      <div
                        className="h-1.5 bg-primary-600 rounded-full transition-all"
                        style={{ width: `${verificationPercentage}%` }}
                      />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white text-xs">
                      {verificationPercentage}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="p-3 sm:p-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`w-full py-2.5 rounded-xl font-medium transition-all text-sm ${
                    isEditing
                      ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                      : "bg-primary-600 text-white hover:bg-primary-700"
                  }`}
                >
                  {isEditing ? (
                    <>
                      <XMarkIcon className="h-4 w-4 inline mr-2" />
                      Cancel Editing
                    </>
                  ) : (
                    <>
                      <PencilIcon className="h-4 w-4 inline mr-2" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/30 p-4 sm:p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  {isEditing ? "Edit Profile" : "Profile Information"}
                </h3>
                {isEditing && (
                  <span className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                    Editing Mode
                  </span>
                )}
              </div>

              <form onSubmit={handleSubmit(onProfileSubmit)}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      First Name
                    </label>
                    <input
                      {...register("firstName", {
                        required: "First name is required",
                      })}
                      type="text"
                      disabled={!isEditing}
                      className={`w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm ${
                        !isEditing
                          ? "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Last Name
                    </label>
                    <input
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                      type="text"
                      disabled={!isEditing}
                      className={`w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm ${
                        !isEditing
                          ? "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      <EnvelopeIcon className="h-4 w-4 inline mr-1.5" />
                      Email
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      <PhoneIcon className="h-4 w-4 inline mr-1.5" />
                      Phone
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      disabled={!isEditing}
                      className={`w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm ${
                        !isEditing
                          ? "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      <MapPinIcon className="h-4 w-4 inline mr-1.5" />
                      Address
                    </label>
                    <input
                      {...register("address")}
                      type="text"
                      disabled={!isEditing}
                      className={`w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm ${
                        !isEditing
                          ? "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      }`}
                      placeholder="Enter your address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      City
                    </label>
                    <input
                      {...register("city")}
                      type="text"
                      disabled={!isEditing}
                      className={`w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm ${
                        !isEditing
                          ? "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      }`}
                      placeholder="Enter your city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      State
                    </label>
                    <input
                      {...register("state")}
                      type="text"
                      disabled={!isEditing}
                      className={`w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm ${
                        !isEditing
                          ? "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      }`}
                      placeholder="Enter your state"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Country
                    </label>
                    <input
                      {...register("country")}
                      type="text"
                      disabled={!isEditing}
                      className={`w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm ${
                        !isEditing
                          ? "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      }`}
                      placeholder="Nigeria"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      ZIP Code
                    </label>
                    <input
                      {...register("zipCode")}
                      type="text"
                      disabled={!isEditing}
                      className={`w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm ${
                        !isEditing
                          ? "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      }`}
                      placeholder="Enter your zip code"
                    />
                  </div>
                </div>

                {/* Dealer Info (if dealer) */}
                {currentUser?.role === "dealer" &&
                  currentUser?.dealerProfile && (
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <BuildingOfficeIcon className="h-4 w-4" />
                        Dealer Information
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Company
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {currentUser.dealerProfile.companyName || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Address
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {currentUser.dealerProfile.companyAddress || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Type
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {currentUser.dealerProfile.dealerType ||
                              "Individual"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Status
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {currentUser.dealerProfile.isVerified
                              ? "✓ Verified"
                              : "Pending Verification"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Save Button */}
                {isEditing && (
                  <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateProfileMutation.isLoading}
                      className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    >
                      {updateProfileMutation.isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckIcon className="h-5 w-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}
