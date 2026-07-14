"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

const SearchBar = ({ initialQuery = "", onSearch }) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        router.push(`/cars?search=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleClear = () => {
    setQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for cars by make, model, or keywords..."
          className="w-full px-4 py-3 pl-12 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-14 flex items-center pr-2"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
          </button>
        )}
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center px-4 md:px-6 bg-primary-600 text-white rounded-r-xl hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// const SearchBar = ({ initialQuery = "", onSearch }) => {
//   const router = useRouter();
//   const [query, setQuery] = useState(initialQuery);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (query.trim()) {
//       if (onSearch) {
//         onSearch(query);
//       } else {
//         router.push(`/cars?search=${encodeURIComponent(query)}`);
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="w-full">
//       <div className="relative">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search for cars by make, model, or keywords..."
//           className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//         />
//         <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//         <button
//           type="submit"
//           className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
//         >
//           Search
//         </button>
//       </div>
//     </form>
//   );
// };

// export default SearchBar;
