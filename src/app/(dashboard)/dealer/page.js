"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Layout from "../../../components/Layout";
import { useAuthStore } from "../../../store";
import { dealerAPI } from "../../../services/api";
import {
  PlusCircleIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../../../components/LoadingSpinner";
import toast from "react-hot-toast";
import SimpleLayout from "@/components/SimpleLayout";

export default function DealerDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [dateRange, setDateRange] = useState("week");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isAuthenticated && user?.role !== "dealer" && user?.role !== "admin") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dealer-stats", dateRange],
    queryFn: () => dealerAPI.getStats({ range: dateRange }),
    enabled:
      isAuthenticated &&
      (user?.role === "dealer" || user?.role === "admin") &&
      isMounted,
  });

  const {
    data: listings,
    isLoading: listingsLoading,
    refetch,
  } = useQuery({
    queryKey: ["dealer-listings"],
    queryFn: () => dealerAPI.getListings(),
    enabled:
      isAuthenticated &&
      (user?.role === "dealer" || user?.role === "admin") &&
      isMounted,
  });

  const { data: inquiries } = useQuery({
    queryKey: ["dealer-inquiries"],
    queryFn: () => dealerAPI.getInquiries(),
    enabled:
      isAuthenticated &&
      (user?.role === "dealer" || user?.role === "admin") &&
      isMounted,
  });

  if (
    !isMounted ||
    !isAuthenticated ||
    (user?.role !== "dealer" && user?.role !== "admin")
  ) {
    return <LoadingSpinner fullScreen />;
  }

  const statCards = [
    {
      title: "Total Listings",
      value: stats?.data?.totalListings || 0,
      icon: TruckIcon,
      color: "bg-blue-500",
      change: stats?.data?.listingsChange || "+0%",
      trend: stats?.data?.listingsChange?.startsWith("+") ? "up" : "down",
    },
    {
      title: "Total Views",
      value: stats?.data?.totalViews || 0,
      icon: EyeIcon,
      color: "bg-green-500",
      change: stats?.data?.viewsChange || "+0%",
      trend: stats?.data?.viewsChange?.startsWith("+") ? "up" : "down",
    },
    {
      title: "Inquiries",
      value: stats?.data?.totalInquiries || 0,
      icon: ChatBubbleLeftRightIcon,
      color: "bg-purple-500",
      change: stats?.data?.inquiriesChange || "+0%",
      trend: stats?.data?.inquiriesChange?.startsWith("+") ? "up" : "down",
    },
    {
      title: "Revenue",
      value: `₦${(stats?.data?.revenue || 0).toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: "bg-yellow-500",
      change: stats?.data?.revenueChange || "+0%",
      trend: stats?.data?.revenueChange?.startsWith("+") ? "up" : "down",
    },
  ];

  const handleDeleteListing = async (id) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      try {
        await dealerAPI.deleteListing(id);
        toast.success("Listing deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete listing");
      }
    }
  };

  return (
    <SimpleLayout title="Dealer Dashboard - CapDrive">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dealer Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back, {user?.firstName}!{" "}
              {stats?.data?.subscription?.plan &&
                `(${stats.data.subscription.plan.toUpperCase()} Plan)`}
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
            <Link
              href="/dealer/listings/new"
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Add Listing
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                    <stat.icon
                      className={`h-6 w-6 ${stat.color.replace(
                        "bg-",
                        "text-"
                      )}`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium flex items-center ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </span>
                </div>
                <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Subscription Status */}
        {stats?.data?.subscription && (
          <div className="mt-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="text-xl font-bold">Subscription Status</h3>
                <p className="text-primary-100 mt-1">
                  Plan:{" "}
                  <span className="font-semibold uppercase">
                    {stats.data.subscription.plan}
                  </span>
                </p>
                {stats.data.subscription.endDate && (
                  <p className="text-primary-100 text-sm">
                    Expires:{" "}
                    {new Date(
                      stats.data.subscription.endDate
                    ).toLocaleDateString()}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  <span className="bg-primary-400 bg-opacity-30 px-3 py-1 rounded-full">
                    {stats.data.subscription.features.maxListings} Listings
                  </span>
                  {stats.data.subscription.features.featuredListings > 0 && (
                    <span className="bg-primary-400 bg-opacity-30 px-3 py-1 rounded-full">
                      {stats.data.subscription.features.featuredListings}{" "}
                      Featured
                    </span>
                  )}
                  {stats.data.subscription.features.analytics && (
                    <span className="bg-primary-400 bg-opacity-30 px-3 py-1 rounded-full">
                      Analytics
                    </span>
                  )}
                </div>
              </div>
              <Link
                href="/dealer/subscription"
                className="mt-4 md:mt-0 px-6 py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
              >
                Manage Subscription
              </Link>
            </div>
          </div>
        )}

        {/* Listings */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Listings
            </h2>
            <Link
              href="/dealer/listings"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>

          {listingsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 animate-pulse"
                >
                  <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : listings?.data?.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No listings yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start selling by adding your first car listing
              </p>
              <Link
                href="/dealer/listings/new"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                Add Listing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.data.slice(0, 6).map((listing) => (
                <div
                  key={listing._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
                >
                  <div className="relative h-48">
                    <img
                      src={listing.images?.[0]?.url || "/placeholder-car.jpg"}
                      alt={`${listing.make} ${listing.model}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <Link
                        href={`/dealer/listings/${listing._id}/edit`}
                        className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </Link>
                      <button
                        onClick={() => handleDeleteListing(listing._id)}
                        className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                    {listing.isFeatured && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-md">
                        FEATURED
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded-md">
                      {listing.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {listing.make} {listing.model} ({listing.year})
                    </h3>
                    <p className="text-lg font-bold text-primary-600 mt-1">
                      ₦{listing.price.toLocaleString()}
                    </p>
                    <div className="flex justify-between items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
                      <span>{listing.mileage?.toLocaleString() || 0} km</span>
                      <span>{listing.views || 0} views</span>
                      <span>{listing.inquiries || 0} inquiries</span>
                    </div>
                    <Link
                      href={`/cars/${listing._id}`}
                      target="_blank"
                      className="mt-3 block text-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      View Listing
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Inquiries
            </h2>
            <Link
              href="/dealer/inquiries"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {inquiries?.data?.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {inquiries.data.slice(0, 5).map((inquiry) => (
                  <div
                    key={inquiry._id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <span className="text-primary-600 dark:text-primary-400 font-semibold">
                              {inquiry.user?.firstName?.[0]}
                              {inquiry.user?.lastName?.[0]}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {inquiry.user?.firstName} {inquiry.user?.lastName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {inquiry.type === "test_drive"
                              ? "Test Drive"
                              : "Inspection"}{" "}
                            for {inquiry.car?.make} {inquiry.car?.model}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {inquiry.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            inquiry.status === "pending"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                              : inquiry.status === "confirmed"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                              : inquiry.status === "cancelled"
                              ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {inquiry.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  No inquiries yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}

// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useQuery } from "@tanstack/react-query";
// import Layout from "@/components/Layout";
// import { useAuthStore } from "@/store";
// import {
//   PlusCircleIcon,
//   CarIcon,
//   ChartBarIcon,
//   CurrencyDollarIcon,
//   UserGroupIcon,
//   CalendarIcon,
//   ChatBubbleLeftRightIcon,
//   EyeIcon,
//   PencilIcon,
//   TrashIcon,
//   ArrowUpIcon,
//   ArrowDownIcon,
// } from "@heroicons/react/24/outline";
// import { dealerAPI } from "@/services/api";
// import LoadingSpinner from "@/components/LoadingSpinner";
// import toast from "react-hot-toast";

// export default function DealerDashboard() {
//   const router = useRouter();
//   const { user, isAuthenticated } = useAuthStore();
//   const [dateRange, setDateRange] = useState("week");

//   // Check dealer access
//   useEffect(() => {
//     if (isAuthenticated && user?.role !== "dealer" && user?.role !== "admin") {
//       router.push("/");
//     }
//   }, [isAuthenticated, user, router]);

//   // Fetch dealer stats
//   const { data: stats, isLoading: statsLoading } = useQuery({
//     queryKey: ["dealer-stats", dateRange],
//     queryFn: () => dealerAPI.getStats({ range: dateRange }),
//     enabled:
//       isAuthenticated && (user?.role === "dealer" || user?.role === "admin"),
//   });

//   // Fetch dealer listings
//   const { data: listings, isLoading: listingsLoading } = useQuery({
//     queryKey: ["dealer-listings"],
//     queryFn: () => dealerAPI.getListings(),
//     enabled:
//       isAuthenticated && (user?.role === "dealer" || user?.role === "admin"),
//   });

//   // Fetch recent inquiries
//   const { data: inquiries } = useQuery({
//     queryKey: ["dealer-inquiries"],
//     queryFn: () => dealerAPI.getInquiries(),
//     enabled:
//       isAuthenticated && (user?.role === "dealer" || user?.role === "admin"),
//   });

//   if (!isAuthenticated || (user?.role !== "dealer" && user?.role !== "admin")) {
//     return <LoadingSpinner />;
//   }

//   const statCards = [
//     {
//       title: "Total Listings",
//       value: stats?.data?.totalListings || 0,
//       icon: CarIcon,
//       color: "bg-blue-500",
//       change: stats?.data?.listingsChange || "+0%",
//     },
//     {
//       title: "Total Views",
//       value: stats?.data?.totalViews || 0,
//       icon: EyeIcon,
//       color: "bg-green-500",
//       change: stats?.data?.viewsChange || "+0%",
//     },
//     {
//       title: "Inquiries",
//       value: stats?.data?.totalInquiries || 0,
//       icon: ChatBubbleLeftRightIcon,
//       color: "bg-purple-500",
//       change: stats?.data?.inquiriesChange || "+0%",
//     },
//     {
//       title: "Revenue",
//       value: `₦${(stats?.data?.revenue || 0).toLocaleString()}`,
//       icon: CurrencyDollarIcon,
//       color: "bg-yellow-500",
//       change: stats?.data?.revenueChange || "+0%",
//     },
//   ];

//   const handleDeleteListing = async (id) => {
//     if (confirm("Are you sure you want to delete this listing?")) {
//       try {
//         await dealerAPI.deleteListing(id);
//         toast.success("Listing deleted successfully");
//         // Refetch listings
//         window.location.reload();
//       } catch (error) {
//         toast.error("Failed to delete listing");
//       }
//     }
//   };

//   return (
//     <Layout title="Dealer Dashboard - Car Marketplace">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">
//               Dealer Dashboard
//             </h1>
//             <p className="text-gray-600 mt-1">
//               Welcome back, {user?.firstName}!{" "}
//               {stats?.data?.subscription?.plan &&
//                 `(${stats.data.subscription.plan.toUpperCase()} Plan)`}
//             </p>
//           </div>
//           <div className="flex items-center space-x-4 mt-4 md:mt-0">
//             <select
//               value={dateRange}
//               onChange={(e) => setDateRange(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
//             >
//               <option value="today">Today</option>
//               <option value="week">This Week</option>
//               <option value="month">This Month</option>
//               <option value="quarter">This Quarter</option>
//             </select>
//             <Link
//               href="/dealer/listings/new"
//               className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
//             >
//               <PlusCircleIcon className="h-5 w-5 mr-2" />
//               Add Listing
//             </Link>
//           </div>
//         </div>

//         {/* Stats Grid */}
//         {statsLoading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[...Array(4)].map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
//               >
//                 <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
//                 <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
//                 <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {statCards.map((stat, index) => (
//               <div
//                 key={index}
//                 className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
//                     <stat.icon
//                       className={`h-6 w-6 ${stat.color.replace(
//                         "bg-",
//                         "text-"
//                       )}`}
//                     />
//                   </div>
//                   <span
//                     className={`text-sm font-medium flex items-center ${
//                       stat.change.startsWith("+")
//                         ? "text-green-600"
//                         : "text-red-600"
//                     }`}
//                   >
//                     {stat.change.startsWith("+") ? (
//                       <ArrowUpIcon className="h-4 w-4 mr-1" />
//                     ) : (
//                       <ArrowDownIcon className="h-4 w-4 mr-1" />
//                     )}
//                     {stat.change}
//                   </span>
//                 </div>
//                 <p className="mt-4 text-2xl font-bold text-gray-900">
//                   {stat.value}
//                 </p>
//                 <p className="text-sm text-gray-600">{stat.title}</p>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Subscription Status */}
//         {stats?.data?.subscription && (
//           <div className="mt-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg p-6 text-white">
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//               <div>
//                 <h3 className="text-xl font-bold">Subscription Status</h3>
//                 <p className="text-primary-100 mt-1">
//                   Plan:{" "}
//                   <span className="font-semibold uppercase">
//                     {stats.data.subscription.plan}
//                   </span>
//                 </p>
//                 {stats.data.subscription.endDate && (
//                   <p className="text-primary-100 text-sm">
//                     Expires:{" "}
//                     {new Date(
//                       stats.data.subscription.endDate
//                     ).toLocaleDateString()}
//                   </p>
//                 )}
//                 <div className="mt-2 flex items-center space-x-4 text-sm">
//                   <span className="bg-primary-400 bg-opacity-30 px-3 py-1 rounded-full">
//                     {stats.data.subscription.features.maxListings} Listings
//                   </span>
//                   {stats.data.subscription.features.featuredListings > 0 && (
//                     <span className="bg-primary-400 bg-opacity-30 px-3 py-1 rounded-full">
//                       {stats.data.subscription.features.featuredListings}{" "}
//                       Featured
//                     </span>
//                   )}
//                   {stats.data.subscription.features.analytics && (
//                     <span className="bg-primary-400 bg-opacity-30 px-3 py-1 rounded-full">
//                       Analytics
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <Link
//                 href="/dealer/subscription"
//                 className="mt-4 md:mt-0 px-6 py-2 bg-white text-primary-600 rounded-md font-medium hover:bg-primary-50 transition-colors"
//               >
//                 Manage Subscription
//               </Link>
//             </div>
//           </div>
//         )}

//         {/* Listings */}
//         <div className="mt-8">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold text-gray-900">
//               Your Listings
//             </h2>
//             <Link
//               href="/dealer/listings"
//               className="text-primary-600 hover:text-primary-700 text-sm font-medium"
//             >
//               View All →
//             </Link>
//           </div>

//           {listingsLoading ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[...Array(3)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="bg-white rounded-xl shadow-sm p-4 animate-pulse"
//                 >
//                   <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
//                   <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {listings?.data?.slice(0, 6).map((listing) => (
//                 <div
//                   key={listing._id}
//                   className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
//                 >
//                   <div className="relative h-48">
//                     <img
//                       src={listing.images?.[0]?.url || "/placeholder-car.jpg"}
//                       alt={`${listing.make} ${listing.model}`}
//                       className="w-full h-full object-cover"
//                     />
//                     <div className="absolute top-2 right-2 flex space-x-2">
//                       <Link
//                         href={`/dealer/listings/${listing._id}/edit`}
//                         className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
//                       >
//                         <PencilIcon className="h-4 w-4 text-gray-600" />
//                       </Link>
//                       <button
//                         onClick={() => handleDeleteListing(listing._id)}
//                         className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
//                       >
//                         <TrashIcon className="h-4 w-4 text-red-600" />
//                       </button>
//                     </div>
//                     {listing.isFeatured && (
//                       <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-md">
//                         FEATURED
//                       </div>
//                     )}
//                     <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded-md">
//                       {listing.status.toUpperCase()}
//                     </div>
//                   </div>
//                   <div className="p-4">
//                     <h3 className="font-semibold text-gray-900">
//                       {listing.make} {listing.model} ({listing.year})
//                     </h3>
//                     <p className="text-lg font-bold text-primary-600 mt-1">
//                       ₦{listing.price.toLocaleString()}
//                     </p>
//                     <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
//                       <span>{listing.mileage.toLocaleString()} km</span>
//                       <span>{listing.views || 0} views</span>
//                       <span>{listing.inquiries || 0} inquiries</span>
//                     </div>
//                     <Link
//                       href={`/cars/${listing._id}`}
//                       target="_blank"
//                       className="mt-3 block text-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//                     >
//                       View Listing
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {listings?.data?.length === 0 && (
//             <div className="text-center py-12 bg-white rounded-xl shadow-sm">
//               <CarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 No listings yet
//               </h3>
//               <p className="text-gray-600 mb-4">
//                 Start selling by adding your first car listing
//               </p>
//               <Link
//                 href="/dealer/listings/new"
//                 className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
//               >
//                 <PlusCircleIcon className="h-5 w-5 mr-2" />
//                 Add Listing
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* Recent Inquiries */}
//         <div className="mt-8">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold text-gray-900">
//               Recent Inquiries
//             </h2>
//             <Link
//               href="/dealer/inquiries"
//               className="text-primary-600 hover:text-primary-700 text-sm font-medium"
//             >
//               View All →
//             </Link>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//             {inquiries?.data?.length > 0 ? (
//               <div className="divide-y divide-gray-200">
//                 {inquiries.data.slice(0, 5).map((inquiry) => (
//                   <div
//                     key={inquiry._id}
//                     className="p-4 hover:bg-gray-50 transition-colors"
//                   >
//                     <div className="flex justify-between items-start">
//                       <div className="flex items-start space-x-3">
//                         <div className="flex-shrink-0">
//                           <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
//                             <span className="text-primary-600 font-semibold">
//                               {inquiry.user?.firstName?.[0]}
//                               {inquiry.user?.lastName?.[0]}
//                             </span>
//                           </div>
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-900">
//                             {inquiry.user?.firstName} {inquiry.user?.lastName}
//                           </p>
//                           <p className="text-sm text-gray-600">
//                             {inquiry.type === "test_drive"
//                               ? "Test Drive"
//                               : "Inspection"}{" "}
//                             for {inquiry.car?.make} {inquiry.car?.model}
//                           </p>
//                           <p className="text-sm text-gray-500 mt-1">
//                             {inquiry.message}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex flex-col items-end">
//                         <span
//                           className={`px-2 py-1 text-xs font-medium rounded-full ${
//                             inquiry.status === "pending"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : inquiry.status === "confirmed"
//                               ? "bg-green-100 text-green-800"
//                               : inquiry.status === "cancelled"
//                               ? "bg-red-100 text-red-800"
//                               : "bg-gray-100 text-gray-800"
//                           }`}
//                         >
//                           {inquiry.status.toUpperCase()}
//                         </span>
//                         <span className="text-xs text-gray-400 mt-1">
//                           {new Date(inquiry.createdAt).toLocaleDateString()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
//                 <p className="text-gray-600">No inquiries yet</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }
