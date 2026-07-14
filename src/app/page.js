"use client";

import React from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
  TruckIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

export default function HomePage() {
  const features = [
    {
      icon: MagnifyingGlassIcon,
      title: "Browse Cars",
      description:
        "Search through thousands of cars from dealers and private sellers",
      link: "/cars",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: PlusCircleIcon,
      title: "Sell Your Car",
      description:
        "List your car for sale and reach thousands of potential buyers",
      link: "/sell",
      color: "from-green-500 to-green-600",
    },
    {
      icon: TruckIcon,
      title: "Book a Ride",
      description:
        "Get a ride anywhere, anytime with our reliable ride booking service",
      link: "/ride",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: ShieldCheckIcon,
      title: "Safe & Secure",
      description:
        "All transactions are secure and protected with industry-standard encryption",
      link: "/about",
      color: "from-teal-500 to-teal-600",
    },
    {
      icon: CurrencyDollarIcon,
      title: "Best Prices",
      description:
        "Get the best deals on cars and rides with transparent pricing",
      link: "/cars",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Real-time Chat",
      description:
        "Communicate directly with sellers and drivers through our chat system",
      link: "/chat",
      color: "from-pink-500 to-pink-600",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "5K+", label: "Cars Listed" },
    { value: "2K+", label: "Rides Completed" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <Layout title="Home - Car Marketplace">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium mb-6">
              <StarIcon className="h-4 w-4 mr-2 text-yellow-400" />
              Trusted by 10,000+ users
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Your One-Stop <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-100">
                Car Marketplace
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Buy, sell, and ride with confidence. Join thousands of happy users
              today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/cars"
                className="group inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-xl font-medium hover:bg-primary-50 transition-all hover:scale-105 shadow-lg"
              >
                Browse Cars
                <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/sell"
                className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-400 transition-all hover:scale-105 shadow-lg"
              >
                Sell Your Car
              </Link>
              <Link
                href="/ride"
                className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/30 transition-all hover:scale-105 border border-white/30"
              >
                Book a Ride
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-600">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Car Marketplace provides all the tools you need to buy, sell, and
            ride with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.link}
              className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              <div className="p-6">
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center text-primary-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more
                  <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have found their dream car or made
              extra income.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-xl font-medium hover:bg-primary-50 transition-all hover:scale-105 shadow-lg"
              >
                Create Account
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
              <Link
                href="/cars"
                className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-400 transition-all hover:scale-105"
              >
                Explore Cars
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
