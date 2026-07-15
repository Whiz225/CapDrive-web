"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import SimpleLayout from "@/components/SimpleLayout";
import { useAuthStore } from "@/store";
import { bookingAPI } from "@/services/api";
import {
  CheckCircleIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const bookingId = params?.id;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: bookingData, isLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => bookingAPI.getBooking(bookingId),
    enabled: !!bookingId && isAuthenticated && isMounted,
  });

  const booking = bookingData?.data;

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

  if (!booking) {
    return (
      <SimpleLayout title="Booking Not Found - CapDrive">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <TruckIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Booking not found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The booking you're looking for doesn't exist.
            </p>
            <button
              onClick={() => router.push("/bookings")}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              My Bookings
            </button>
          </div>
        </div>
      </SimpleLayout>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      pending:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
      confirmed:
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
      completed:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
      cancelled: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
      rejected: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400",
    };
    return colors[status] || colors.pending;
  };

  const typeLabel = booking.type === "test_drive" ? "Test Drive" : "Inspection";

  return (
    <SimpleLayout title="Booking Details - CapDrive">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Booking Details
                </h1>
                <p className="text-primary-100 mt-1">
                  {typeLabel} for {booking.car?.make} {booking.car?.model}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                  booking.status
                )}`}
              >
                {booking.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Booking Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <CalendarIcon className="h-5 w-5 text-primary-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Date
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(booking.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <ClockIcon className="h-5 w-5 text-primary-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Time
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(booking.scheduledDate).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <MapPinIcon className="h-5 w-5 text-primary-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Location
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {booking.car?.location?.city},{" "}
                      {booking.car?.location?.state}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <TruckIcon className="h-5 w-5 text-primary-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Car
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {booking.car?.make} {booking.car?.model} (
                      {booking.car?.year})
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            {booking.message && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {booking.message}
                </p>
              </div>
            )}

            {/* Seller Contact */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Seller Contact Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <UserIcon className="h-4 w-4" />
                  <span>
                    {booking.car?.owner?.firstName}{" "}
                    {booking.car?.owner?.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <EnvelopeIcon className="h-4 w-4" />
                  <span>{booking.car?.owner?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <PhoneIcon className="h-4 w-4" />
                  <span>{booking.car?.owner?.phone}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {booking.status === "pending" && (
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    // Cancel booking logic
                  }}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                >
                  Cancel Booking
                </button>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => router.push("/bookings")}
                className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
              >
                ← Back to My Bookings
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Requested on {new Date(booking.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}
