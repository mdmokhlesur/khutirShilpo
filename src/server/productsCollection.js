import "server-only";
import { randomUUID } from "crypto";
import DbConnect from "./DbConnect";

const normalizeProductInput = (product) => ({
  id: product?.id || product?._id || randomUUID(),
  title: product?.title,
  image: product?.image || null,
  price: Number(product?.price || 0),
  category: product?.category || null,
  description: product?.description || null,
  quantity: Number(product?.quantity || 0),
  sells: Number(product?.sells || 0),
  madeDate: product?.madeDate || product?.made_date || null,
  manufactureAuthority:
    product?.manufactureAuthority || product?.manufacture_authority || null,
  location: product?.location || null,
  active: product?.active !== false,
});

const createSlug = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const mapProduct = (product) => {
  if (!product) return null;

  return {
    _id: product.id,
    title: product.title,
    image: product.image,
    price: Number(product.price || 0),
    category: product.category,
    description: product.description,
    quantity: product.quantity,
    sells: product.sells,
    madeDate: product.madeDate,
    manufactureAuthority: product.manufactureAuthority,
    location: product.location,
    active: product.active,
  };
};

export const getProductFromDb = async () => {
  const products = await DbConnect.product.findMany({
    where: { active: true },
    orderBy: [{ createdAt: "desc" }, { title: "asc" }],
  });

  return products.map(mapProduct);
};
export const getProductById = async (id) => {
  if (!id) return null;

  const product = await DbConnect.product.findFirst({
    where: { id, active: true },
  });

  if (product) return mapProduct(product);

  const activeProducts = await DbConnect.product.findMany({
    where: { active: true },
  });

  return activeProducts
    .map(mapProduct)
    .find((activeProduct) => createSlug(activeProduct?.title) === id) || null;
};
export const getProductByCategory = async (category) => {
  const products = await DbConnect.product.findMany({
    where: { category, active: true },
    orderBy: [{ createdAt: "desc" }, { title: "asc" }],
  });

  return products.map(mapProduct);
};

export const getAllProductsForAdmin = async () => {
  const products = await DbConnect.product.findMany({
    orderBy: [{ createdAt: "desc" }, { title: "asc" }],
  });

  return products.map(mapProduct);
};

export const addProductInDb = async (product) => {
  const normalizedProduct = normalizeProductInput(product);
  const createdProduct = await DbConnect.product.create({
    data: normalizedProduct,
  });

  return mapProduct(createdProduct);
};

export const updateProductInDb = async (id, product) => {
  const normalizedProduct = normalizeProductInput({ ...product, id });

  try {
    const updatedProduct = await DbConnect.product.update({
      where: { id },
      data: {
        title: normalizedProduct.title,
        image: normalizedProduct.image,
        price: normalizedProduct.price,
        category: normalizedProduct.category,
        description: normalizedProduct.description,
        quantity: normalizedProduct.quantity,
        sells: normalizedProduct.sells,
        madeDate: normalizedProduct.madeDate,
        manufactureAuthority: normalizedProduct.manufactureAuthority,
        location: normalizedProduct.location,
        active: normalizedProduct.active,
      },
    });

    return mapProduct(updatedProduct);
  } catch (error) {
    if (error?.code === "P2025") return null;
    throw error;
  }
};

export const setProductActiveInDb = async (id, active) => {
  try {
    const updatedProduct = await DbConnect.product.update({
      where: { id },
      data: { active },
    });

    return mapProduct(updatedProduct);
  } catch (error) {
    if (error?.code === "P2025") return null;
    throw error;
  }
};
