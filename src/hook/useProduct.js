"use client";

import { useEffect, useState } from "react";
import {toast} from "react-hot-toast";

const useProduct = (id) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({});
  useEffect(() => {
    fetch(`/api/product?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("something was wrong")
      });
  }, [id]);

  return [product, loading];
};

export default useProduct;
