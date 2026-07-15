"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Layout from "../../components/Layout";
import { useAuthStore } from "../../store";
import { useTheme } from "../../context/ThemeContext";
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  LanguageIcon,
  MoonIcon,
  SunIcon,
  CreditCardIcon,
  ArrowRightOnRectangleIcon,
  TrashIcon,
  ChevronRightIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import SimpleLayout from "@/components/SimpleLayout";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { darkMode, toggleTheme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const settingsSections = [
    {
      title: "Account Settings",
      icon: UserCircleIcon,
      items: [
        {
          icon: UserCircleIcon,
          label: "Profile",
          description: "Manage your personal information",
          href: "/profile",
          color: "text-blue-500",
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
        },
        {
          icon: KeyIcon,
          label: "Security",
          description: "Password and security settings",
          href: "/settings/security",
          color: "text-green-500",
          bgColor: "bg-green-50 dark:bg-green-900/20",
        },
        {
          icon: DevicePhoneMobileIcon,
          label: "Phone",
          description: "Manage your phone number",
          href: "/settings/phone",
          color: "text-indigo-500",
          bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
        },
        {
          icon: CreditCardIcon,
          label: "Payments",
          description: "Manage payment methods and history",
          href: "/settings/payments",
          color: "text-purple-500",
          bgColor: "bg-purple-50 dark:bg-purple-900/20",
        },
      ],
    },
    {
      title: "Preferences",
      icon: BellIcon,
      items: [
        {
          icon: BellIcon,
          label: "Notifications",
          description: "Manage notification preferences",
          href: "/settings/notifications",
          color: "text-yellow-500",
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        },
        {
          icon: LanguageIcon,
          label: "Language",
          description: "Select your preferred language",
          href: "/settings/language",
          color: "text-red-500",
          bgColor: "bg-red-50 dark:bg-red-900/20",
        },
      ],
    },
  ];

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      try {
        setIsLoggingOut(true);
        await logout();
        toast.success("Logged out successfully");
        router.push("/login");
      } catch (error) {
        toast.error("Failed to logout");
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      toast.error("Account deletion not implemented yet");
    }
  };

  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <SimpleLayout title="Settings - CapDrive">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6 md:space-y-8">
          {settingsSections.map((section) => (
            <div key={section.title}>
              <div className="flex items-center mb-3 md:mb-4">
                <section.icon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/30 divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden border border-gray-100 dark:border-gray-700">
                {section.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center p-3 md:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                  >
                    <div
                      className={`p-2.5 rounded-xl ${item.bgColor} group-hover:scale-105 transition-transform`}
                    >
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div className="ml-3 md:ml-4 flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                        {item.label}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Appearance - Theme Toggle */}
          <div>
            <div className="flex items-center mb-3 md:mb-4">
              {darkMode ? (
                <MoonIcon className="h-5 w-5 text-indigo-400 mr-2" />
              ) : (
                <SunIcon className="h-5 w-5 text-yellow-500 mr-2" />
              )}
              <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                Appearance
              </h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/30 p-4 md:p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? (
                    <MoonIcon className="h-6 w-6 text-indigo-400" />
                  ) : (
                    <SunIcon className="h-6 w-6 text-yellow-500" />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                      {darkMode ? "Dark Mode" : "Light Mode"}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      {darkMode
                        ? "Switch to light mode for a brighter experience"
                        : "Switch to dark mode for a more comfortable experience"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    darkMode ? "bg-primary-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      darkMode ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div>
            <div className="flex items-center mb-3 md:mb-4">
              <ShieldCheckIcon className="h-5 w-5 text-red-500 mr-2" />
              <h2 className="text-base md:text-lg font-semibold text-red-600 dark:text-red-400">
                Danger Zone
              </h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/30 divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden border border-red-200 dark:border-red-800">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 gap-3 sm:gap-0">
                <div className="flex items-center gap-3">
                  <ArrowRightOnRectangleIcon className="h-6 w-6 text-red-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                      Logout
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      Sign out of your account
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 gap-3 sm:gap-0">
                <div className="flex items-center gap-3">
                  <TrashIcon className="h-6 w-6 text-red-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                      Delete Account
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      Permanently delete your account and all data
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full sm:w-auto px-4 py-2 border-2 border-red-500 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}
