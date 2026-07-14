import React from "react";
import Link from "next/link";
import SimpleLayout from "@/components/SimpleLayout";

export const metadata = {
  title: "Privacy Policy - CapDrive",
  description: "Privacy Policy for CapDrive platform",
};

export default function PrivacyPage() {
  return (
    <SimpleLayout title="Privacy Policy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-500 mb-8">Last updated: July 14, 2026</p>

          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600">
              At CapDrive, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our platform.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              1. Information We Collect
            </h2>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
              1.1 Personal Information
            </h3>
            <p className="text-gray-600">
              We may collect the following personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                <strong>Account Information:</strong> Name, email address, phone
                number, password
              </li>
              <li>
                <strong>Profile Information:</strong> Profile photo, bio,
                location
              </li>
              <li>
                <strong>Vehicle Information:</strong> Cars you list, purchase,
                or view
              </li>
              <li>
                <strong>Ride Information:</strong> Pickup/dropoff locations,
                ride history
              </li>
              <li>
                <strong>Payment Information:</strong> Payment methods,
                transaction history
              </li>
              <li>
                <strong>Communication:</strong> Messages, inquiries, support
                tickets
              </li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
              1.2 Automatically Collected Information
            </h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                <strong>Device Information:</strong> IP address, browser type,
                device type
              </li>
              <li>
                <strong>Usage Data:</strong> Pages visited, time spent, features
                used
              </li>
              <li>
                <strong>Location Data:</strong> Approximate location from IP
                address or GPS
              </li>
              <li>
                <strong>Cookies:</strong> Session data, preferences, analytics
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-600">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Create and manage your account</li>
              <li>Facilitate car listings and ride bookings</li>
              <li>Process payments and transactions</li>
              <li>
                Communicate with you about your listings, bookings, and
                inquiries
              </li>
              <li>Provide customer support</li>
              <li>Improve our platform and services</li>
              <li>
                Send you relevant updates and promotional offers (with your
                consent)
              </li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              3. Information Sharing
            </h2>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
              3.1 With Other Users
            </h3>
            <p className="text-gray-600">
              We share certain information with other users to facilitate
              transactions:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                <strong>Car Listings:</strong> Your profile information and
                contact details are visible to potential buyers
              </li>
              <li>
                <strong>Ride Bookings:</strong> Your location and contact
                information are shared with your driver
              </li>
              <li>
                <strong>Reviews:</strong> Your reviews and ratings are visible
                to the community
              </li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
              3.2 With Service Providers
            </h3>
            <p className="text-gray-600">
              We may share your information with third-party service providers
              who help us operate our platform:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Payment processors (Paystack, Flutterwave)</li>
              <li>Cloud hosting providers (MongoDB Atlas, Cloudinary)</li>
              <li>Analytics providers (Google Analytics)</li>
              <li>Email service providers</li>
              <li>Customer support tools</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
              3.3 Legal Requirements
            </h3>
            <p className="text-gray-600">
              We may disclose your information if required by law or if we
              believe that such action is necessary to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Comply with legal obligations</li>
              <li>Protect our rights or property</li>
              <li>Investigate fraud or illegal activities</li>
              <li>Ensure the safety of our users</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-600">
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              5. Your Rights
            </h2>
            <p className="text-gray-600">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                <strong>Access:</strong> Request a copy of your personal
                information
              </li>
              <li>
                <strong>Correction:</strong> Update or correct inaccurate
                information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal
                information
              </li>
              <li>
                <strong>Objection:</strong> Object to processing of your
                information
              </li>
              <li>
                <strong>Data Portability:</strong> Receive your data in a
                portable format
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              6. Contact Us
            </h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@capdrive.com
                <br />
                <strong>Phone:</strong> +234 800 000 0000
                <br />
                <strong>Address:</strong> Lagos, Nigeria
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                By using CapDrive, you consent to the collection and use of your
                personal information as described in this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}
