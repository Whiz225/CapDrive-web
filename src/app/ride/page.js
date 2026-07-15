"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import { rideAPI } from "@/services/api";
import { toast } from "react-hot-toast";
import {
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserIcon,
  StarIcon,
  TruckIcon,
  XMarkIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import SimpleLayout from "@/components/SimpleLayout";

export default function RidePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRideType, setSelectedRideType] = useState("standard");
  const [showRideDetails, setShowRideDetails] = useState(false);
  const [currentRide, setCurrentRide] = useState(null);
  const [rideHistory, setRideHistory] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // Ride types with pricing
  const rideTypes = [
    {
      id: "standard",
      name: "Standard",
      icon: TruckIcon,
      description: "Affordable rides for everyday travel",
      basePrice: 300,
      perKm: 150,
      perMin: 50,
      capacity: 4,
      color: "bg-blue-500",
    },
    {
      id: "premium",
      name: "Premium",
      icon: TruckIcon,
      description: "Comfortable rides with premium vehicles",
      basePrice: 500,
      perKm: 200,
      perMin: 80,
      capacity: 4,
      color: "bg-purple-500",
    },
    {
      id: "xl",
      name: "XL",
      icon: TruckIcon,
      description: "Spacious rides for groups and luggage",
      basePrice: 700,
      perKm: 250,
      perMin: 100,
      capacity: 6,
      color: "bg-green-500",
    },
    {
      id: "luxury",
      name: "Luxury",
      icon: TruckIcon,
      description: "Premium luxury vehicles for special occasions",
      basePrice: 1000,
      perKm: 350,
      perMin: 150,
      capacity: 4,
      color: "bg-yellow-500",
    },
  ];

  // Request ride mutation
  const requestRideMutation = useMutation({
    mutationFn: (data) => rideAPI.requestRide(data),
    onSuccess: (response) => {
      toast.success("Ride requested successfully!");
      setCurrentRide(response.data.data);
      setShowRideDetails(true);
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to request ride");
    },
  });

  // Get ride history
  useEffect(() => {
    if (isAuthenticated) {
      rideAPI
        .getRideHistory()
        .then((res) => {
          if (res.data.success) {
            setRideHistory(res.data.data);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const onSubmit = (data) => {
    if (!isAuthenticated) {
      toast.error("Please login to book a ride");
      router.push("/login");
      return;
    }

    // Calculate estimated fare
    const rideType = rideTypes.find((rt) => rt.id === selectedRideType);
    const distance = 5; // Mock distance - in production, use maps API
    const duration = 15; // Mock duration - in production, use maps API

    const fare = {
      basePrice: rideType.basePrice,
      distancePrice: distance * rideType.perKm,
      timePrice: duration * rideType.perMin,
      surgeMultiplier: 1,
      total:
        rideType.basePrice +
        distance * rideType.perKm +
        duration * rideType.perMin,
      currency: "NGN",
    };

    const rideData = {
      type: selectedRideType,
      pickup: {
        address: data.pickupAddress,
        city: data.pickupCity,
        state: data.pickupState,
        coordinates: { lat: 6.5244, lng: 3.3792 }, // Mock coordinates
        note: data.pickupNote || "",
      },
      dropoff: {
        address: data.dropoffAddress,
        city: data.dropoffCity,
        state: data.dropoffState,
        coordinates: { lat: 6.5244, lng: 3.3792 }, // Mock coordinates
        note: data.dropoffNote || "",
      },
      distance: { value: distance, unit: "km" },
      duration: { value: duration, unit: "minutes" },
      fare,
      paymentMethod: data.paymentMethod,
      scheduledAt: data.scheduledAt || null,
    };

    requestRideMutation.mutate(rideData);
  };

  const cancelRide = async () => {
    if (currentRide && confirm("Are you sure you want to cancel this ride?")) {
      try {
        await rideAPI.cancelRide(currentRide._id);
        toast.success("Ride cancelled");
        setCurrentRide(null);
        setShowRideDetails(false);
      } catch (error) {
        toast.error("Failed to cancel ride");
      }
    }
  };

  return (
    // <SimpleLayout title="Book a Ride - CapDrive">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Booking Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Book a Ride
            </h1>
            <p className="text-gray-600 mb-6">
              Get a ride anywhere, anytime with our reliable service
            </p>

            {/* Ride Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Ride Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {rideTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedRideType(type.id)}
                    className={`p-3 border-2 rounded-xl text-center transition-all ${
                      selectedRideType === type.id
                        ? "border-primary-600 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 ${type.color} rounded-full flex items-center justify-center mx-auto mb-2`}
                    >
                      <type.icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {type.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      From ₦{type.basePrice}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Pickup Location */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <MapPinIcon className="h-5 w-5 text-green-500 mr-2" />
                  Pickup Location
                </h3>
                <div className="space-y-3">
                  <input
                    {...register("pickupAddress", {
                      required: "Pickup address is required",
                    })}
                    type="text"
                    placeholder="Enter pickup address"
                    className="w-full px-4 py-2.5 border border-gray-200 text-gray-900/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.pickupAddress && (
                    <p className="text-sm text-red-600">
                      {errors.pickupAddress.message}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      {...register("pickupCity")}
                      type="text"
                      placeholder="City"
                      className="w-full px-4 py-2.5 border border-gray-200 text-gray-900/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      {...register("pickupState")}
                      type="text"
                      placeholder="State"
                      className="w-full px-4 py-2.5 border border-gray-200 text-gray-900/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <input
                    {...register("pickupNote")}
                    type="text"
                    placeholder="Additional notes (e.g., gate code, building name)"
                    className="w-full px-4 py-2.5 border border-gray-200 text-gray-900/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Dropoff Location */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <MapPinIcon className="h-5 w-5 text-red-500 mr-2" />
                  Dropoff Location
                </h3>
                <div className="space-y-3">
                  <input
                    {...register("dropoffAddress", {
                      required: "Dropoff address is required",
                    })}
                    type="text"
                    placeholder="Enter dropoff address"
                    className="w-full px-4 py-2.5 border border-gray-200 text-gray-900/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.dropoffAddress && (
                    <p className="text-sm text-red-600">
                      {errors.dropoffAddress.message}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      {...register("dropoffCity")}
                      type="text"
                      placeholder="City"
                      className="w-full px-4 py-2.5 border border-gray-200 text-gray-900/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      {...register("dropoffState")}
                      type="text"
                      placeholder="State"
                      className="w-full px-4 py-2.5 border text-gray-900/80 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <input
                    {...register("dropoffNote")}
                    type="text"
                    placeholder="Additional notes"
                    className="w-full px-4 py-2.5 border text-gray-900/80 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  {...register("paymentMethod", {
                    required: "Payment method is required",
                  })}
                  className="w-full px-4 py-2.5 border text-gray-900/80 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="card">Card (Paystack)</option>
                  <option value="wallet">Wallet</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={requestRideMutation.isLoading}
                className="w-full py-3 bg-primary-600 text-gray-900/80 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {requestRideMutation.isLoading ? (
                  <>
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
                    Requesting...
                  </>
                ) : (
                  "Request Ride"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Current Ride Status */}
          {showRideDetails && currentRide && (
            <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Current Ride</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="text-sm font-medium text-blue-600 capitalize">
                    {currentRide.status}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Type</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {currentRide.type}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Fare</span>
                  <span className="text-sm font-bold text-primary-600">
                    ₦{currentRide.fare?.total?.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={cancelRide}
                  className="w-full py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Cancel Ride
                </button>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Total Rides</span>
                <span className="text-sm font-bold text-gray-900">
                  {rideHistory.length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-sm font-bold text-green-600">
                  {rideHistory.filter((r) => r.status === "completed").length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Cancelled</span>
                <span className="text-sm font-bold text-red-600">
                  {rideHistory.filter((r) => r.status === "cancelled").length}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Rides */}
          {rideHistory.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Rides</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {rideHistory.slice(0, 5).map((ride) => (
                  <div
                    key={ride._id}
                    className="p-3 border border-gray-100 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {ride.type} Ride
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(ride.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          ride.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : ride.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {ride.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      ₦{ride.fare?.total?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    // </SimpleLayout>
  );
}
