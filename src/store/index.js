import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setAuth: (user, token, refreshToken) => {
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          error: null,
        });
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
        localStorage.removeItem("auth-storage");
      },

      updateUser: (userData) => {
        set((state) => ({
          user: {
            ...state.user,
            ...userData,
            // Ensure nested objects are preserved
            verificationSteps: {
              ...state.user?.verificationSteps,
              ...userData?.verificationSteps,
            },
            dealerProfile: {
              ...state.user?.dealerProfile,
              ...userData?.dealerProfile,
            },
          },
        }));
      },
      refreshUser: async () => {
        try {
          const { userAPI } = await import("../services/api");
          const response = await userAPI.getProfile();
          if (response.data.success) {
            set((state) => ({
              user: {
                ...state.user,
                ...response.data.data,
              },
            }));
            return response.data.data;
          }
        } catch (error) {
          console.error("Failed to refresh user:", error);
          return null;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useCarStore = create((set) => ({
  cars: [],
  featuredCars: [],
  totalCars: 0,
  currentPage: 1,
  totalPages: 1,
  filters: {},
  isLoading: false,
  error: null,

  setCars: (cars, total, page, totalPages) => {
    set({
      cars,
      totalCars: total,
      currentPage: page,
      totalPages,
    });
  },

  setFilters: (filters) => set({ filters }),

  addCar: (car) => {
    set((state) => ({
      cars: [car, ...state.cars],
      totalCars: state.totalCars + 1,
    }));
  },

  updateCar: (id, data) => {
    set((state) => ({
      cars: state.cars.map((car) =>
        car._id === id ? { ...car, ...data } : car
      ),
    }));
  },

  removeCar: (id) => {
    set((state) => ({
      cars: state.cars.filter((car) => car._id !== id),
      totalCars: state.totalCars - 1,
    }));
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export const useRideStore = create((set) => ({
  currentRide: null,
  rideHistory: [],
  activeRides: [],
  isLoading: false,
  error: null,

  setCurrentRide: (ride) => set({ currentRide: ride }),

  addRideToHistory: (ride) => {
    set((state) => ({
      rideHistory: [ride, ...state.rideHistory],
    }));
  },

  updateRideStatus: (id, status) => {
    set((state) => ({
      activeRides: state.activeRides.map((ride) =>
        ride._id === id ? { ...ride, status } : ride
      ),
      rideHistory: state.rideHistory.map((ride) =>
        ride._id === id ? { ...ride, status } : ride
      ),
    }));
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === id ? { ...n, read: true } : n
      ),
      unreadCount: state.unreadCount - 1,
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));
