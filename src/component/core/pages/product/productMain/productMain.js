"use client";
import Button from "@/component/ui/button";
import useAddToCart from "@/hook/useAddToCart";
import { Icon } from "@iconify/react";
import Image from "next/image";
import React from "react";

const ProductMain = ({ product, loading }) => {
  const [addToCart, cartLoader] = useAddToCart();
  const { image, title, price } = product;
  return (
    <div className="grid gap-6 rounded-l border border-[var(--ks-border)] bg-[var(--ks-paper)] p-6 md:grid-cols-2 md:p-8">
      {!loading ? (
        <>
          {image && (
            <Image width={400} height={500} className="rounded bg-white object-cover shadow-sm" src={image} alt="product image" />
          )}
          <div>
            <div className="border-b pb-4">
              <h3 className="text-2xl font-semibold text-[var(--ks-ink)]">{title}</h3>
              {/* rating star */}
              <span className="flex mt-2 text-sm text-[var(--ks-clay)]">
                <Icon icon="heroicons-outline:star" />
                <Icon icon="heroicons-outline:star" />
                <Icon icon="heroicons-outline:star" />
                <Icon icon="heroicons-outline:star" />
                <Icon icon="heroicons-outline:star" />
              </span>
            </div>
            <h4 className="text-3xl mt-4 font-semibold text-[var(--ks-clay-dark)]">৳ {price}</h4>
            <div className="mt-4">
              {/* quantity select from */}
              <form className="flex items-center gap-2 mb-4">
                <label>Quantity</label>
                <button className="bg-[var(--ks-cream)] text-[var(--ks-clay-dark)] py-2 px-3 rounded" type="button">
                  <Icon icon="heroicons-outline:minus-sm" />
                </button>
                <input
                  className="w-10 text-center p-1"
                  type="number"
                  defaultValue={1}
                />
                <button className="bg-[var(--ks-cream)] text-[var(--ks-clay-dark)] py-2 px-3 rounded" type="button">
                  <Icon icon="heroicons-outline:plus-sm" />
                </button>
              </form>
              <button
                className="mr-3 py-2 px-3 rounded text-[var(--ks-clay-dark)] bg-transparent border border-[var(--ks-clay)] hover:bg-white"
                onClick={() => addToCart(product)}
                type="button"
              >
                {!cartLoader ? "Add To cart" : <div className="h-4 w-4 mini-loader"></div>}
              </button>
              <Button>Buy now</Button>
            </div>
          </div>
        </>
      ) : (
        <div className="loader mt-6"></div>
      )}
    </div>
  );
};

export default ProductMain;
