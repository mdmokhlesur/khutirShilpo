"use client";
import ProductCard from "@/component/ui/productCard";
import Button from "@/component/ui/button";
import { Icon } from "@iconify/react";
import Link from "next/link";
import useProducts from "@/hook/useProducts";

const BambooProduct = ({ isProductsPage }) => {
  const [products, loading] = useProducts();
  return (
    <>
      {!(loading) ? (
        <>
          <h2 className="artisan-section-title py-4 text-xl">
            <span>Bamboo</span> Products
          </h2>
          {/* show products */}
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
            {!isProductsPage ? (
              <>
                {/* glass product for home page */}
                {products
                  .filter((product) => product.category === "bamboo")
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
                {/* glass product for products page */}
                {products
                  .filter((product) => product.category === "bamboo")
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
            <Link className="flex justify-end" href="/products/bamboo-products">
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

export default BambooProduct;
