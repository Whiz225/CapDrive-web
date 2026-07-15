"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store";
import { carAPI, bookingAPI } from "@/services/api";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  XMarkIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import SimpleLayout from "@/components/SimpleLayout";

export default function NewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  const carId = searchParams?.get("carId");
  const bookingType = searchParams?.get("type") || "test_drive";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      scheduledDate: "",
      scheduledTime: "",
      message: "",
    },
  });

  const selectedDate = watch("scheduledDate");
  const selectedTime = watch("scheduledTime");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch car details
  const { data: carData, isLoading: carLoading } = useQuery({
    queryKey: ["car", carId],
    queryFn: () => carAPI.getCar(carId),
    enabled: !!carId && isMounted,
  });

  const car = carData?.data?.data || carData?.data;

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: (data) => bookingAPI.createBooking(data),
    onSuccess: (response) => {
      toast.success("Booking request sent successfully!");
      router.push(`/bookings/${response.data.data._id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create booking");
    },
  });

  const onSubmit = (data) => {
    if (!isAuthenticated) {
      toast.error("Please login to book");
      router.push("/login");
      return;
    }

    if (!carId) {
      toast.error("No car selected");
      return;
    }

    const scheduledDateTime = new Date(
      `${data.scheduledDate}T${data.scheduledTime}`
    );

    if (scheduledDateTime < new Date()) {
      toast.error("Please select a future date and time");
      return;
    }

    createBookingMutation.mutate({
      carId,
      type: bookingType,
      scheduledDate: scheduledDateTime.toISOString(),
      message: data.message,
    });
  };

  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  if (carLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!car) {
    return (
      <SimpleLayout title="Booking - CapDrive">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <TruckIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Car not found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The car you're trying to book doesn't exist.
            </p>
            <button
              onClick={() => router.push("/cars")}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse Cars
            </button>
          </div>
        </div>
      </SimpleLayout>
    );
  }

  const minDate = new Date().toISOString().split("T")[0];
  const bookingTypeLabel =
    bookingType === "test_drive" ? "Test Drive" : "Inspection";

  // Safely format price
  const formatPrice = (price) => {
    if (!price && price !== 0) return "N/A";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <SimpleLayout title={`Book ${bookingTypeLabel} - CapDrive`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 px-6 py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Book a {bookingTypeLabel}
            </h1>
            <p className="text-primary-100 mt-1">
              Schedule your {bookingTypeLabel.toLowerCase()} for {car.make}{" "}
              {car.model}
            </p>
          </div>

          <div className="p-6 md:p-8">
            {/* Car Summary */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-6">
              <div className="h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden">
                <img
                  src={car.images?.[0]?.url || "/placeholder-car.jpg"}
                  alt={`${car.make} ${car.model}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {car.make} {car.model} ({car.year})
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {car.location?.city}, {car.location?.state}
                </p>
                <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  {formatPrice(car.price)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    bookingType === "test_drive"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                      : "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400"
                  }`}
                >
                  {bookingTypeLabel}
                </span>
                {car.testDriveAvailable && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                    Available
                  </span>
                )}
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    <CalendarIcon className="h-4 w-4 inline mr-1.5" />
                    Date *
                  </label>
                  <input
                    {...register("scheduledDate", {
                      required: "Please select a date",
                    })}
                    type="date"
                    min={minDate}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {errors.scheduledDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.scheduledDate.message}
                    </p>
                  )}
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    <ClockIcon className="h-4 w-4 inline mr-1.5" />
                    Time *
                  </label>
                  <input
                    {...register("scheduledTime", {
                      required: "Please select a time",
                    })}
                    type="time"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {errors.scheduledTime && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.scheduledTime.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 inline mr-1.5" />
                  Message (Optional)
                </label>
                <textarea
                  {...register("message")}
                  rows="4"
                  placeholder="Add any special requests or questions for the seller..."
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
              </div>

              {/* Contact Info Preview */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Your Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <UserIcon className="h-4 w-4" />
                    <span>
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <EnvelopeIcon className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <PhoneIcon className="h-4 w-4" />
                    <span>{user?.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPinIcon className="h-4 w-4" />
                    <span>
                      {user?.city || "N/A"}, {user?.state || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={createBookingMutation.isLoading}
                  className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {createBookingMutation.isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-5 w-5" />
                      Request {bookingTypeLabel}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <XMarkIcon className="h-5 w-5" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}
