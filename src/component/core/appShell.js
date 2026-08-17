"use client";

import Footer from "@/component/core/footer/footer";
import NavBer from "@/component/core/navber/navber";
import { usePathname } from "next/navigation";

const AppShell = ({ children }) => {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isUserDashboardRoute = pathname?.startsWith("/dashboard");

  if (isAdminRoute || isUserDashboardRoute) {
    return children;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBer />
      <div className="container">{children}</div>
      <div className="mt-auto"><Footer /></div>
    </div>
  );
};

export default AppShell;
