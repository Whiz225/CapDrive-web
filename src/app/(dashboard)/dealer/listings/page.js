"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Layout from "../../../../components/Layout";
import { useAuthStore } from "../../../../store";
import { dealerAPI } from "../../../../services/api";
import {
  PlusCircleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import SimpleLayout from "@/components/SimpleLayout";

export default function DealerListings() {
  const { user, isAuthenticated } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("-createdAt");
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    data: listings,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["dealer-listings", searchTerm, statusFilter, sortBy],
    queryFn: () =>
      dealerAPI.getListings({
        search: searchTerm,
        status: statusFilter === "all" ? undefined : statusFilter,
        sort: sortBy,
      }),
    enabled:
      isAuthenticated &&
      (user?.role === "dealer" || user?.role === "admin") &&
      isMounted,
  });

  const handleDelete = async (id) => {
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

  if (
    !isMounted ||
    !isAuthenticated ||
    (user?.role !== "dealer" && user?.role !== "admin")
  ) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <SimpleLayout title="Manage Listings - Dealer Dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Listings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your car listings
            </p>
          </div>
          <Link
            href="/dealer/listings/new"
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors mt-4 md:mt-0"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Add New Listing
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="reserved">Reserved</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="-price">Price: High to Low</option>
                <option value="price">Price: Low to High</option>
                <option value="-views">Most Viewed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
            </div>
          ) : listings?.data?.length === 0 ? (
            <div className="text-center py-12">
              <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No listings found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start selling by adding your first car listing
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Car Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {listings.data.map((listing) => (
                    <tr
                      key={listing._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-16 w-24 flex-shrink-0">
                            <img
                              src={
                                listing.images?.[0]?.url ||
                                "/placeholder-car.jpg"
                              }
                              alt={`${listing.make} ${listing.model}`}
                              className="h-16 w-24 object-cover rounded-xl"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {listing.make} {listing.model}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {listing.year} •{" "}
                              {listing.mileage?.toLocaleString() || 0} km
                            </div>
                            {listing.isFeatured && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          ₦{listing.price.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            listing.status === "available"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                              : listing.status === "pending"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                              : listing.status === "sold"
                              ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {listing.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {listing.views || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(listing.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/cars/${listing._id}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            title="View"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Link>
                          <Link
                            href={`/dealer/listings/${listing._id}/edit`}
                            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(listing._id)}
                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SimpleLayout>
  );
}

// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { useQuery } from "@tanstack/react-query";
// import Layout from "@/components/Layout";
// import { useAuthStore } from "@/store";
// import { dealerAPI } from "@/services/api";
// import {
//   PlusCircleIcon,
//   PencilIcon,
//   TrashIcon,
//   EyeIcon,
//   SearchIcon,
//   FilterIcon,
// } from "@heroicons/react/24/outline";
// import toast from "react-hot-toast";

// export default function DealerListings() {
//   const { user, isAuthenticated } = useAuthStore();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [sortBy, setSortBy] = useState("-createdAt");

//   const {
//     data: listings,
//     isLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ["dealer-listings", searchTerm, statusFilter, sortBy],
//     queryFn: () =>
//       dealerAPI.getListings({
//         search: searchTerm,
//         status: statusFilter === "all" ? undefined : statusFilter,
//         sort: sortBy,
//       }),
//     enabled:
//       isAuthenticated && (user?.role === "dealer" || user?.role === "admin"),
//   });

//   const handleDelete = async (id) => {
//     if (confirm("Are you sure you want to delete this listing?")) {
//       try {
//         await dealerAPI.deleteListing(id);
//         toast.success("Listing deleted successfully");
//         refetch();
//       } catch (error) {
//         toast.error("Failed to delete listing");
//       }
//     }
//   };

//   return (
//     <Layout title="Manage Listings - Dealer Dashboard">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
//             <p className="text-gray-600 mt-1">Manage your car listings</p>
//           </div>
//           <Link
//             href="/dealer/listings/new"
//             className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors mt-4 md:mt-0"
//           >
//             <PlusCircleIcon className="h-5 w-5 mr-2" />
//             Add New Listing
//           </Link>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//               <input
//                 type="text"
//                 placeholder="Search listings..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//               />
//             </div>
//             <div className="flex gap-4">
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//               >
//                 <option value="all">All Status</option>
//                 <option value="available">Available</option>
//                 <option value="pending">Pending</option>
//                 <option value="sold">Sold</option>
//                 <option value="reserved">Reserved</option>
//               </select>
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//               >
//                 <option value="-createdAt">Newest First</option>
//                 <option value="createdAt">Oldest First</option>
//                 <option value="-price">Price: High to Low</option>
//                 <option value="price">Price: Low to High</option>
//                 <option value="-views">Most Viewed</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Listings Table */}
//         <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//           {isLoading ? (
//             <div className="p-8 text-center">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
//             </div>
//           ) : listings?.data?.length === 0 ? (
//             <div className="text-center py-12">
//               <CarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 No listings found
//               </h3>
//               <p className="text-gray-600">
//                 Start selling by adding your first car listing
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Car Details
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Price
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Views
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {listings.data.map((listing) => (
//                     <tr
//                       key={listing._id}
//                       className="hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-6 py-4">
//                         <div className="flex items-center">
//                           <div className="h-16 w-24 flex-shrink-0">
//                             <img
//                               src={
//                                 listing.images?.[0]?.url ||
//                                 "/placeholder-car.jpg"
//                               }
//                               alt={`${listing.make} ${listing.model}`}
//                               className="h-16 w-24 object-cover rounded"
//                             />
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">
//                               {listing.make} {listing.model}
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               {listing.year} •{" "}
//                               {listing.mileage.toLocaleString()} km
//                             </div>
//                             {listing.isFeatured && (
//                               <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
//                                 Featured
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           ₦{listing.price.toLocaleString()}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={`px-2 py-1 text-xs font-medium rounded-full ${
//                             listing.status === "available"
//                               ? "bg-green-100 text-green-800"
//                               : listing.status === "pending"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : listing.status === "sold"
//                               ? "bg-red-100 text-red-800"
//                               : "bg-gray-100 text-gray-800"
//                           }`}
//                         >
//                           {listing.status.toUpperCase()}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900">
//                           {listing.views || 0}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-500">
//                           {new Date(listing.createdAt).toLocaleDateString()}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-right">
//                         <div className="flex justify-end space-x-2">
//                           <Link
//                             href={`/cars/${listing._id}`}
//                             target="_blank"
//                             className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
//                             title="View"
//                           >
//                             <EyeIcon className="h-5 w-5" />
//                           </Link>
//                           <Link
//                             href={`/dealer/listings/${listing._id}/edit`}
//                             className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
//                             title="Edit"
//                           >
//                             <PencilIcon className="h-5 w-5" />
//                           </Link>
//                           <button
//                             onClick={() => handleDelete(listing._id)}
//                             className="p-2 text-gray-400 hover:text-red-600 transition-colors"
//                             title="Delete"
//                           >
//                             <TrashIcon className="h-5 w-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// }
