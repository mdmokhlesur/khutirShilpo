"use client";
import useAuthContext from "@/hook/useAuthContext";
import React from "react";
import UserSettings from "./userSettings";
import PaymentHistory from "./paymentHistory";

const MainContain = () => {
  const { dashboardTitle } = useAuthContext();

  return (
    <div>
      {dashboardTitle === "profile settings" ? (
        <UserSettings />
      ) : (
        <PaymentHistory />
      )}
    </div>
  );
};

export default MainContain;
