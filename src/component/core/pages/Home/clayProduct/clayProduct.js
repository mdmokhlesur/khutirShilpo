"use client";
import ProductCard from "@/component/ui/productCard";
import Button from "@/component/ui/button";
import { Icon } from "@iconify/react";
import Link from "next/link";
import useProducts from "@/hook/useProducts";

const ClayProduct = ({ isProductsPage }) => {
  const [products, loading] = useProducts();
  return (
    <>
      {!(loading) ? (
        <>
          <h2 className="artisan-section-title py-4 text-xl">
            <span>Clay</span> Products
          </h2>
          {/* show products */}
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
            {!isProductsPage ? (
              <>
                {/* home page clay products show */}
                {products
                  .filter((product) => product.category === "clay")
                  .slice(0, 6)
                  .map((product) => (
                    <ProductCard
                      key={product?._id}
                      id={product?._id}
                      product={product}
                    />
                  ))}
              </>
            ) : (
              <>
                {/* products page clay products show */}
                {products
                  .filter((product) => product.category === "clay")
                  .map((product) => (
                    <ProductCard
                      key={product?._id}
                      product={product}
                    />
                  ))}
              </>
            )}
          </div>
          {!isProductsPage && (
            <Link className="flex justify-end" href="/products/glass-products">
              <Button className="py-1 text-sm flex items-center mt-2">
                See More <Icon icon="heroicons-outline:arrow-sm-right" />
              </Button>
            </Link>
          )}
        </>
      ) : (
        <div className="">
        </div>
      )}
    </>
  );
};

export default ClayProduct;
