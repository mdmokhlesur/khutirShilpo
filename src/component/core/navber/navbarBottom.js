import React, { useEffect } from "react";
import ActiveLink from "../activeLink/activeLink";
import useAuthContext from "@/hook/useAuthContext";

const NavbarBottom = ({setIsLogoutShow}) => {
    const { user, userRole } = useAuthContext();
    

  // is logged show
  useEffect(() => {
    setIsLogoutShow(false);
  }, [user,setIsLogoutShow]);
  return (
    <div className="bg-[var(--ks-clay-dark)]">
      <div className="container flex gap-4 justify-end text-sm font-semibold">
        <ActiveLink className="py-3 px-5 text-white/90 hover:bg-white/10" href="/">
          Home
        </ActiveLink>
        <ActiveLink className="py-3 px-5 text-white/90 hover:bg-white/10" href="/products">
          Products
        </ActiveLink>
        {user && (
          <ActiveLink className="py-3 px-5 text-white/90 hover:bg-white/10" href={userRole === "admin" ? "/admin/dashboard" : "/dashboard"}>
            Dashboard
          </ActiveLink>
        )}
      </div>
    </div>
  );
};

export default NavbarBottom;
