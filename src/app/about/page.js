"use client";

import React from "react";
import Link from "next/link";
import SimpleLayout from "@/components/SimpleLayout";
import {
  ShieldCheckIcon,
  UsersIcon,
  GlobeAltIcon,
  SparklesIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

export default function AboutPage() {
  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "5K+", label: "Cars Listed" },
    { number: "2K+", label: "Rides Completed" },
    { number: "98%", label: "Satisfaction Rate" },
  ];

  const features = [
    {
      icon: ShieldCheckIcon,
      title: "Secure & Trusted",
      description:
        "All transactions are secure with industry-standard encryption.",
    },
    {
      icon: UsersIcon,
      title: "Community Driven",
      description: "Join a growing community of buyers, sellers, and drivers.",
    },
    {
      icon: GlobeAltIcon,
      title: "Nationwide Reach",
      description: "Connect with users across Nigeria for car sales and rides.",
    },
    {
      icon: SparklesIcon,
      title: "Innovative Platform",
      description:
        "Modern features and intuitive design for the best experience.",
    },
  ];

  const values = [
    {
      title: "Trust",
      description: "We build trust through transparency and reliability.",
    },
    {
      title: "Innovation",
      description: "We continuously improve with cutting-edge technology.",
    },
    {
      title: "Customer First",
      description: "Our users are at the heart of everything we do.",
    },
    {
      title: "Excellence",
      description: "We strive for excellence in every aspect of our service.",
    },
  ];

  return (
    <SimpleLayout title="About Us - CapDrive">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Revolutionizing the Way People
            <br />
            <span className="text-primary-600">Buy, Sell & Ride</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            CapDrive is a comprehensive platform that connects car buyers with
            sellers, and riders with drivers. We're making transportation more
            accessible.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 text-lg">
                To create a seamless and trusted platform that connects people
                with reliable transportation solutions, whether they're buying a
                car, selling a vehicle, or booking a ride.
              </p>
            </div>
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-8 text-center">
              <div className="text-primary-600 text-6xl font-bold mb-2">🚗</div>
              <h3 className="text-xl font-semibold text-gray-900">
                Driving Change
              </h3>
              <p className="text-gray-600">
                One ride, one car, one transaction at a time.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 text-center"
            >
              <div className="text-3xl font-bold text-primary-600 mb-1">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose CapDrive?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <StarIcon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-primary-100 text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of users who trust CapDrive for their car needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              Create Account
            </Link>
            <Link
              href="/cars"
              className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-400 transition-colors"
            >
              Browse Cars
            </Link>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}
