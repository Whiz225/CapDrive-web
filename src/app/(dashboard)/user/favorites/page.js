// frontend/src/app/(dashboard)/user/favorites/page.js
"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { useAuthStore } from "@/store";
import { userAPI } from "@/services/api";
import { HeartIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function UserFavorites() {
  const { isAuthenticated } = useAuthStore();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ["user-favorites"],
    queryFn: () => userAPI.getFavorites(),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <Layout title="My Favorites - Car Marketplace">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          <p className="text-gray-600 mt-1">Cars you've saved for later</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-4 animate-pulse"
              >
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : favorites?.data?.length === 0 ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.data.map((car) => (
              <Link key={car._id} href={`/cars/${car._id}`} className="block">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 relative">
                    <img
                      src={car.images?.[0]?.url || "/placeholder-car.jpg"}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                    {car.isFeatured && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-md">
                        FEATURED
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-lg font-bold text-primary-600 mt-1">
                      ₦{car.price.toLocaleString()}
                    </p>
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>{car.year}</span>
                      <span>{car.mileage.toLocaleString()} km</span>
                      <span className="capitalize">{car.transmission}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
                      {car.location?.city}, {car.location?.state}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
