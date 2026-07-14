"use client";

import React, { useEffect } from "react";
import Head from "next/head";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuthStore } from "../store";

const Layout = ({ children, title = "Car Marketplace" }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // Protected routes
  useEffect(() => {
    const protectedRoutes = [
      "/dashboard",
      "/admin",
      "/dealer",
      "/profile",
      "/favorites",
      "/bookings",
      "/rides",
    ];
    const isProtected = protectedRoutes.some((route) =>
      pathname?.startsWith(route)
    );

    if (isProtected && !isAuthenticated) {
      router.push("/login");
    }
  }, [pathname, isAuthenticated, router]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="Car Marketplace & Ride Booking Platform"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
};

export default Layout;
