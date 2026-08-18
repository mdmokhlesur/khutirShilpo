import Button from "@/component/ui/button";
import { Icon } from "@iconify/react";
import Image from "next/image";
import googleLogo from "@/assets/google-logo.png";
import useAuthContext from "@/hook/useAuthContext";
import { usePathname, useRouter } from "next/navigation";
import CartCount from "./cartCount";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useState } from "react";

const NavbarTop = ({ setIsLogoutShow, isLogoutShow }) => {
  // hooks
  const { user, logout, userLoading, googleUser, setDashboardTitle, setUserRole } =
    useAuthContext();
  const { replace, push } = useRouter();
  const path = usePathname();
  const [searchText, setSearchText] = useState("");

  // google login handler
  const googleLoginHandler = () => {
    googleUser()
      .then((data) => {
        const loggedUser = {
          name: data?.user?.displayName,
          email: data?.user?.email,
          image: data?.user?.photoURL,
          userId: data?.user?.uid,
          metadata: data?.user?.metadata,
        };
        // add user in database
        fetch(`/api/users`, {
          method: "PUT",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify(loggedUser),
        })
          .then((res) => res.json())
          .then((savedUser) => {
            const role = savedUser?.role || "user";
            setUserRole(role);
            toast.success("User signed in successfully");
            if (role === "admin") {
              setDashboardTitle("dashboard");
              replace("/admin/dashboard");
              return;
            } else {
              setDashboardTitle("profile settings");
            }
            replace("/dashboard");
          })
          .catch((err) => {
            toast.error(err.message);
          });
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  // logout handler
  const logoutHandler = () => {
    logout().then(() => {
      if (path.includes("/dashboard") || path.includes("/product")) {
        replace("/");
      }
      toast.success("logout successfully");
    });
  };

  // cart Item handler
  const cartItemHandler = () => {
    replace("/checkout");
  };
  const searchHandler = (event) => {
    event.preventDefault();
    const query = searchText.trim();

    if (!query) {
      push("/products");
      return;
    }

    push(`/products?search=${encodeURIComponent(query)}`);
  };
  // profile button handler
  const profileBtnHandler = () => {
    if (!user) {
      return toast.error("You need to login first");
    }
    replace("/dashboard");
    setDashboardTitle("profile settings");
  };

  return (
    <div className={`bg-white`}>
      <div className="container py-4 flex justify-between items-center">
        <Link href="/">
          <h4 className="text-[#516067] text-2xl md:text-3xl font-semibold">
            Kutir Shilpo
          </h4>
        </Link>

        <div className="flex justify-between items-center gap-2">
          <form
            className="w-[30vw] mr-20 flex items-center justify-between py-2 px-3 rounded-full border border-[#516067]"
            onSubmit={searchHandler}
          >
            <input
              type="text"
              placeholder="Search for Categories"
              className="text-sm bg-transparent"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
            <button type="submit">
              <Icon
                className="text-[#516067]"
                icon="heroicons-outline:search"
              />
            </button>
          </form>
          <button onClick={cartItemHandler} className="flex items-center mr-4">
            <CartCount />
          </button>
          {/*user profile*/}
          {user ? (
            <div
              onClick={() => setIsLogoutShow(!isLogoutShow)}
              className="relative"
            >
              <Image
                width={40}
                height={40}
                className="rounded-full cursor-pointer"
                src={user?.photoURL}
                alt="user photo"
                title={user?.displayName}
              />
              <div
                className={`scale-0 ${
                  isLogoutShow && "scale-100"
                } absolute top-[115%] right-0 flex flex-col w-32 rounded border`}
              >
                <button
                  onClick={logoutHandler}
                  className="text-left flex items-center gap-1 px-3 pt-1 bg-slate-50 w-full hover:bg-white"
                >
                  <Icon icon="heroicons-outline:logout" />
                  Logout
                </button>
                <button
                  onClick={profileBtnHandler}
                  className="text-left flex items-center gap-1 px-3 pb-2 bg-slate-50 w-full hover:bg-white"
                >
                  <Icon
                    className="text-lg relative mt-1"
                    icon="heroicons-outline:user-circle"
                  />{" "}
                  profile
                </button>
              </div>
            </div>
          ) : (
            <>
              <div onClick={googleLoginHandler} className="cursor-pointer">
                {!userLoading ? (
                  <Button className="flex gap-1 items-center">
                    <Image
                      height={18}
                      width={18}
                      src={googleLogo}
                      alt="google logo"
                    />
                    Login
                  </Button>
                ) : (
                  <div className="h-6 w-6 mini-loader"></div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarTop;
