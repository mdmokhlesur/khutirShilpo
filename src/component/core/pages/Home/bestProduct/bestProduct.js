"use client";
import product1 from "@/assets/Bamboo-art/image-1.jpg";
import product2 from "@/assets/Glass-art/image-2.jpg";
import product3 from "@/assets/Glass-art/image-5.jpg";
import product4 from "@/assets/Bamboo-art/image-4.jpg";
import product5 from "@/assets/Bamboo-art/image-5.jpg";
import product6 from "@/assets/Bamboo-art/image-6.jpg";
import Button from "@/component/ui/button";
import { Icon } from "@iconify/react";
import Link from "next/link";
import BestProductCard from "@/component/ui/bestProductCard";

const bestProductObj = [
  {
    _id: 9,
    title: "Chines Bamboo art",
    image: product1,
    sells: 202,
  },
  {
    _id: 2,
    title: "product 2",
    image: product2,
    sells: 198,
  },
  {
    _id: 5,
    title: "product 3",
    image: product3,
    sells: 170,
  },
  {
    _id: 12,
    title: "product 4",
    image: product4,
    sells: 156,
  },
  {
    _id: 13,
    title: "product 5",
    image: product5,
    sells: 135,
  },
  {
    _id: 14,
    title: "product 6",
    image: product6,
    sells: 133,
  },
];
const BestProducts = () => {
  return (
    <>
      <h2 className="artisan-section-title py-4 text-xl">
        <span>Best</span> Products
      </h2>
      {/* show products */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 xl:grid-cols-6">
        {bestProductObj.map((product) => (
          <BestProductCard
            key={product?._id}
            id={product?._id}
            product={product}
          />
        ))}
      </div>
    </>
  );
};

export default BestProducts;
