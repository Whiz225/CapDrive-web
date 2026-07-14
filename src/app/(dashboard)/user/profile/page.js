"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import Layout from "../../../../components/Layout";
import { useAuthStore } from "../../../../store";
import { userAPI } from "../../../../services/api";
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
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import SimpleLayout from "@/components/SimpleLayout";

export default function UserProfilePage() {
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

  return (
    <SimpleLayout title="My Profile - CapDrive">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 px-6 py-8 sm:px-10">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-white p-1">
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
                  <div className="absolute bottom-0 right-0">
                    <label className="cursor-pointer">
                      <div className="h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <CameraIcon className="h-4 w-4 text-gray-600" />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                )}
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold text-white">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </h2>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                    <ShieldCheckIcon
                      className={`h-4 w-4 ${
                        verificationPercentage === 100
                          ? "text-green-400"
                          : verificationPercentage >= 40
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                    <span className="text-xs font-medium text-white">
                      {verificationPercentage}% Verified
                    </span>
                  </div>
                </div>
                <p className="text-primary-100 mt-1">
                  {currentUser?.role === "dealer" ? "Dealer" : "Member"} •
                  <span className="ml-1">
                    Joined{" "}
                    {currentUser?.createdAt
                      ? new Date(currentUser.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="ml-auto mt-4 sm:mt-0 px-4 py-2 bg-white text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors flex items-center"
              >
                {isEditing ? (
                  <>
                    <XMarkIcon className="h-5 w-5 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <PencilIcon className="h-5 w-5 mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Avatar Upload Controls */}
          {avatarFile && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                New avatar selected
              </span>
              <div className="flex space-x-3">
                <button
                  onClick={cancelAvatarUpload}
                  className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAvatarUpload}
                  disabled={updateAvatarMutation.isLoading}
                  className="px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {updateAvatarMutation.isLoading
                    ? "Uploading..."
                    : "Upload Avatar"}
                </button>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onProfileSubmit)}
            className="px-6 py-8 sm:px-10"
          >
            {/* Form fields - same as above */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* ... same form fields as profile page ... */}
            </div>

            {/* Account Info */}
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Role
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">
                    {currentUser?.role}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Member Since
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {currentUser?.createdAt
                      ? new Date(currentUser.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isLoading}
                  className="flex items-center px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {updateProfileMutation.isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-5 w-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </SimpleLayout>
  );
}

// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import Layout from "@/components/Layout";
// import { useAuthStore } from "@/store";
// import { userAPI } from "@/services/api";
// import {
//   UserCircleIcon,
//   CameraIcon,
//   EnvelopeIcon,
//   PhoneIcon,
//   MapPinIcon,
//   PencilIcon,
//   CheckIcon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";
// import toast from "react-hot-toast";

// export default function UserProfile() {
//   const router = useRouter();
//   const { user, isAuthenticated, updateUser } = useAuthStore();
//   const [isEditing, setIsEditing] = useState(false);
//   const [avatarFile, setAvatarFile] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState(null);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm();

//   // Fetch user profile
//   const { data: profile, isLoading } = useQuery({
//     queryKey: ["user-profile"],
//     queryFn: () => userAPI.getProfile(),
//     enabled: isAuthenticated,
//   });

//   // Update profile mutation
//   const updateProfileMutation = useMutation({
//     mutationFn: (data) => userAPI.updateProfile(data),
//     onSuccess: (response) => {
//       updateUser(response.data);
//       toast.success("Profile updated successfully");
//       setIsEditing(false);
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || "Failed to update profile");
//     },
//   });

//   // Update avatar mutation
//   const updateAvatarMutation = useMutation({
//     mutationFn: (data) => userAPI.updateAvatar(data),
//     onSuccess: (response) => {
//       updateUser({ avatar: response.data.avatar });
//       toast.success("Avatar updated successfully");
//       setAvatarFile(null);
//       setAvatarPreview(null);
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || "Failed to update avatar");
//     },
//   });

//   useEffect(() => {
//     if (profile?.data) {
//       setValue("firstName", profile.data.firstName);
//       setValue("lastName", profile.data.lastName);
//       setValue("email", profile.data.email);
//       setValue("phone", profile.data.phone);
//       setValue("address", profile.data.address || "");
//     }
//   }, [profile, setValue]);

//   const onProfileSubmit = (data) => {
//     updateProfileMutation.mutate(data);
//   };

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) {
//         toast.error("Image size should be less than 2MB");
//         return;
//       }
//       setAvatarFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setAvatarPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleAvatarUpload = () => {
//     if (avatarFile) {
//       const formData = new FormData();
//       formData.append("avatar", avatarFile);
//       updateAvatarMutation.mutate(formData);
//     }
//   };

//   const cancelAvatarUpload = () => {
//     setAvatarFile(null);
//     setAvatarPreview(null);
//   };

//   if (!isAuthenticated) {
//     router.push("/login");
//     return null;
//   }

//   return (
//     <Layout title="My Profile - Car Marketplace">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
//           {/* Profile Header */}
//           <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8 sm:px-10">
//             <div className="flex flex-col sm:flex-row items-center">
//               {/* Avatar */}
//               <div className="relative">
//                 <div className="h-24 w-24 rounded-full bg-white p-1">
//                   <img
//                     src={
//                       avatarPreview ||
//                       profile?.data?.avatar ||
//                       "/default-avatar.png"
//                     }
//                     alt={`${user?.firstName} ${user?.lastName}`}
//                     className="h-full w-full rounded-full object-cover"
//                   />
//                 </div>
//                 {isEditing && (
//                   <div className="absolute bottom-0 right-0">
//                     <label className="cursor-pointer">
//                       <div className="h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
//                         <CameraIcon className="h-4 w-4 text-gray-600" />
//                       </div>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         className="hidden"
//                         onChange={handleAvatarChange}
//                       />
//                     </label>
//                   </div>
//                 )}
//               </div>
//               <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
//                 <h2 className="text-2xl font-bold text-white">
//                   {user?.firstName} {user?.lastName}
//                 </h2>
//                 <p className="text-primary-100">
//                   {user?.role === "dealer" ? "Dealer" : "Member"} since{" "}
//                   {new Date(user?.createdAt).getFullYear()}
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsEditing(!isEditing)}
//                 className="ml-auto mt-4 sm:mt-0 px-4 py-2 bg-white text-primary-600 rounded-md text-sm font-medium hover:bg-primary-50 transition-colors flex items-center"
//               >
//                 {isEditing ? (
//                   <>
//                     <XMarkIcon className="h-5 w-5 mr-2" />
//                     Cancel
//                   </>
//                 ) : (
//                   <>
//                     <PencilIcon className="h-5 w-5 mr-2" />
//                     Edit Profile
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Avatar Upload Controls */}
//           {avatarFile && (
//             <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
//               <span className="text-sm text-gray-600">New avatar selected</span>
//               <div className="flex space-x-3">
//                 <button
//                   onClick={cancelAvatarUpload}
//                   className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleAvatarUpload}
//                   disabled={updateAvatarMutation.isLoading}
//                   className="px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 disabled:opacity-50"
//                 >
//                   {updateAvatarMutation.isLoading
//                     ? "Uploading..."
//                     : "Upload Avatar"}
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Profile Form */}
//           <form
//             onSubmit={handleSubmit(onProfileSubmit)}
//             className="px-6 py-8 sm:px-10"
//           >
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   First Name
//                 </label>
//                 <input
//                   {...register("firstName", {
//                     required: "First name is required",
//                   })}
//                   type="text"
//                   disabled={!isEditing}
//                   className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
//                     !isEditing ? "bg-gray-50" : ""
//                   }`}
//                 />
//                 {errors.firstName && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.firstName.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Last Name
//                 </label>
//                 <input
//                   {...register("lastName", {
//                     required: "Last name is required",
//                   })}
//                   type="text"
//                   disabled={!isEditing}
//                   className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
//                     !isEditing ? "bg-gray-50" : ""
//                   }`}
//                 />
//                 {errors.lastName && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.lastName.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   <EnvelopeIcon className="h-4 w-4 inline mr-1" />
//                   Email
//                 </label>
//                 <input
//                   {...register("email")}
//                   type="email"
//                   disabled
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   <PhoneIcon className="h-4 w-4 inline mr-1" />
//                   Phone
//                 </label>
//                 <input
//                   {...register("phone")}
//                   type="tel"
//                   disabled={!isEditing}
//                   className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
//                     !isEditing ? "bg-gray-50" : ""
//                   }`}
//                 />
//               </div>

//               <div className="sm:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   <MapPinIcon className="h-4 w-4 inline mr-1" />
//                   Address
//                 </label>
//                 <textarea
//                   {...register("address")}
//                   rows="3"
//                   disabled={!isEditing}
//                   className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
//                     !isEditing ? "bg-gray-50" : ""
//                   }`}
//                   placeholder="Enter your address"
//                 />
//               </div>
//             </div>

//             {/* Profile Stats */}
//             <div className="mt-8 border-t border-gray-200 pt-8">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">
//                 Account Statistics
//               </h3>
//               <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//                 <div className="bg-gray-50 rounded-lg p-4 text-center">
//                   <p className="text-2xl font-bold text-gray-900">
//                     {profile?.data?.stats?.listings || 0}
//                   </p>
//                   <p className="text-sm text-gray-600">Listings</p>
//                 </div>
//                 <div className="bg-gray-50 rounded-lg p-4 text-center">
//                   <p className="text-2xl font-bold text-gray-900">
//                     {profile?.data?.stats?.favorites || 0}
//                   </p>
//                   <p className="text-sm text-gray-600">Favorites</p>
//                 </div>
//                 <div className="bg-gray-50 rounded-lg p-4 text-center">
//                   <p className="text-2xl font-bold text-gray-900">
//                     {profile?.data?.stats?.bookings || 0}
//                   </p>
//                   <p className="text-sm text-gray-600">Bookings</p>
//                 </div>
//                 <div className="bg-gray-50 rounded-lg p-4 text-center">
//                   <p className="text-2xl font-bold text-gray-900">
//                     {profile?.data?.stats?.rides || 0}
//                   </p>
//                   <p className="text-sm text-gray-600">Rides</p>
//                 </div>
//               </div>
//             </div>

//             {/* Save Button */}
//             {isEditing && (
//               <div className="mt-8 flex justify-end">
//                 <button
//                   type="submit"
//                   disabled={updateProfileMutation.isLoading}
//                   className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
//                 >
//                   {updateProfileMutation.isLoading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <CheckIcon className="h-5 w-5 mr-2" />
//                       Save Changes
//                     </>
//                   )}
//                 </button>
//               </div>
//             )}
//           </form>
//         </div>
//       </div>
//     </Layout>
//   );
// }
