import useCart from "@/hook/useCart";
import { Icon } from "@iconify/react";

const CartCount = () => {
  const [cartItems, cartLoading] = useCart();
  return (
    <>
      <Icon className="text-3xl mr-1" icon="heroicons-outline:shopping-cart" />
      <span className="h-6 w-6 flex items-center justify-center rounded-full p-1 bg-[var(--ks-clay)] text-white font-semibold text-sm relative bottom-2">
        {!cartLoading ? (
          cartItems?.length || 0
        ) : (
          <div className="mini-loader h-4 w-4"></div>
        )}
      </span>
    </>
  );
};

export default CartCount;
