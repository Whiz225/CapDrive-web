"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { carAPI } from "@/services/api";
import { useAuthStore } from "@/store";
import {
  HeartIcon as HeartOutline,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  XMarkIcon,
  TruckIcon,
  BoltIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import SimpleLayout from "@/components/SimpleLayout";

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const carId = params?.id;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["car", carId],
    queryFn: () => carAPI.getCar(carId),
    enabled: !!carId && isMounted,
  });

  const car = data?.data?.data || data?.data;

  // Check if car is in user's favorites
  useEffect(() => {
    if (car?.favorites && user?.id && isMounted) {
      setIsFavorite(car.favorites.includes(user.id));
    }
  }, [car, user, isMounted]);

  // Favorite mutation
  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        await carAPI.removeFromFavorites(carId);
      } else {
        await carAPI.addToFavorites(carId);
      }
    },
    onSuccess: () => {
      setIsFavorite(!isFavorite);
      // toast.success(
      //   isFavorite ? "Removed from favorites" : "Added to favorites"
      // );
      refetch();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update favorites"
      );
    },
  });

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add favorites");
      return;
    }
    favoriteMutation.mutate();
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "N/A";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleContactSeller = () => {
    setShowContact(true);
  };

  if (!isMounted) {
    return null;
  }

  if (isLoading) {
    return (
      <SimpleLayout title="Loading...">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </SimpleLayout>
    );
  }

  if (error || !car) {
    return (
      // <SimpleLayout title="Car Not Found">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Car not found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The car you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/cars"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </Link>
        </div>
      </div>
      // </SimpleLayout>
    );
  }

  const owner = car.owner || {};
  const mainImage = car.images?.find((img) => img.isMain) || car.images?.[0];
  const otherImages = car.images?.filter((img) => img !== mainImage) || [];

  return (
    // <SimpleLayout title={`${car.title} - CapDrive`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Content - Images & Details */}
        <div className="lg:col-span-2">
          {/* Images */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="relative h-80 md:h-96 bg-gray-100 dark:bg-gray-700">
              {mainImage ? (
                <img
                  src={mainImage.url}
                  alt={car.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  No Image Available
                </div>
              )}
              {car.isFeatured && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded-md">
                  FEATURED
                </div>
              )}
              {car.status !== "available" && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-md">
                  {car.status.toUpperCase()}
                </div>
              )}
              {isAuthenticated && (
                <button
                  onClick={handleFavoriteToggle}
                  disabled={favoriteMutation.isLoading}
                  className="absolute bottom-4 right-4 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {isFavorite ? (
                    <HeartSolid className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartOutline className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              )}
            </div>

            {/* Thumbnails */}
            {otherImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2 p-4">
                {otherImages.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className="relative h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                  >
                    <img
                      src={image.url}
                      alt={`${car.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 mt-6 border border-gray-100 dark:border-gray-700">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {car.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4">
              <span className="flex items-center">
                <CalendarIcon className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                {car.year}
              </span>
              <span>•</span>
              <span>{car.mileage?.toLocaleString() || 0} km</span>
              <span>•</span>
              <span className="capitalize">{car.transmission || "N/A"}</span>
              <span>•</span>
              <span className="capitalize">{car.fuelType || "N/A"}</span>
              <span>•</span>
              <span className="capitalize">{car.bodyType || "N/A"}</span>
              {car.location && (
                <>
                  <span>•</span>
                  <span className="flex items-center">
                    <MapPinIcon className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                    {car.location.city}, {car.location.state}
                  </span>
                </>
              )}
            </div>

            <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-6">
              {formatPrice(car.price)}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {car.description}
              </p>
            </div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Features
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {car.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Seller Info & Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 sticky top-20 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Seller Information
            </h3>

            {owner && (
              <div className="flex items-start space-x-3 mb-4">
                <div className="flex-shrink-0">
                  {owner.avatar ? (
                    <img
                      src={owner.avatar}
                      alt={`${owner.firstName} ${owner.lastName}`}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {owner.firstName} {owner.lastName}
                  </p>
                  {owner.dealerProfile?.companyName && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {owner.dealerProfile.companyName}
                    </p>
                  )}
                  {owner.dealerProfile?.isVerified && (
                    <span className="inline-flex items-center text-xs text-green-600 dark:text-green-400">
                      <CheckIcon className="h-3 w-3 mr-1" />
                      Verified Dealer
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {showContact ? (
                <div className="space-y-3">
                  {owner.email && (
                    <a
                      href={`mailto:${owner.email}`}
                      className="flex items-center justify-center w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      <EnvelopeIcon className="h-5 w-5 mr-2" />
                      Email Seller
                    </a>
                  )}
                  {owner.phone && (
                    <a
                      href={`tel:${owner.phone}`}
                      className="flex items-center justify-center w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <PhoneIcon className="h-5 w-5 mr-2" />
                      Call Seller
                    </a>
                  )}
                  <button
                    onClick={() => setShowContact(false)}
                    className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    <XMarkIcon className="h-5 w-5 mr-2" />
                    Hide Contact
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleContactSeller}
                  className="flex items-center justify-center w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                  Contact Seller
                </button>
              )}

              {car.testDriveAvailable && (
                <Link
                  href={`/bookings/new?carId=${car._id}&type=test_drive`}
                  className="flex items-center justify-center w-full px-4 py-2 border border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-sm font-medium"
                >
                  <TruckIcon className="h-5 w-5 mr-2" />
                  Book Test Drive
                </Link>
              )}

              {car.financingAvailable && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  <BoltIcon className="h-4 w-4 inline mr-1" />
                  Financing Available
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600 dark:text-gray-400">
                  Condition
                </div>
                <div className="text-gray-900 dark:text-white capitalize">
                  {car.condition}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Views</div>
                <div className="text-gray-900 dark:text-white">
                  {car.viewCount || 0}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Listed</div>
                <div className="text-gray-900 dark:text-white">
                  {car.createdAt
                    ? new Date(car.createdAt).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>
            </div>

            {/* Report */}
            <div className="mt-4">
              <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                Report Listing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </SimpleLayout>
  );
}
