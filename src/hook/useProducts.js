"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const useProducts = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    setLoading(true);
    fetch(`/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setProducts(data);
      })
      .catch((err) => {
        toast.error("something was wrong");
      });
  }, []);
  return [products, loading];
};
export const useCategoryProducts = (category) => {
  const [loading, setLoading] = useState(true);
  const [CategoryProducts, setCategoryProducts] = useState([]);
  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${category}`)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setCategoryProducts(data);
      })
      .catch(() => {
        toast.error("something was wrong");
      });
  }, [category]);
  return [CategoryProducts, loading];
};

export default useProducts;
