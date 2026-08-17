"use client";

import { useEffect, useState } from "react";
import useAuthContext from "./useAuthContext";
import { toast } from "react-hot-toast";

const guestCartKey = "kutir-shilpo:guest-cart";

const getGuestCart = () => {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(window.localStorage.getItem(guestCartKey) || "[]");
  } catch {
    return [];
  }
};

const saveGuestCart = (cartItems) => {
  window.localStorage.setItem(guestCartKey, JSON.stringify(cartItems));
  window.dispatchEvent(new Event("guest-cart-updated"));
};

const useCart = () => {
  const { user } = useAuthContext();
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  //   cart items set on loader
  useEffect(() => {
    if (!user?.email) {
      setCartItems(getGuestCart());
      setCartLoading(false);

      const updateGuestCart = () => setCartItems(getGuestCart());
      window.addEventListener("storage", updateGuestCart);
      window.addEventListener("guest-cart-updated", updateGuestCart);

      return () => {
        window.removeEventListener("storage", updateGuestCart);
        window.removeEventListener("guest-cart-updated", updateGuestCart);
      };
    }

    setCartLoading(true);
    const guestCartItems = getGuestCart();
    const mergeGuestCart = guestCartItems.length
      ? Promise.all(
          guestCartItems.map((cartItem) =>
            fetch(`${process.env.NEXT_PUBLIC_api}api/users`, {
              method: "PATCH",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({ email: user.email, cartItem }),
            })
          )
        ).then(() => {
          saveGuestCart([]);
        })
      : Promise.resolve();

    mergeGuestCart
      .then(() => fetch(`${process.env.NEXT_PUBLIC_api}api/users?email=${user?.email}`))
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data?.cartItem||[]);
        setCartLoading(false);
      })
      .catch(() => {
        toast.error("Cart item not found");
        setCartLoading(false);
      });
  }, [user]);

  const refetch = () => {
    if (!user?.email) {
      setCartItems(getGuestCart());
      setCartLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_api}api/users?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data?.cartItem || []);
        setCartLoading(false);
      })
      .catch(() => {
        toast.error("something was wrong")
        setCartLoading(false);
      });
  };

  const removeCartItem = (id) => {
    if (!user?.email) {
      const nextCartItems = getGuestCart().filter((item) => item?.id !== id);
      saveGuestCart(nextCartItems);
      setCartItems(nextCartItems);
      return Promise.resolve();
    }

    return fetch(`${process.env.NEXT_PUBLIC_api}api/users`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: user.email, removeCartItem: id }),
    }).then(() => refetch());
  };

  const updateCartItemQuantity = (id, quantity) => {
    const nextQuantity = Math.max(Number(quantity || 1), 1);

    if (!user?.email) {
      const nextCartItems = getGuestCart().map((item) =>
        item?.id === id ? { ...item, quantity: nextQuantity } : item
      );
      saveGuestCart(nextCartItems);
      setCartItems(nextCartItems);
      return Promise.resolve();
    }

    return fetch(`${process.env.NEXT_PUBLIC_api}api/users`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        updateCartItemQuantity: id,
        quantity: nextQuantity,
      }),
    }).then(() => refetch());
  };

  const clearCart = () => {
    if (!user?.email) {
      saveGuestCart([]);
      setCartItems([]);
      return Promise.resolve();
    }

    return fetch(`${process.env.NEXT_PUBLIC_api}api/users`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: user.email, clearCart: true }),
    }).then(() => refetch());
  };

  return [
    cartItems,
    cartLoading,
    refetch,
    removeCartItem,
    clearCart,
    updateCartItemQuantity,
  ];
};

export default useCart;
