"use client";

import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  userRole: "user",
  userLoading: true,
  dashboardTitle: "profile settings",
  setUser: (user) => set({ user }),
  setUserRole: (userRole) => set({ userRole }),
  setUserLoading: (userLoading) => set({ userLoading }),
  setDashboardTitle: (dashboardTitle) => set({ dashboardTitle }),
}));

export default useAuthStore;
