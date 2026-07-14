"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Layout from "../../../components/Layout";
import { useAuthStore } from "../../../store";
import {
  HeartIcon,
  CalendarIcon,
  CarIcon,
  TruckIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { userAPI } from "../../../services/api";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function UserDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      router.push("/admin");
    } else if (isAuthenticated && user?.role === "dealer") {
      router.push("/dealer");
    }
  }, [isAuthenticated, user, router]);

  // Fetch user stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["user-stats"],
    queryFn: () => userAPI.getStats(),
    enabled: isAuthenticated && user?.role === "user",
  });

  // Fetch recent bookings
  const { data: bookings } = useQuery({
    queryKey: ["user-bookings"],
    queryFn: () => userAPI.getBookings({ limit: 5 }),
    enabled: isAuthenticated && user?.role === "user",
  });

  // Fetch recent rides
  const { data: rides } = useQuery({
    queryKey: ["user-rides"],
    queryFn: () => userAPI.getRides({ limit: 5 }),
    enabled: isAuthenticated && user?.role === "user",
  });

  // Fetch favorites
  const { data: favorites } = useQuery({
    queryKey: ["user-favorites"],
    queryFn: () => userAPI.getFavorites(),
    enabled: isAuthenticated && user?.role === "user",
  });

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  const statCards = [
    {
      title: "Favorites",
      value: stats?.data?.favorites || 0,
      icon: HeartIcon,
      color: "bg-red-500",
      link: "/user/favorites",
    },
    {
      title: "Bookings",
      value: stats?.data?.bookings || 0,
      icon: CalendarIcon,
      color: "bg-blue-500",
      link: "/user/bookings",
    },
    {
      title: "Rides",
      value: stats?.data?.rides || 0,
      icon: TruckIcon,
      color: "bg-green-500",
      link: "/user/rides",
    },
    {
      title: "Messages",
      value: stats?.data?.messages || 0,
      icon: ChatBubbleLeftRightIcon,
      color: "bg-purple-500",
      link: "/user/messages",
    },
  ];

  return (
    <Layout title="User Dashboard - Car Marketplace">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user?.firstName}!
            </p>
          </div>
          <Link
            href="/user/profile"
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors mt-4 md:mt-0"
          >
            <UserCircleIcon className="h-5 w-5 mr-2" />
            Edit Profile
          </Link>
        </div>

        {/* Stats Grid */}
        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <Link key={index} href={stat.link} className="block">
                <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}
                    >
                      <stat.icon
                        className={`h-6 w-6 ${stat.color.replace(
                          "bg-",
                          "text-"
                        )}`}
                      />
                    </div>
                  </div>
                  <p className="mt-4 text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Recent Activity */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Bookings
              </h3>
              <Link
                href="/user/bookings"
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                View All →
              </Link>
            </div>
            {bookings?.data?.length > 0 ? (
              <div className="space-y-4">
                {bookings.data.map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {booking.type === "test_drive"
                          ? "Test Drive"
                          : "Inspection"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.car?.make} {booking.car?.model}
                      </p>
                      <div className="flex items-center mt-1">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">
                          {new Date(booking.scheduledDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No bookings yet</p>
            )}
          </div>

          {/* Recent Rides */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Rides
              </h3>
              <Link
                href="/user/rides"
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                View All →
              </Link>
            </div>
            {rides?.data?.length > 0 ? (
              <div className="space-y-4">
                {rides.data.map((ride) => (
                  <div
                    key={ride._id}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <TruckIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {ride.type.toUpperCase()} Ride
                      </p>
                      <p className="text-sm text-gray-600">
                        {ride.pickup.address} → {ride.dropoff.address}
                      </p>
                      <div className="flex items-center mt-1">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            ride.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : ride.status === "accepted"
                              ? "bg-blue-100 text-blue-800"
                              : ride.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {ride.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">
                          ₦{ride.fare?.total?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No rides yet</p>
            )}
          </div>
        </div>

        {/* Favorites Preview */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Favorite Cars
            </h2>
            <Link
              href="/user/favorites"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          {favorites?.data?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {favorites.data.slice(0, 3).map((car) => (
                <Link key={car._id} href={`/cars/${car._id}`} className="block">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-40">
                      <img
                        src={car.images?.[0]?.url || "/placeholder-car.jpg"}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">
                        {car.make} {car.model}
                      </h3>
                      <p className="text-lg font-bold text-primary-600">
                        ₦{car.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {car.year} • {car.mileage.toLocaleString()} km
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <HeartIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No favorites yet</p>
              <Link
                href="/cars"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block"
              >
                Browse Cars →
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
