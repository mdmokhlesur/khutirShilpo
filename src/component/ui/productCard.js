"use client";
import useAddToCart from "@/hook/useAddToCart";
import useAuthContext from "@/hook/useAuthContext";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
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
    <div className="flex flex-col border rounded-t rounded-b-lg overflow-hidden">
      <Image
        height={400}
        width={200}
        className="h-auto w-full"
        src={product?.image}
        alt="product image"
      />
      <div className="px-2">
        <span className="flex mt-4 text-sm text-[#8298a2]">
          <Icon icon="heroicons-outline:star" />
          <Icon icon="heroicons-outline:star" />
          <Icon icon="heroicons-outline:star" />
          <Icon icon="heroicons-outline:star" />
          <Icon icon="heroicons-outline:star" />
        </span>
        <h4 className="text-sm font-semibold uppercase my-3">
          {product?.title}
        </h4>
        <p className="text-sm p-1 px-3 mb-5 rounded-sm inline-block text-[#516067] font-semibold bg-[#f3f8fc]">
          ৳ {product?.price}
        </p>
      </div>
      <button
        className="mt-auto font-semibold text-[#516067] w-full text-center border border-[#516067]"
        onClick={()=>viewDetailsHandler(productSlug)}
      >
        view Detail
      </button>
      <button
      onClick={()=>addToCart(product)}
        className="block w-full text-white font-semibold text-sm bg-[#516067] py-1"
      >
        {!cartLoader?"Add to Cart":<div className="h-4 w-4 mini-loader"></div>}
      </button>
    </div>
  );
};

export default ProductCard;
