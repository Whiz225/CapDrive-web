"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import CarCard from "@/components/CarCard";
import FilterSidebar from "@/components/FilterSidebar";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import { carAPI } from "@/services/api";
import { useCarStore, useAuthStore } from "@/store";
import { toast } from "react-hot-toast";
import { FunnelIcon } from "@heroicons/react/24/outline";

export default function CarsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();
  const { filters, setFilters } = useCarStore();

  const [page, setPage] = useState(parseInt(searchParams?.get("page")) || 1);
  const [sort, setSort] = useState(searchParams?.get("sort") || "-createdAt");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    searchParams?.get("search") || ""
  );

  // Fetch cars with query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["cars", page, sort, filters, searchQuery],
    queryFn: () =>
      carAPI.getCars({
        page,
        limit: 12,
        sort,
        ...filters,
        search: searchQuery || undefined,
      }),
    keepPreviousData: true,
  });

  // Safely get cars array
  const cars = data?.data?.data || [];
  const pagination = data?.data?.pagination || { total: 0, page: 1, pages: 0 };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    const params = new URLSearchParams();
    params.set("page", newPage);
    params.set("sort", sort);
    if (searchQuery) params.set("search", searchQuery);
    router.push(`/cars?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
    const params = new URLSearchParams();
    params.set("page", 1);
    params.set("sort", newSort);
    if (searchQuery) params.set("search", searchQuery);
    router.push(`/cars?${params.toString()}`);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    const params = new URLSearchParams();
    params.set("page", 1);
    params.set("sort", sort);
    if (searchQuery) params.set("search", searchQuery);
    router.push(`/cars?${params.toString()}`);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    const params = new URLSearchParams();
    params.set("page", 1);
    params.set("sort", sort);
    if (query) params.set("search", query);
    router.push(`/cars?${params.toString()}`);
  };

  const handleToggleFavorite = useCallback(
    async (carId) => {
      if (!isAuthenticated) {
        toast.error("Please login to add favorites");
        return;
      }

      try {
        const car = cars.find((c) => c._id === carId);
        const isFavorite = car?.favorites?.includes(user?.id) || false;

        if (isFavorite) {
          await carAPI.removeFromFavorites(carId);
          // toast.success("Removed from favorites");
        } else {
          await carAPI.addToFavorites(carId);
          // toast.success("Added to favorites");
        }
        refetch();
      } catch (error) {
        toast.error("Failed to update favorites");
        console.error("Favorite error:", error);
      }
    },
    [isAuthenticated, cars, user, refetch]
  );

  if (isLoading) {
    return (
      <Layout title="Cars - Car Marketplace">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm animate-pulse"
              >
                <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Cars - Car Marketplace">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-600">
              Failed to load cars. Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Cars - Car Marketplace">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Search Bar */}
        <div className="mb-4 md:mb-6">
          <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Browse Cars
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              {pagination.total || 0} cars available
            </p>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="md:hidden flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex-1 sm:flex-none"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="-price">Price: High to Low</option>
              <option value="price">Price: Low to High</option>
              <option value="-year">Year: Newest First</option>
              <option value="year">Year: Oldest First</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Filter Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <FilterSidebar
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
          </div>

          {/* Mobile Filter Modal */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto md:hidden">
              <div className="min-h-screen px-4 text-center">
                <div
                  className="fixed inset-0 bg-black bg-opacity-50"
                  onClick={() => setIsFilterOpen(false)}
                />
                <div className="inline-block w-full max-w-md my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Filters
                      </h3>
                      <button
                        onClick={() => setIsFilterOpen(false)}
                        className="p-2 rounded-full hover:bg-gray-100"
                      >
                        ✕
                      </button>
                    </div>
                    <FilterSidebar
                      onFilterChange={handleFilterChange}
                      initialFilters={filters}
                    />
                    <div className="mt-6">
                      <button
                        onClick={() => setIsFilterOpen(false)}
                        className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cars Grid */}
          <div className="flex-1">
            {cars.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No cars found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {cars.map((car) => (
                    <CarCard
                      key={car._id}
                      car={car}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-6 md:mt-8">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.pages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
