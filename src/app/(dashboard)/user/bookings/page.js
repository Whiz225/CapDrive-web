"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { useAuthStore } from "@/store";
import { userAPI } from "@/services/api";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function UserBookings() {
  const { isAuthenticated } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["user-bookings", statusFilter],
    queryFn: () =>
      userAPI.getBookings({
        status: statusFilter === "all" ? undefined : statusFilter,
      }),
    enabled: isAuthenticated,
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
      rejected: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (!isAuthenticated) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Layout title="My Bookings - CapDrive">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">
            Manage your test drives and inspections
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                statusFilter === "all"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                statusFilter === "pending"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("confirmed")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                statusFilter === "confirmed"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                statusFilter === "completed"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setStatusFilter("cancelled")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                statusFilter === "cancelled"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : bookings?.data?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600 mb-4">
              You haven't made any bookings yet
            </p>
            <Link
              href="/cars"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Browse Cars
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.data.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="h-20 w-20 flex-shrink-0">
                        <img
                          src={
                            booking.car?.images?.[0]?.url ||
                            "/placeholder-car.jpg"
                          }
                          alt={`${booking.car?.make} ${booking.car?.model}`}
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/cars/${booking.car?._id}`}
                          className="font-semibold text-gray-900 hover:text-primary-600"
                        >
                          {booking.car?.make} {booking.car?.model} (
                          {booking.car?.year})
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          {booking.type === "test_drive"
                            ? "Test Drive"
                            : "Inspection"}
                        </p>
                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {new Date(
                              booking.scheduledDate
                            ).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {new Date(
                              booking.scheduledDate
                            ).toLocaleTimeString()}
                          </span>
                          {booking.car?.location && (
                            <span className="flex items-center">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              {booking.car.location.city},{" "}
                              {booking.car.location.state}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col items-end">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                    {booking.notes && (
                      <p className="text-sm text-gray-500 mt-2 max-w-xs">
                        {booking.notes}
                      </p>
                    )}
                  </div>
                </div>
                {booking.message && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Message:</span>{" "}
                      {booking.message}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
