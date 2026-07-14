"use client";

import React, { useState, Fragment } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import {
  UserCircleIcon,
  HeartIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  PlusCircleIcon,
  TruckIcon,
  HomeIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useAuthStore } from "../store";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { darkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navigation = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Browse Cars", href: "/cars", icon: TruckIcon },
    { name: "Ride", href: "/ride", icon: TruckIcon },
    { name: "Sell Car", href: "/sell", icon: PlusCircleIcon },
  ];

  // Check if user has any favorites (for red heart indicator)
  const hasFavorites = user?.favorites?.length > 0;

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        darkMode ? "bg-gray-800 border-b border-gray-700" : "bg-white shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-600">
                Cap
                <span
                  className={darkMode ? "text-white" : "text-secondary-900"}
                >
                  Drive
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-secondary-700 hover:text-primary-600"
                  } px-3 py-2 text-sm font-medium transition-colors`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Favorites - Always visible, shows red heart if has favorites */}
            <Link
              href="/favorites"
              className={`p-2 rounded-full transition-colors ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              } relative`}
              aria-label="Favorites"
            >
              {hasFavorites ? (
                <HeartSolid className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon
                  className={`h-5 w-5 ${
                    darkMode ? "text-gray-400" : "text-secondary-600"
                  }`}
                />
              )}
            </Link>

            {/* Notifications */}
            {isAuthenticated && (
              <button
                className={`p-2 rounded-full transition-colors ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                } relative`}
              >
                <BellIcon
                  className={`h-5 w-5 ${
                    darkMode ? "text-gray-400" : "text-secondary-600"
                  }`}
                />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            )}

            {/* User Actions */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {/* Profile - Direct link */}
                <Link
                  href="/profile"
                  className={`flex items-center space-x-2 p-1 rounded-full transition-colors ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <img
                    src={user?.avatar || "/default-avatar.png"}
                    alt={user?.firstName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span
                    className={`text-sm font-medium hidden lg:inline ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {user?.firstName}
                  </span>
                </Link>

                {/* Settings Dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button
                    className={`p-2 rounded-full transition-colors ${
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    }`}
                  >
                    <Cog6ToothIcon
                      className={`h-5 w-5 ${
                        darkMode ? "text-gray-400" : "text-secondary-600"
                      }`}
                    />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                      className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 z-10 ${
                        darkMode
                          ? "bg-gray-800 border border-gray-700"
                          : "bg-white"
                      }`}
                    >
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/profile"
                            className={`${
                              active
                                ? darkMode
                                  ? "bg-gray-700"
                                  : "bg-gray-100"
                                : ""
                            } flex items-center px-4 py-2.5 text-sm ${
                              darkMode
                                ? "text-gray-300 hover:text-white"
                                : "text-secondary-700"
                            } transition-colors`}
                          >
                            <UserCircleIcon
                              className={`h-5 w-5 mr-3 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            />
                            Profile
                          </Link>
                        )}
                      </Menu.Item>

                      {/* Theme Toggle in Menu */}
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={toggleTheme}
                            className={`${
                              active
                                ? darkMode
                                  ? "bg-gray-700"
                                  : "bg-gray-100"
                                : ""
                            } flex items-center w-full px-4 py-2.5 text-sm ${
                              darkMode
                                ? "text-gray-300 hover:text-white"
                                : "text-secondary-700"
                            } transition-colors`}
                          >
                            {darkMode ? (
                              <>
                                <SunIcon className="h-5 w-5 mr-3 text-yellow-400" />
                                Light Mode
                              </>
                            ) : (
                              <>
                                <MoonIcon className="h-5 w-5 mr-3 text-gray-500" />
                                Dark Mode
                              </>
                            )}
                          </button>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/settings"
                            className={`${
                              active
                                ? darkMode
                                  ? "bg-gray-700"
                                  : "bg-gray-100"
                                : ""
                            } flex items-center px-4 py-2.5 text-sm ${
                              darkMode
                                ? "text-gray-300 hover:text-white"
                                : "text-secondary-700"
                            } transition-colors`}
                          >
                            <Cog6ToothIcon
                              className={`h-5 w-5 mr-3 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            />
                            Settings
                          </Link>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${
                              active
                                ? darkMode
                                  ? "bg-gray-700"
                                  : "bg-gray-100"
                                : ""
                            } flex items-center w-full px-4 py-2.5 text-sm text-red-600 ${
                              darkMode ? "hover:text-red-400" : ""
                            } transition-colors border-t ${
                              darkMode ? "border-gray-700" : "border-gray-100"
                            } mt-1 pt-3`}
                          >
                            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 text-red-500" />
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
