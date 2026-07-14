import "./globals.css";
import { Inter } from "next/font/google";
import { QueryClientProvider } from "./providers/QueryProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "./providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CapDrive - Car Marketplace & Ride Booking",
  description:
    "Your one-stop platform for buying cars, selling vehicles, and booking rides",
  keywords: "car marketplace, buy car, sell car, ride booking, car dealer",
  authors: [{ name: "CapDrive Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <QueryClientProvider>
          <AuthProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
