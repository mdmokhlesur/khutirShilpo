"use client";

import useAuthContext from "@/hook/useAuthContext";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const userDashboardItems = [
  {
    title: "profile settings",
    label: "Profile Settings",
    icon: "heroicons-outline:user-circle",
  },
  {
    title: "payment history",
    label: "Payment History",
    icon: "heroicons-outline:currency-bangladeshi",
  },
];

const UserDashboardShell = ({ children }) => {
  const { dashboardTitle, setDashboardTitle, logout, user } = useAuthContext();
  const { replace } = useRouter();

  useEffect(() => {
    if (!userDashboardItems.some((item) => item.title === dashboardTitle)) {
      setDashboardTitle("profile settings");
    }
  }, [dashboardTitle, setDashboardTitle]);

  const logoutHandler = () => {
    window.sessionStorage.setItem("auth:logout-redirect", "true");
    logout().then(() => {
      toast.success("logout successfully");
      replace("/");
    });
  };

  return (
    <div className="grid min-h-screen bg-[#eef7f4] text-[#213f3b] md:grid-cols-[230px_1fr]">
      <aside className="flex min-h-screen flex-col border-r border-[#d7e8e3] bg-[#f7fbfa] md:sticky md:top-0 md:h-screen">
        <Link href="/" className="flex h-20 items-center gap-2 px-6">
          <span className="flex h-9 w-9 items-center justify-center rounded bg-[#62d5bd] text-white">
            <Icon icon="heroicons-outline:user" />
          </span>
          <span className="text-sm font-bold leading-tight">
            Dashboard
          </span>
        </Link>

        <nav className="space-y-2 px-4">
          {userDashboardItems.map((item) => {
            const active = dashboardTitle === item.title;
            return (
              <button
                key={item.title}
                onClick={() => setDashboardTitle(item.title)}
                className={`flex w-full items-center justify-between rounded px-4 py-3 text-left text-sm font-semibold ${
                  active
                    ? "bg-[#62d5bd] text-[#123b34]"
                    : "text-[#516067] hover:bg-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon icon={item.icon} />
                  {item.label}
                </span>
                {active && <Icon icon="heroicons-outline:chevron-right" />}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-[#d7e8e3] p-4">
          <p className="mb-3 truncate text-xs text-[#6f827e]">{user?.email}</p>
          <button
            onClick={logoutHandler}
            className="flex w-full items-center gap-2 rounded border px-4 py-3 text-sm font-semibold text-red-600"
          >
            <Icon icon="heroicons-outline:logout" />
            Logout
          </button>
        </div>
      </aside>

      <main className="min-h-screen min-w-0 p-5 md:p-8">{children}</main>
    </div>
  );
};

export default UserDashboardShell;
