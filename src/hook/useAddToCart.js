import { useState } from "react";
import useAuthContext from "./useAuthContext";
import useCart from "./useCart";
import {toast} from "react-hot-toast";

const guestCartKey = "kutir-shilpo:guest-cart";

const getGuestCart = () => {
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

const createCartItem = (product) => ({
  id: product?._id,
  name: product?.title,
  image: product?.image,
  price: product?.price,
  quantity: 1,
});

const useAddToCart = () => {
    const {user}=useAuthContext();
    const [,,refetch]=useCart();
    const [addCartLoader,setAddCartLoader]=useState(false);
    const addToCart = (product) => {
        setAddCartLoader(true);
        if(!user?.email){
          const cartItem = createCartItem(product);
          const cartItems = getGuestCart();
          const alreadyAdded = cartItems.some((item) => item?.id === cartItem.id);
          const nextCartItems = alreadyAdded
            ? cartItems.map((item) =>
                item?.id === cartItem.id
                  ? { ...item, quantity: Number(item?.quantity || 1) + 1 }
                  : item
              )
            : [...cartItems, cartItem];

          saveGuestCart(nextCartItems);
          setAddCartLoader(false);
          refetch();
          return toast.success(
            alreadyAdded ? "Cart quantity updated" : "Added cart successfully"
          );
        }
        const updateDoc = {
          email: user?.email,
          cartItem:createCartItem(product)
        };
        fetch(`${process.env.NEXT_PUBLIC_api}api/users`, {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(updateDoc),
        })
          .then((res) => res.json())
          .then(() => {
            setAddCartLoader(false);
            refetch();
            toast.success("Added cart successfully")
          })
          .catch(() => {
            setAddCartLoader(false);
            toast.error("something is wrong")
          });
      };
    return [addToCart,addCartLoader];
};

export default useAddToCart;
