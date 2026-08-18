"use client";
import auth, { googleProvider } from "@/firebase.config/firebaseAuth";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";

const AuthProvider = ({ children }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const setUserRole = useAuthStore((state) => state.setUserRole);
  const setUserLoading = useAuthStore((state) => state.setUserLoading);

  //   user check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setUserRole("user");

      if (currentUser?.email) {
        try {
          const response = await fetch(
            `/api/users?email=${currentUser.email}`
          );
          const currentDbUser = await response.json();
          setUserRole(currentDbUser?.role || "user");
        } catch {
          setUserRole("user");
        }
      }

      setUserLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, [setUser, setUserLoading, setUserRole]);

  return children;
};

export default AuthProvider;
export const googleUser = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);
