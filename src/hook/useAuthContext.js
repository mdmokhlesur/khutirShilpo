"use client"
import { googleUser, logout } from "@/providers/AuthProvider";
import useAuthStore from "@/store/useAuthStore";

const useAuthContext = () => {
    const state = useAuthStore();
    return {
        ...state,
        googleUser,
        logout,
    };
};

export default useAuthContext;
