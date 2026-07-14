import axios from "axios";
import { useAuthStore } from "../store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and not retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = useAuthStore.getState();
        const response = await api.post("/auth/refresh-token", {
          refreshToken,
        });

        if (response.data.success) {
          const { token, refreshToken: newRefreshToken } = response.data.data;
          useAuthStore
            .getState()
            .setAuth(useAuthStore.getState().user, token, newRefreshToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed - logout
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  verifyPhone: (data) => api.post("/auth/verify-phone", data),
  resendVerification: (data) => api.post("/auth/resend-verification", data),
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  resetPassword: (token, data) =>
    api.post(`/auth/reset-password/${token}`, data),
  logout: () => api.post("/auth/logout"),
  // Google Auth
  handleGoogleCallback: (params) =>
    api.get("/auth/google/callback/handle", { params }),
  completeGoogleProfileWithAvatar: (data) =>
    api.post("/auth/complete-google-profile", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  completeGoogleProfile: (data) => api.post("/auth/complete-profile", data),
};

export const carAPI = {
  getCars: (params) => api.get("/cars", { params }),
  getCar: (id) => api.get(`/cars/${id}`),
  createCar: (data) => api.post("/cars", data),
  updateCar: (id, data) => api.put(`/cars/${id}`, data),
  deleteCar: (id) => api.delete(`/cars/${id}`),
  addToFavorites: (id) => api.post(`/cars/${id}/favorite`),
  removeFromFavorites: (id) => api.delete(`/cars/${id}/favorite`),
  getFavorites: () => api.get("/cars/favorites"),
};

export const rideAPI = {
  requestRide: (data) => api.post("/rides/request", data),
  getRideHistory: (params) => api.get("/rides/history", { params }),
  getActiveRides: () => api.get("/rides/active"),
  cancelRide: (id) => api.post(`/rides/${id}/cancel`),
  rateRide: (id, data) => api.post(`/rides/${id}/rate`, data),
};

export const bookingAPI = {
  createBooking: (data) => api.post("/bookings", data),
  getBookings: (params) => api.get("/bookings", { params }),
  updateBookingStatus: (id, status) =>
    api.patch(`/bookings/${id}/status`, { status }),
  cancelBooking: (id) => api.post(`/bookings/${id}/cancel`),
};

export const paymentAPI = {
  initializePayment: (data) => api.post("/payments/initialize", data),
  verifyPayment: (reference) => api.get(`/payments/verify/${reference}`),
  getPaymentHistory: (params) => api.get("/payments/history", { params }),
};

// frontend/src/services/api.js - Add these to existing file

// Dealer API
export const dealerAPI = {
  getStats: (params) => api.get("/dealer/stats", { params }),
  getListings: (params) => api.get("/dealer/listings", { params }),
  getListing: (id) => api.get(`/dealer/listings/${id}`),
  createListing: (data) => api.post("/dealer/listings", data),
  updateListing: (id, data) => api.put(`/dealer/listings/${id}`, data),
  deleteListing: (id) => api.delete(`/dealer/listings/${id}`),
  getInquiries: () => api.get("/dealer/inquiries"),
  getSubscription: () => api.get("/dealer/subscription"),
  updateSubscription: (data) => api.put("/dealer/subscription", data),
};

// User API
export const userAPI = {
  getStats: () => api.get("/user/stats"),
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data) => api.put("/user/profile", data),
  updateAvatar: (data) => {
    return api.post("/user/avatar", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  // Single endpoint for profile completion with avatar
  completeProfileWithAvatar: (formData) =>
    api.post("/user/complete-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getFavorites: () => api.get("/user/favorites"),
  getBookings: (params) => api.get("/user/bookings", { params }),
  getRides: (params) => api.get("/user/rides", { params }),
  getMessages: () => api.get("/user/messages"),
  completeProfile: (data) => api.post("/auth/complete-profile", data),
  getVerificationStatus: () => api.get("/auth/verification-status"),
  verifyPhone: (data) => api.post("/auth/verify-phone", data),
  resendVerification: (data) => api.post("/auth/resend-verification", data),
};
// Admin API
export const adminAPI = {
  getStats: (params) => api.get("/admin/stats", { params }),
  getUsers: (params) => api.get("/admin/users", { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getCars: (params) => api.get("/admin/cars", { params }),
  updateCar: (id, data) => api.put(`/admin/cars/${id}`, data),
  deleteCar: (id) => api.delete(`/admin/cars/${id}`),
  getRides: (params) => api.get("/admin/rides", { params }),
  getPayments: (params) => api.get("/admin/payments", { params }),
  getRecentActivities: () => api.get("/admin/activities"),
};

export default api;
