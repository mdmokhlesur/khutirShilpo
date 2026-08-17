"use client";

import ProductCard from "@/component/ui/productCard";
import useProducts from "@/hook/useProducts";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const categories = [
  { label: "Bamboo", value: "bamboo" },
  { label: "Clay", value: "clay" },
  { label: "Glass", value: "glass" },
];

const ProductsCatalog = () => {
  const [products, loading] = useProducts();
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState("default");
  const searchText = searchParams.get("search")?.trim().toLowerCase() || "";

  const categoryCounts = useMemo(
    () =>
      categories.reduce((result, category) => {
        result[category.value] = products.filter(
          (product) => product?.category === category.value
        ).length;
        return result;
      }, {}),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const categoryMatched =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product?.category);
      const priceMatched = Number(product?.price || 0) <= maxPrice;
      const searchMatched =
        !searchText ||
        [product?.title, product?.category, product?.description]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(searchText));

      return categoryMatched && priceMatched && searchMatched;
    });

    if (sortBy === "price-low") {
      return filtered.sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0));
    }

    if (sortBy === "price-high") {
      return filtered.sort((a, b) => Number(b?.price || 0) - Number(a?.price || 0));
    }

    if (sortBy === "name") {
      return filtered.sort((a, b) => String(a?.title || "").localeCompare(String(b?.title || "")));
    }

    return filtered;
  }, [maxPrice, products, searchText, selectedCategories, sortBy]);

  const toggleCategory = (category) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  };

  if (loading) {
    return <div className="loader mt-8"></div>;
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    maxPrice < 2000 ||
    sortBy !== "default" ||
    Boolean(searchText);
  const sectionCategories = selectedCategories.length
    ? categories.filter((category) => selectedCategories.includes(category.value))
    : categories;

  return (
    <div className="py-4 text-[#516067]">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="self-start rounded border bg-slate-50 p-4 lg:sticky lg:top-4">
          <h3 className="mb-4 text-sm font-bold uppercase">Filter Products</h3>

          {searchText && (
            <div className="mb-4 rounded border bg-white p-3 text-sm">
              <p className="text-xs font-bold uppercase text-[#8298a2]">Search</p>
              <p className="mt-1 break-words">&quot;{searchParams.get("search")}&quot;</p>
            </div>
          )}

          <div className="border-b pb-4">
            <p className="mb-3 text-xs font-bold uppercase text-[#8298a2]">Categories</p>
            <div className="space-y-3 text-sm">
              {categories.map((category) => (
                <label key={category.value} className="flex cursor-pointer items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.value)}
                      onChange={() => toggleCategory(category.value)}
                    />
                    {category.label}
                  </span>
                  <span className="text-[#7f8f8b]">({categoryCounts[category.value] || 0})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-b py-4">
            <div className="mb-2 flex justify-between text-xs">
              <span>Max price</span>
              <span>৳{maxPrice}</span>
            </div>
            <input
              className="w-full accent-[#516067]"
              type="range"
              min="0"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
            />
          </div>

          <div className="py-4">
            <p className="mb-2 text-xs font-bold uppercase text-[#8298a2]">Sort</p>
            <select
              className="w-full rounded border px-3 py-2 text-sm"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="default">Default sorting</option>
              <option value="name">Name</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              className="w-full rounded border px-3 py-2 text-sm"
              onClick={() => {
                setSelectedCategories([]);
                setMaxPrice(2000);
                setSortBy("default");
                if (searchText) push("/products");
              }}
              type="button"
            >
              Clear filters
            </button>
          )}
        </aside>

        <div className="min-w-0">
          <p className="mb-2 text-sm text-[#8298a2]">
            Showing {filteredProducts.length} of {products.length} products
            {searchText ? ` for "${searchParams.get("search")}"` : ""}
          </p>

          {sectionCategories.map((category) => {
            const categoryProducts = filteredProducts.filter(
              (product) => product?.category === category.value
            );

            if (!categoryProducts.length) return null;

            return (
              <section key={category.value}>
                <h2 className="text-xl text-[#516067] py-4">
                  <span className="border-b-2 border-[#516067]">{category.label}</span> Products
                </h2>
                <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
                  {categoryProducts.map((product) => (
                    <ProductCard key={product?._id} product={product} />
                  ))}
                </div>
              </section>
            );
          })}

          {!filteredProducts.length && (
            <div className="rounded border bg-slate-50 p-8 text-center">
              <h2 className="text-lg font-semibold">No products found</h2>
              <p className="mt-2 text-sm text-[#8298a2]">
                Try another search or clear the filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsCatalog;
