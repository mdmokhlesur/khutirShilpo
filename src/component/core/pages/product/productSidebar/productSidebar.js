"use client";
import { Icon } from "@iconify/react";
import { formatIsoDate } from "@/utils/formatDate";

const ProductSidebar = ({ product, loading }) => {
  const { madeDate, quantity, sells, manufactureAuthority, location } = product;
  return (
    <div className="border-l flex flex-col gap-1 bg-slate-50 rounded-r p-6 h-full">
      {!loading? (
        <>
          <p>Available Quantity: {quantity}.</p>
          <p>Sells: {sells}.</p>
          <p>Manufacture: {manufactureAuthority}.</p>
          <p>Manufacture-Date: {formatIsoDate(madeDate) || "N/A"}.</p>
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
