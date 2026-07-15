"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
// import SimpleLayout from "../../components/SimpleLayout";
import { useAuthStore } from "@/store";
import { userAPI } from "@/services/api";
import { ArrowLeftIcon, HeartIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["user-favorites"],
    queryFn: () => userAPI.getFavorites(),
    enabled: isAuthenticated,
  });

  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated) {
    // return <LoadingSpinner fullScreen />;
    router.push("/login");
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  const favorites = data?.data?.data || [];

  return (
    // <SimpleLayout title="My Favorites - CapDrive">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Cars
      </button>

      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          My Favorites
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          {favorites.length} cars saved for later
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <HeartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No favorites yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start saving cars you're interested in
          </p>
          <Link
            href="/cars"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Browse Cars
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {favorites.map((car) => (
            <Link
              key={car._id}
              href={`/cars/${car._id}`}
              className="block group"
            >
              <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={car.images?.[0]?.url || "/placeholder-car.jpg"}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {car.isFeatured && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-md">
                      FEATURED
                    </div>
                  )}
                  {/* Red heart indicator */}
                  <div className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full">
                    <HeartIcon className="h-4 w-4 text-white fill-white" />
                  </div>
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-lg font-bold text-primary-600 mt-1">
                    ₦{car.price.toLocaleString()}
                  </p>
                  <div className="flex flex-wrap justify-between text-sm text-gray-500 mt-2 gap-1">
                    <span>{car.year}</span>
                    <span>{car.mileage?.toLocaleString() || 0} km</span>
                    <span className="capitalize">
                      {car.transmission || "N/A"}
                    </span>
                  </div>
                  <div className="mt-auto pt-3 border-t border-gray-100 text-sm text-gray-500">
                    {car.location?.city}, {car.location?.state}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
    // </SimpleLayout>
  );
}
