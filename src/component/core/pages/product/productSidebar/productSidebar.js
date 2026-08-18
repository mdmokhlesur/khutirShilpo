"use client";
import { Icon } from "@iconify/react";
import { formatIsoDate } from "@/utils/formatDate";

const ProductSidebar = ({ product, loading }) => {
  const { madeDate, quantity, sells, manufactureAuthority, location } = product;
  return (
    <div className="flex h-full flex-col gap-3 rounded-r border border-l-0 border-[var(--ks-border)] bg-white p-6 text-[var(--ks-ink)]">
      {!loading? (
        <>
          <p><span className="font-semibold">Available Quantity:</span> {quantity}.</p>
          <p><span className="font-semibold">Sells:</span> {sells}.</p>
          <p><span className="font-semibold">Manufacture:</span> {manufactureAuthority}.</p>
          <p><span className="font-semibold">Manufacture-Date:</span> {formatIsoDate(madeDate) || "N/A"}.</p>
          <p className="flex gap-1 items-center">
            <Icon
              className="text-lg"
              icon="heroicons-outline:location-marker"
            />
            {location&&location}.
          </p>
        </>
      ) : (
        <div className="loader mt-6"></div>
      )}
    </div>
  );
};

export default ProductSidebar;
