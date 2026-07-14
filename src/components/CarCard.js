"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { MapPinIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useCarStore, useAuthStore } from "../store";

const CarCard = ({ car, onToggleFavorite }) => {
  const { isAuthenticated } = useAuthStore();
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if the current user has favorited this car
  useEffect(() => {
    if (car?.favorites && isAuthenticated) {
      const userId = useAuthStore.getState().user?.id;
      setIsFavorite(car.favorites.includes(userId));
    }
  }, [car, isAuthenticated]);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(car._id);
      // Optimistically update the UI
      setIsFavorite(!isFavorite);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/cars/${car._id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
          {car.images && car.images.length > 0 ? (
            <img
              src={car.images[0].url}
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform duration-200"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {isFavorite ? (
              <HeartSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartOutline className="h-5 w-5 text-gray-600" />
            )}
          </button>

          {/* Status Badge */}
          {car.status !== "available" && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded-md">
              {car.status.toUpperCase()}
            </div>
          )}

          {/* Featured Badge */}
          {car.isFeatured && (
            <div className="absolute bottom-3 left-3 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-md">
              FEATURED
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
              {car.make} {car.model}
            </h3>
            <span className="text-xl font-bold text-primary-600 whitespace-nowrap ml-2">
              {formatPrice(car.price)}
            </span>
          </div>

          <div className="flex flex-wrap items-center text-sm text-gray-600 mb-2 gap-1">
            <CalendarIcon className="h-4 w-4 flex-shrink-0" />
            <span>{car.year}</span>
            <span className="mx-1">•</span>
            <span>{car.mileage?.toLocaleString() || 0} km</span>
            <span className="mx-1">•</span>
            <span className="capitalize">{car.transmission || "N/A"}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-3">
            <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">
              {car.location?.city || "N/A"}, {car.location?.state || "N/A"}
            </span>
          </div>

          <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-500 gap-2">
              <span className="capitalize">{car.bodyType || "N/A"}</span>
              <span>•</span>
              <span className="capitalize">{car.fuelType || "N/A"}</span>
            </div>
            <div className="text-xs text-gray-400">
              {car.createdAt
                ? new Date(car.createdAt).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;

// "use client";

// import React from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
// import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
// import { MapPinIcon, CalendarIcon } from "@heroicons/react/24/outline";
// import { useCarStore, useAuthStore } from "../store";

// const CarCard = ({ car, onToggleFavorite }) => {
//   const { favorites } = useCarStore();
//   const { isAuthenticated } = useAuthStore();

//   const isFavorite = favorites?.includes(car._id) || false;

//   const handleFavorite = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (onToggleFavorite) {
//       onToggleFavorite(car._id);
//     }
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("en-NG", {
//       style: "currency",
//       currency: "NGN",
//       minimumFractionDigits: 0,
//     }).format(price);
//   };

//   return (
//     <Link href={`/cars/${car._id}`} className="block group">
//       <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
//         {/* Image */}
//         <div className="relative h-48 overflow-hidden bg-gray-100">
//           {car.images && car.images.length > 0 ? (
//             <img
//               src={car.images[0].url}
//               alt={`${car.make} ${car.model}`}
//               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//             />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center text-gray-400">
//               No Image
//             </div>
//           )}

//           {/* Favorite Button */}
//           {isAuthenticated && (
//             <button
//               onClick={handleFavorite}
//               className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
//             >
//               {isFavorite ? (
//                 <HeartSolid className="h-5 w-5 text-red-500" />
//               ) : (
//                 <HeartOutline className="h-5 w-5 text-gray-600" />
//               )}
//             </button>
//           )}

//           {/* Status Badge */}
//           {car.status !== "available" && (
//             <div className="absolute top-3 left-3 px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded-md">
//               {car.status.toUpperCase()}
//             </div>
//           )}

//           {/* Featured Badge */}
//           {car.isFeatured && (
//             <div className="absolute bottom-3 left-3 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-md">
//               FEATURED
//             </div>
//           )}
//         </div>

//         {/* Content */}
//         <div className="p-4">
//           <div className="flex justify-between items-start mb-2">
//             <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
//               {car.make} {car.model}
//             </h3>
//             <span className="text-xl font-bold text-primary-600">
//               {formatPrice(car.price)}
//             </span>
//           </div>

//           <div className="flex items-center text-sm text-gray-600 mb-2">
//             <CalendarIcon className="h-4 w-4 mr-1" />
//             <span>{car.year}</span>
//             <span className="mx-2">•</span>
//             <span>{car.mileage?.toLocaleString() || 0} km</span>
//             <span className="mx-2">•</span>
//             <span className="capitalize">{car.transmission || "N/A"}</span>
//           </div>

//           <div className="flex items-center text-sm text-gray-600">
//             <MapPinIcon className="h-4 w-4 mr-1" />
//             <span>
//               {car.location?.city || "N/A"}, {car.location?.state || "N/A"}
//             </span>
//           </div>

//           <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
//             <div className="flex items-center text-sm text-gray-500">
//               <span className="capitalize">{car.bodyType || "N/A"}</span>
//               <span className="mx-2">•</span>
//               <span className="capitalize">{car.fuelType || "N/A"}</span>
//             </div>
//             <div className="text-xs text-gray-400">
//               {car.createdAt
//                 ? new Date(car.createdAt).toLocaleDateString()
//                 : "N/A"}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default CarCard;
