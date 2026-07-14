"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Layout from "../../../components/Layout";
import { useAuthStore } from "../../../store";
import { adminAPI } from "../../../services/api";
import {
  UsersIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BellIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SimpleLayout from "@/components/SimpleLayout";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [dateRange, setDateRange] = useState("today");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isAuthenticated && user?.role !== "admin") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats", dateRange],
    queryFn: () => adminAPI.getStats({ range: dateRange }),
    enabled: isAuthenticated && user?.role === "admin" && isMounted,
  });

  const { data: activities } = useQuery({
    queryKey: ["admin-activities"],
    queryFn: () => adminAPI.getRecentActivities(),
    enabled: isAuthenticated && user?.role === "admin" && isMounted,
  });

  if (!isMounted || !isAuthenticated || user?.role !== "admin") {
    return <LoadingSpinner fullScreen />;
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.data?.totalUsers || 0,
      icon: UsersIcon,
      color: "bg-blue-500",
      change: "+12%",
      trend: "up",
    },
    {
      title: "Total Cars Listed",
      value: stats?.data?.totalCars || 0,
      icon: TruckIcon,
      color: "bg-green-500",
      change: "+8%",
      trend: "up",
    },
    {
      title: "Total Rides",
      value: stats?.data?.totalRides || 0,
      icon: TruckIcon,
      color: "bg-purple-500",
      change: "+15%",
      trend: "up",
    },
    {
      title: "Revenue",
      value: `₦${(stats?.data?.revenue || 0).toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: "bg-yellow-500",
      change: "+23%",
      trend: "up",
    },
    {
      title: "Active Dealers",
      value: stats?.data?.activeDealers || 0,
      icon: UserGroupIcon,
      color: "bg-indigo-500",
      change: "+5%",
      trend: "up",
    },
    {
      title: "Pending Approvals",
      value: stats?.data?.pendingApprovals || 0,
      icon: DocumentTextIcon,
      color: "bg-red-500",
      change: "-3%",
      trend: "down",
    },
  ];

  return (
    <SimpleLayout title="Admin Dashboard - CapDrive">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back, {user?.firstName}!
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                    <stat.icon
                      className={`h-6 w-6 ${stat.color.replace(
                        "bg-",
                        "text-"
                      )}`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium flex items-center ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </span>
                </div>
                <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Charts and Recent Activity */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Revenue Overview
            </h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-gray-500 dark:text-gray-400">
                Chart component will be rendered here
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
              <BellIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {activities?.data?.length > 0 ? (
                activities.data.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 mt-2 rounded-full bg-primary-500"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No recent activities
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}

// "use client";

// import React, { useEffect, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import Layout from "@/components/Layout";
// import { useAuthStore } from "@/store";
// import {
//   UsersIcon,
//   CarIcon,
//   CurrencyDollarIcon,
//   ChartBarIcon,
//   TruckIcon,
//   UserGroupIcon,
//   DocumentTextIcon,
//   BellIcon,
// } from "@heroicons/react/24/outline";
// import { adminAPI } from "../../../services/api";
// import LoadingSpinner from "../../../components/LoadingSpinner";

// export default function AdminDashboard() {
//   const router = useRouter();
//   const { user, isAuthenticated } = useAuthStore();
//   const [dateRange, setDateRange] = useState("today");

//   // Check admin access
//   useEffect(() => {
//     if (isAuthenticated && user?.role !== "admin") {
//       router.push("/");
//     }
//   }, [isAuthenticated, user, router]);

//   // Fetch statistics
//   const { data: stats, isLoading: statsLoading } = useQuery({
//     queryKey: ["admin-stats", dateRange],
//     queryFn: () => adminAPI.getStats({ range: dateRange }),
//     enabled: isAuthenticated && user?.role === "admin",
//   });

//   // Fetch recent activities
//   const { data: activities } = useQuery({
//     queryKey: ["admin-activities"],
//     queryFn: () => adminAPI.getRecentActivities(),
//     enabled: isAuthenticated && user?.role === "admin",
//   });

//   if (!isAuthenticated || user?.role !== "admin") {
//     return <LoadingSpinner />;
//   }

//   const statCards = [
//     {
//       title: "Total Users",
//       value: stats?.data?.totalUsers || 0,
//       icon: UsersIcon,
//       color: "bg-blue-500",
//       change: "+12%",
//     },
//     {
//       title: "Total Cars Listed",
//       value: stats?.data?.totalCars || 0,
//       icon: CarIcon,
//       color: "bg-green-500",
//       change: "+8%",
//     },
//     {
//       title: "Total Rides",
//       value: stats?.data?.totalRides || 0,
//       icon: TruckIcon,
//       color: "bg-purple-500",
//       change: "+15%",
//     },
//     {
//       title: "Revenue",
//       value: `₦${(stats?.data?.revenue || 0).toLocaleString()}`,
//       icon: CurrencyDollarIcon,
//       color: "bg-yellow-500",
//       change: "+23%",
//     },
//     {
//       title: "Active Dealers",
//       value: stats?.data?.activeDealers || 0,
//       icon: UserGroupIcon,
//       color: "bg-indigo-500",
//       change: "+5%",
//     },
//     {
//       title: "Pending Approvals",
//       value: stats?.data?.pendingApprovals || 0,
//       icon: DocumentTextIcon,
//       color: "bg-red-500",
//       change: "-3%",
//     },
//   ];

//   return (
//     <Layout title="Admin Dashboard">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//             <p className="text-gray-600 mt-1">
//               Welcome back, {user?.firstName}!
//             </p>
//           </div>
//           <div className="flex items-center space-x-4 mt-4 md:mt-0">
//             <select
//               value={dateRange}
//               onChange={(e) => setDateRange(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
//             >
//               <option value="today">Today</option>
//               <option value="week">This Week</option>
//               <option value="month">This Month</option>
//               <option value="quarter">This Quarter</option>
//               <option value="year">This Year</option>
//             </select>
//             <button className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors">
//               Export Report
//             </button>
//           </div>
//         </div>

//         {/* Stats Grid */}
//         {statsLoading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[...Array(6)].map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
//               >
//                 <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
//                 <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
//                 <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {statCards.map((stat, index) => (
//               <div
//                 key={index}
//                 className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
//                     <stat.icon
//                       className={`h-6 w-6 ${stat.color.replace(
//                         "bg-",
//                         "text-"
//                       )}`}
//                     />
//                   </div>
//                   <span
//                     className={`text-sm font-medium ${
//                       stat.change.startsWith("+")
//                         ? "text-green-600"
//                         : "text-red-600"
//                     }`}
//                   >
//                     {stat.change}
//                   </span>
//                 </div>
//                 <p className="mt-4 text-2xl font-bold text-gray-900">
//                   {stat.value}
//                 </p>
//                 <p className="text-sm text-gray-600">{stat.title}</p>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Charts and Recent Activity */}
//         <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Chart */}
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Revenue Overview
//             </h3>
//             <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
//               <p className="text-gray-500">
//                 Chart component will be rendered here
//               </p>
//               {/* Use recharts or chart.js here */}
//             </div>
//           </div>

//           {/* Recent Activity */}
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Recent Activity
//               </h3>
//               <BellIcon className="h-5 w-5 text-gray-400" />
//             </div>
//             <div className="space-y-4">
//               {activities?.data?.map((activity, index) => (
//                 <div key={index} className="flex items-start space-x-3">
//                   <div className="flex-shrink-0">
//                     <div className="w-2 h-2 mt-2 rounded-full bg-primary-500"></div>
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm text-gray-900">
//                       {activity.description}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {new Date(activity.createdAt).fromNow()}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }
