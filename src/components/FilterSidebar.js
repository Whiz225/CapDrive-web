"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const FilterSidebar = ({ onFilterChange, initialFilters = {} }) => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    make: initialFilters.make || "",
    model: initialFilters.model || "",
    minPrice: initialFilters.minPrice || "",
    maxPrice: initialFilters.maxPrice || "",
    year: initialFilters.year || "",
    condition: initialFilters.condition || "",
    transmission: initialFilters.transmission || "",
    fuelType: initialFilters.fuelType || "",
    bodyType: initialFilters.bodyType || "",
    city: initialFilters.city || "",
    state: initialFilters.state || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Remove empty values
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined
      )
    );
    onFilterChange(cleanedFilters);
  };

  const handleReset = () => {
    const emptyFilters = {
      make: "",
      model: "",
      minPrice: "",
      maxPrice: "",
      year: "",
      condition: "",
      transmission: "",
      fuelType: "",
      bodyType: "",
      city: "",
      state: "",
    };
    setFilters(emptyFilters);
    onFilterChange({});
  };

  const conditions = ["new", "used", "certified_pre_owned"];
  const transmissions = ["automatic", "manual", "cvt", "semi_automatic"];
  const fuelTypes = ["petrol", "diesel", "electric", "hybrid", "cng"];
  const bodyTypes = [
    "sedan",
    "suv",
    "truck",
    "coupe",
    "convertible",
    "hatchback",
    "wagon",
    "van",
    "sports",
    "luxury",
  ];
  const years = Array.from(
    { length: 30 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Make */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Make
          </label>
          <input
            type="text"
            name="make"
            value={filters.make}
            onChange={handleChange}
            placeholder="e.g., Toyota"
            className="w-full px-3 py-2 border border-gray-300 text-gray-900/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <input
            type="text"
            name="model"
            value={filters.model}
            onChange={handleChange}
            placeholder="e.g., Camry"
            className="w-full px-3 py-2 border border-gray-300 text-gray-900/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="Min"
              className="w-1/2 px-3 py-2 border border-gray-300 text-gray-900/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="Max"
              className="w-1/2 px-3 py-2 border border-gray-300 text-gray-900/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <select
            name="year"
            value={filters.year}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 text-gray-900/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Any Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condition
          </label>
          <select
            name="condition"
            value={filters.condition}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 text-gray-900/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Any Condition</option>
            {conditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition.replace("_", " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transmission
          </label>
          <select
            name="transmission"
            value={filters.transmission}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 text-gray-900/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Any Transmission</option>
            {transmissions.map((trans) => (
              <option key={trans} value={trans}>
                {trans.replace("_", " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fuel Type
          </label>
          <select
            name="fuelType"
            value={filters.fuelType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 text-gray-900/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Any Fuel</option>
            {fuelTypes.map((fuel) => (
              <option key={fuel} value={fuel}>
                {fuel.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Body Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Body Type
          </label>
          <select
            name="bodyType"
            value={filters.bodyType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 text-gray-900/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Any Body Type</option>
            {bodyTypes.map((type) => (
              <option key={type} value={type}>
                {type.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            name="city"
            value={filters.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900/80 mb-2"
          />
          <input
            type="text"
            name="state"
            value={filters.state}
            onChange={handleChange}
            placeholder="State"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900/80"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterSidebar;
