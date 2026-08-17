"use client";
import useAuthContext from "@/hook/useAuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const PrivateRouter = ({ children }) => {
  const { user, userLoading } = useAuthContext();
  const { replace } = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      const isLogoutRedirect =
        window.sessionStorage.getItem("auth:logout-redirect") === "true";

      if (isLogoutRedirect) {
        window.sessionStorage.removeItem("auth:logout-redirect");
        replace("/");
        return;
      }

      toast.error("You need to login first");
      replace("/");
    }
  }, [replace, user, userLoading]);

  if (userLoading) {
    return <div className="loader mt-8"></div>;
  }

  if (!user) {
    return null
  }

  return <>{children}</>;
};

export default PrivateRouter;
