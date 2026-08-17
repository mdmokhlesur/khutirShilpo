"use client";

import useAuthContext from "@/hook/useAuthContext";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const navItems = [
  {
    href: "/admin/dashboard",
    title: "Dashboard",
    icon: "heroicons-outline:home",
  },
  {
    href: "/admin/products",
    title: "Products",
    icon: "heroicons-outline:cube",
  },
  {
    href: "/admin/orders",
    title: "Orders",
    icon: "heroicons-outline:clipboard-list",
  },
];

const AdminShell = ({ children }) => {
  const { user, userLoading, userRole, logout } = useAuthContext();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    if (userLoading) return;

    if (!user) {
      const isLogoutRedirect =
        window.sessionStorage.getItem("auth:logout-redirect") === "true";

      if (isLogoutRedirect) {
        window.sessionStorage.removeItem("auth:logout-redirect");
        replace("/");
        return;
      }

      toast.error("You need to login first");
      replace("/");
      return;
    }

    if (userRole !== "admin") {
      toast.error("Admin access required");
      replace("/dashboard");
    }
  }, [replace, user, userLoading, userRole]);

  if (userLoading || !user || userRole !== "admin") {
    return <div className="loader mt-10"></div>;
  }

  const logoutHandler = () => {
    window.sessionStorage.setItem("auth:logout-redirect", "true");
    logout().then(() => {
      toast.success("logout successfully");
      replace("/");
    });
  };

  return (
    <div className="min-h-screen bg-[#eef7f4] text-[#213f3b]">
      <div className="grid min-h-screen md:grid-cols-[230px_1fr]">
        <aside className="flex min-h-screen flex-col border-r border-[#d7e8e3] bg-[#f7fbfa]">
          <Link href="/" className="flex h-20 items-center gap-2 px-6">
            <span className="flex h-9 w-9 items-center justify-center rounded bg-[#62d5bd] text-white">
              <Icon icon="heroicons-outline:sparkles" />
            </span>
            <span className="text-sm font-bold leading-tight">
              Kutir
              <br />
              Shilpo
            </span>
          </Link>

          <nav className="flex-1 space-y-2 px-4">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded px-4 py-3 text-sm font-semibold ${
                    active
                      ? "bg-[#62d5bd] text-[#123b34]"
                      : "text-[#516067] hover:bg-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon icon={item.icon} />
                    {item.title}
                  </span>
                  {active && <Icon icon="heroicons-outline:chevron-right" />}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[#d7e8e3] p-4">
            <p className="mb-3 truncate text-xs text-[#6f827e]">{user?.email}</p>
            <button
              onClick={logoutHandler}
              className="flex w-full items-center gap-2 rounded border px-4 py-3 text-sm font-semibold text-red-600"
              type="button"
            >
              <Icon icon="heroicons-outline:logout" />
              Logout
            </button>
          </div>
        </aside>

        <main className="min-w-0 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminShell;
