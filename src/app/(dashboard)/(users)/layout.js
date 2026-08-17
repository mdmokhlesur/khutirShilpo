"use client";

import UserDashboardShell from "@/component/core/pages/dashboard/userDashboardShell";
import PrivateRouter from "@/component/ui/privateRouter";

const UserDashboardLayout = ({ children }) => {
  return (
    <PrivateRouter>
      <UserDashboardShell>{children}</UserDashboardShell>
    </PrivateRouter>
  );
};

export default UserDashboardLayout;
