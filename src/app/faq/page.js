"use client";

import React, { useState } from "react";
import Link from "next/link";
import SimpleLayout from "@/components/SimpleLayout";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "What is CapDrive?",
          a: "CapDrive is a comprehensive platform that connects car buyers with sellers, and riders with drivers. You can buy cars, sell vehicles, and book rides all in one place.",
        },
        {
          q: "Is CapDrive free to use?",
          a: "Creating an account and browsing listings is free. We charge a small fee for premium features like featured listings, dealer subscriptions, and ride booking services.",
        },
        {
          q: "How do I create an account?",
          a: "Click the 'Sign Up' button on the top right corner of the page. Fill in your details, verify your email, and you're ready to start using CapDrive.",
        },
      ],
    },
    {
      category: "Buying a Car",
      questions: [
        {
          q: "How do I search for cars?",
          a: "Use the search bar on the homepage or navigate to the 'Browse Cars' page. You can filter by make, model, price range, year, location, and more.",
        },
        {
          q: "Can I negotiate the price?",
          a: "Yes! You can contact the seller directly through our chat system to negotiate the price. The final price is between you and the seller.",
        },
        {
          q: "How do I book a test drive?",
          a: "On the car detail page, click the 'Book Test Drive' button. Select your preferred date and time, and the seller will confirm your booking.",
        },
      ],
    },
    {
      category: "Selling a Car",
      questions: [
        {
          q: "How do I list my car for sale?",
          a: "Click the 'Sell Your Car' button and fill in the listing form with details about your car, including photos, price, and description.",
        },
        {
          q: "How much does it cost to list a car?",
          a: "We offer free basic listings. For enhanced visibility, you can upgrade to a featured listing or subscribe to a dealer plan.",
        },
      ],
    },
    {
      category: "Ride Booking",
      questions: [
        {
          q: "How do I book a ride?",
          a: "Go to the 'Ride' page, enter your pickup and drop-off locations, select your ride type, and confirm your booking.",
        },
        {
          q: "How is the fare calculated?",
          a: "Fares are calculated based on distance, time, and ride type. The total fare is shown before you confirm your booking.",
        },
      ],
    },
    {
      category: "Account & Security",
      questions: [
        {
          q: "How do I reset my password?",
          a: "Click the 'Forgot Password' link on the login page. Enter your email address, and we'll send you a link to reset your password.",
        },
        {
          q: "Is my personal information secure?",
          a: "Yes! We use industry-standard encryption and security measures to protect your data.",
        },
      ],
    },
  ];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <SimpleLayout title="FAQ - CapDrive">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to the most common questions about CapDrive.
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {category.category}
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {category.questions.map((faq, questionIndex) => {
                  const globalIndex =
                    faqs
                      .slice(0, categoryIndex)
                      .reduce((acc, curr) => acc + curr.questions.length, 0) +
                    questionIndex;

                  return (
                    <div key={questionIndex} className="px-6 py-4">
                      <button
                        onClick={() => toggleQuestion(globalIndex)}
                        className="w-full flex justify-between items-center text-left group"
                      >
                        <span className="text-gray-900 font-medium group-hover:text-primary-600 transition-colors">
                          {faq.q}
                        </span>
                        <span className="ml-4 flex-shrink-0">
                          {openIndex === globalIndex ? (
                            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </span>
                      </button>
                      {openIndex === globalIndex && (
                        <div className="mt-3 text-gray-600 leading-relaxed animate-fade-in">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-primary-50 rounded-2xl text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-4">
            We're here to help. Contact our support team for assistance.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </SimpleLayout>
  );
}
