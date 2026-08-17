"use client";

import useAuthContext from "@/hook/useAuthContext";
import useCart from "@/hook/useCart";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";

const unsupportedPayments = [
  { label: "bKash", icon: "heroicons-outline:device-mobile" },
  { label: "Nagad", icon: "heroicons-outline:cash" },
  { label: "Card", icon: "heroicons-outline:credit-card" },
];

const CheckoutCart = () => {
  const { user, googleUser, setDashboardTitle, setUserRole } = useAuthContext();
  const [
    cartItems,
    cartLoading,
    refetch,
    removeCartItem,
    clearCart,
    updateCartItemQuantity,
  ] = useCart();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + Number(item?.price || 0) * Number(item?.quantity || 1),
        0
      ),
    [cartItems]
  );

  const handleUnsupportedPayment = (method) => {
    toast.error(
      `${method} payment method is not supported. Sorry for the inconvenience.`
    );
  };

  const handlePurchase = () => {
    if (!user?.email) {
      setLoginLoading(true);
      googleUser()
        .then((data) => {
          const loggedUser = {
            name: data?.user?.displayName,
            email: data?.user?.email,
            image: data?.user?.photoURL,
            userId: data?.user?.uid,
            metadata: data?.user?.metadata,
          };

          return fetch(`${process.env.NEXT_PUBLIC_api}api/users`, {
            method: "PUT",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(loggedUser),
          });
        })
        .then((res) => res.json())
        .then((savedUser) => {
          setUserRole(savedUser?.role || "user");
          setDashboardTitle("profile settings");
          toast.success("User signed in successfully");
          setShowPaymentOptions(true);
        })
        .catch((error) => {
          toast.error(error.message || "Login failed");
        })
        .finally(() => {
          setLoginLoading(false);
        });
      return;
    }

    setShowPaymentOptions(true);
  };

  const handleTestPayment = () => {
    if (!user?.email) {
      toast.error("You need to login before purchase");
      return;
    }

    if (!cartItems.length) {
      toast.error("Your cart is empty");
      return;
    }

    setOrderLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_api}api/orders`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        customerName: user?.displayName || "Customer",
        items: cartItems,
        paymentMethod: "test payment",
        status: "fake order",
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Order was not created");
        return res.json();
      })
      .then(() => clearCart())
      .then(() => {
        refetch();
        setShowPaymentOptions(false);
        toast.success("Fake order created successfully");
      })
      .catch((error) => {
        toast.error(error.message || "Something went wrong");
      })
      .finally(() => {
        setOrderLoading(false);
      });
  };

  if (cartLoading) {
    return <div className="loader mt-8"></div>;
  }

  if (!cartItems.length) {
    return (
      <div className="mx-auto max-w-2xl rounded border bg-slate-50 p-8 text-center text-[#516067]">
        <Icon className="mx-auto mb-3 text-4xl" icon="heroicons-outline:shopping-cart" />
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-[#8298a2]">
          Add products to your cart and come back here to place a test order.
        </p>
        <Link
          className="mt-5 inline-flex rounded bg-[#516067] px-4 py-2 text-sm font-semibold text-white"
          href="/products"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 text-[#516067]">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Shopping Cart</h1>
          <p className="text-sm text-[#8298a2]">
            Review your items and create a fake order with test payment.
          </p>
        </div>
        <Link className="text-sm font-semibold underline" href="/products">
          Continue shopping
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="overflow-hidden rounded border bg-white">
          <div className="hidden grid-cols-12 bg-slate-100 px-4 py-3 text-sm font-semibold md:grid">
            <span className="col-span-6">Product</span>
            <span className="col-span-2 text-center">Quantity</span>
            <span className="col-span-2 text-right">Price</span>
            <span className="col-span-2 text-right">Action</span>
          </div>

          <div className="divide-y">
            {cartItems.map((item) => (
              <div
                className="grid gap-4 p-4 md:grid-cols-12 md:items-center"
                key={item?.id}
              >
                <div className="flex items-center gap-4 md:col-span-6">
                  <Image
                    src={item?.image}
                    height={72}
                    width={72}
                    className="h-18 w-18 rounded object-cover"
                    alt={item?.name || "product image"}
                  />
                  <div>
                    <h2 className="font-semibold">{item?.name}</h2>
                    <p className="text-sm text-[#8298a2]">Product in cart</p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center md:justify-center">
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-l border text-lg"
                      onClick={() =>
                        updateCartItemQuantity(
                          item?.id,
                          Number(item?.quantity || 1) - 1
                        )
                      }
                      type="button"
                    >
                      <Icon icon="heroicons-outline:minus-sm" />
                    </button>
                    <span className="flex h-8 min-w-[42px] items-center justify-center border-y px-3 text-sm font-semibold">
                      {item?.quantity || 1}
                    </span>
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-r border text-lg"
                      onClick={() =>
                        updateCartItemQuantity(
                          item?.id,
                          Number(item?.quantity || 1) + 1
                        )
                      }
                      type="button"
                    >
                      <Icon icon="heroicons-outline:plus-sm" />
                    </button>
                  </div>
                </div>

                <div className="font-semibold md:col-span-2 md:text-right">
                  ৳ {Number(item?.price || 0) * Number(item?.quantity || 1)}
                </div>

                <div className="md:col-span-2 md:text-right">
                  <button
                    className="inline-flex items-center gap-2 rounded border px-3 py-2 text-sm font-semibold text-red-600"
                    onClick={() => removeCartItem(item?.id)}
                    type="button"
                  >
                    <Icon icon="heroicons-outline:trash" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="self-start rounded border bg-slate-50 p-5">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-3 border-b pb-4 text-sm">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>৳ {subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>৳ 0</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>৳ {subtotal}</span>
          </div>

          <button
            className="mt-5 w-full rounded bg-[#516067] px-4 py-3 text-sm font-semibold text-white"
            disabled={loginLoading}
            onClick={handlePurchase}
            type="button"
          >
            {loginLoading ? "Opening login..." : "Purchase"}
          </button>

          {showPaymentOptions && (
            <div className="mt-5 space-y-3">
              <p className="text-sm font-semibold">Choose payment method</p>
              <div className="grid grid-cols-3 gap-2">
                {unsupportedPayments.map((payment) => (
                  <button
                    className="flex flex-col items-center justify-center gap-2 rounded border bg-white p-3 text-xs font-semibold"
                    key={payment.label}
                    onClick={() => handleUnsupportedPayment(payment.label)}
                    type="button"
                  >
                    <Icon className="text-xl" icon={payment.icon} />
                    {payment.label}
                  </button>
                ))}
              </div>

              <button
                className="flex w-full items-center justify-center gap-2 rounded bg-[#62d5bd] px-4 py-3 text-sm font-semibold text-[#123b34]"
                disabled={orderLoading}
                onClick={handleTestPayment}
                type="button"
              >
                {orderLoading ? (
                  <span className="mini-loader h-4 w-4"></span>
                ) : (
                  <Icon icon="heroicons-outline:beaker" />
                )}
                Test the payment
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default CheckoutCart;
