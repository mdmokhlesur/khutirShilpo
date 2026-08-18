"use client";
import useAddToCart from "@/hook/useAddToCart";
import useAuthContext from "@/hook/useAuthContext";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {toast} from "react-hot-toast";

const ProductCard = ({ product }) => {
  const {user}=useAuthContext();
  const [addToCart,cartLoader]=useAddToCart();
  
  const { replace } = useRouter();
  const productSlug = String(product?.title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const viewDetailsHandler=(id)=>{
    if (!user) {
      return toast.error("You need to login first");
    }
    replace(`/product/${id}`)
  }
  return (
    <div className="group relative flex min-h-[372px] flex-col rounded border border-[var(--ks-border)] bg-white p-2 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <button
        className="absolute right-2 top-2 z-20 flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-400 transition hover:bg-red-100"
        type="button"
      >
        <Icon icon="heroicons-solid:heart" />
      </button>

      <div className="relative flex h-44 items-center justify-center overflow-hidden rounded bg-white">
        <button
          className="absolute right-2 top-12 z-10 hidden h-8 w-8 items-center justify-center rounded-lg bg-black text-white opacity-0 transition group-hover:flex group-hover:opacity-100"
          onClick={() => viewDetailsHandler(productSlug)}
          type="button"
        >
          <Icon icon="heroicons-outline:eye" />
        </button>
        <Image
          height={400}
          width={200}
          className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105"
          src={product?.image}
          alt="product image"
        />
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-3">
        <div className="mb-3 flex justify-end">
          <span className="rounded-md border border-[var(--ks-border)] bg-white px-2 py-1 text-xs font-medium text-[var(--ks-muted)] shadow-sm">
            Brand New
          </span>
        </div>
        <button
          className="text-left"
          onClick={() => viewDetailsHandler(productSlug)}
          type="button"
        >
          <h4 className="line-clamp-2 min-h-[56px] text-xl font-bold leading-7 text-[#1f2937]">
            {product?.title}
          </h4>
        </button>
        <p className="mt-1 text-xl font-bold text-orange-600">
          ৳{product?.price}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <span className="flex items-center gap-1 text-sm text-gray-400">
            <span className="flex text-gray-300">
              <Icon icon="heroicons-solid:star" />
              <Icon icon="heroicons-solid:star" />
              <Icon icon="heroicons-solid:star" />
              <Icon icon="heroicons-solid:star" />
              <Icon icon="heroicons-solid:star" />
            </span>
            (0)
          </span>
          <button
            onClick={()=>addToCart(product)}
            className="flex h-10 w-10 items-center justify-center rounded-md bg-black text-white transition hover:bg-[var(--ks-clay-dark)]"
            type="button"
          >
            {!cartLoader ? (
              <Icon className="text-xl" icon="heroicons-solid:shopping-cart" />
            ) : (
              <div className="h-4 w-4 mini-loader"></div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
