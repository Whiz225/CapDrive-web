"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store";
import { userAPI, authAPI } from "@/services/api";
import {
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function VerifyPage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [idFile, setIdFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get verification status
  const { data: verificationData, refetch } = useQuery({
    queryKey: ["verification-status"],
    queryFn: () => userAPI.getVerificationStatus(),
    enabled: !!user && isMounted,
  });

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: () => authAPI.verifyEmail(emailCode),
    onSuccess: (response) => {
      toast.success("Email verified successfully!");
      refetch();
      updateUser({ isEmailVerified: true });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to verify email");
    },
  });

  // Verify phone mutation
  const verifyPhoneMutation = useMutation({
    mutationFn: () => authAPI.verifyPhone({ code: phoneCode }),
    onSuccess: (response) => {
      toast.success("Phone verified successfully!");
      refetch();
      updateUser({ isPhoneVerified: true });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to verify phone");
    },
  });

  // Resend verification code
  const resendVerificationMutation = useMutation({
    mutationFn: (type) => authAPI.resendVerification({ type }),
    onSuccess: (response) => {
      toast.success(`Verification code sent to your ${response.data.type}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to resend code");
    },
  });

  const handleEmailVerify = () => {
    if (!emailCode) {
      toast.error("Please enter the verification code");
      return;
    }
    verifyEmailMutation.mutate();
  };

  const handlePhoneVerify = () => {
    if (!phoneCode) {
      toast.error("Please enter the verification code");
      return;
    }
    verifyPhoneMutation.mutate();
  };

  const handleResendEmail = () => {
    resendVerificationMutation.mutate("email");
  };

  const handleResendPhone = () => {
    resendVerificationMutation.mutate("phone");
  };

  // If all verified, redirect to dashboard
  useEffect(() => {
    const steps = verificationData?.data?.steps;
    if (steps?.email && steps?.phone && steps?.id) {
      router.push("/");
    }
  }, [verificationData, router]);

  if (!isMounted) {
    return null;
  }

  const steps = verificationData?.data?.steps || {
    email: false,
    phone: false,
    id: false,
  };
  const totalPercentage = verificationData?.data?.totalPercentage || 0;

  const verificationSteps = [
    {
      key: "email",
      icon: EnvelopeIcon,
      title: "Email Verification",
      description: "Verify your email address",
      weight: "20%",
      verified: steps.email,
      input: (
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Enter code"
            value={emailCode}
            onChange={(e) => setEmailCode(e.target.value)}
            className="flex-1 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            disabled={steps.email}
          />
          {!steps.email ? (
            <button
              onClick={handleEmailVerify}
              disabled={verifyEmailMutation.isLoading}
              className="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 text-sm font-medium whitespace-nowrap"
            >
              {verifyEmailMutation.isLoading ? "Verifying..." : "Verify"}
            </button>
          ) : (
            <div className="flex items-center justify-center sm:justify-start">
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
            </div>
          )}
        </div>
      ),
      action: !steps.email && (
        <button
          onClick={handleResendEmail}
          disabled={resendVerificationMutation.isLoading}
          className="text-sm text-primary-600 hover:text-primary-700 transition-colors flex items-center"
        >
          <ArrowPathIcon className="h-4 w-4 mr-1" />
          Resend Code
        </button>
      ),
    },
    {
      key: "phone",
      icon: PhoneIcon,
      title: "Phone Verification",
      description: "Verify your phone number",
      weight: "20%",
      verified: steps.phone,
      input: (
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Enter code"
            value={phoneCode}
            onChange={(e) => setPhoneCode(e.target.value)}
            className="flex-1 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            disabled={steps.phone}
          />
          {!steps.phone ? (
            <button
              onClick={handlePhoneVerify}
              disabled={verifyPhoneMutation.isLoading}
              className="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 text-sm font-medium whitespace-nowrap"
            >
              {verifyPhoneMutation.isLoading ? "Verifying..." : "Verify"}
            </button>
          ) : (
            <div className="flex items-center justify-center sm:justify-start">
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
            </div>
          )}
        </div>
      ),
      action: !steps.phone && (
        <button
          onClick={handleResendPhone}
          disabled={resendVerificationMutation.isLoading}
          className="text-sm text-primary-600 hover:text-primary-700 transition-colors flex items-center"
        >
          <ArrowPathIcon className="h-4 w-4 mr-1" />
          Resend Code
        </button>
      ),
    },
    {
      key: "id",
      icon: IdentificationIcon,
      title: "ID Verification",
      description: "Verify your identity (60% of total)",
      weight: "60%",
      verified: steps.id,
      input: (
        <div className="space-y-3">
          {!steps.id ? (
            <>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <label className="flex-1 w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors text-center bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    {idPreview ? "Change ID Document" : "Upload ID Document"}
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setIdFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setIdPreview(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {idPreview && (
                  <button
                    onClick={() => {
                      setIdFile(null);
                      setIdPreview(null);
                    }}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>
              {idPreview && (
                <div className="mt-2">
                  <img
                    src={idPreview}
                    alt="ID Preview"
                    className="h-32 w-full object-contain rounded-xl border border-gray-200 dark:border-gray-700"
                  />
                </div>
              )}
              <button
                onClick={() => {
                  toast.success(
                    "ID verification will be reviewed by our team."
                  );
                }}
                disabled={!idFile}
                className="w-full px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Submit ID for Verification
              </button>
            </>
          ) : (
            <div className="flex items-center text-green-600">
              <CheckCircleIcon className="h-6 w-6 mr-2" />
              <span className="font-medium">ID Verified</span>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Verify Your Account
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Complete the verification steps below to unlock all features.
            </p>
          </div>

          {/* Verification Progress */}
          <div className="mb-6 md:mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Verification Progress
              </span>
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                {totalPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${totalPercentage}%` }}
              />
            </div>
            <div className="flex flex-wrap justify-between mt-1.5 gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Email (20%)
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Phone (20%)
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ID (60%)
              </span>
            </div>
          </div>

          {/* Verification Steps */}
          <div className="space-y-4 sm:space-y-6">
            {verificationSteps.map((step, index) => (
              <div
                key={step.key}
                className={`border rounded-xl p-4 sm:p-6 transition-all ${
                  step.verified
                    ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div
                      className={`p-2 rounded-xl ${
                        step.verified
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-gray-100 dark:bg-gray-700"
                      } flex-shrink-0`}
                    >
                      <step.icon
                        className={`h-5 w-5 sm:h-6 sm:w-6 ${
                          step.verified
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {step.description}
                      </p>
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                        Weight: {step.weight}
                      </span>
                    </div>
                  </div>
                  {step.verified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 flex-shrink-0">
                      Verified
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  {step.input}
                  {step.action && <div className="mt-2">{step.action}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Skip option */}
          <div className="mt-6 md:mt-8 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Skip for now (You can verify later)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
