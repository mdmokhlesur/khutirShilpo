"use client";
import useAuthContext from "@/hook/useAuthContext";
import React, { useEffect } from "react";
import UserSettings from "./userSettings";
import CartItems from "./cartItems";
import PaymentHistory from "./paymentHistory";
import AdminStats from "./adminStats";

const MainContain = () => {
  const { dashboardTitle, setDashboardTitle, userRole } = useAuthContext();

  useEffect(() => {
    if (userRole === "admin" && dashboardTitle !== "dashboard") {
      setDashboardTitle("dashboard");
    }
  }, [dashboardTitle, setDashboardTitle, userRole]);

  return (
    <div className="col-span-4 my-8">
      {userRole === "admin" ? (
        <AdminStats />
      ) : dashboardTitle === "profile settings" ? (
        <UserSettings />
      ) : dashboardTitle === "cart items" ? (
        <CartItems />
      ) : (
        <PaymentHistory />
      )}
    </div>
  );
};

export default MainContain;
