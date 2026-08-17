import "server-only";
import { randomUUID } from "crypto";
import DbConnect from "./DbConnect";

const productFields = `
  id::text AS "_id",
  title,
  image,
  price,
  category,
  description,
  quantity,
  sells,
  made_date AS "madeDate",
  manufacture_authority AS "manufactureAuthority",
  location,
  active
`;

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

export const getProductFromDb = async () => {
  const db = await DbConnect();
  const { rows } = await db.query(`
    SELECT ${productFields}
    FROM products
    WHERE active = TRUE
    ORDER BY created_at DESC, title ASC
  `);

  return rows;
};
export const getProductById = async (id) => {
  const db = await DbConnect();
  const { rows } = await db.query(
    `
      SELECT ${productFields}
      FROM products
      WHERE id = $1 AND active = TRUE
      LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
};
export const getProductByCategory = async (category) => {
  const db = await DbConnect();
  const { rows } = await db.query(
    `
      SELECT ${productFields}
      FROM products
      WHERE category = $1 AND active = TRUE
      ORDER BY created_at DESC, title ASC
    `,
    [category]
  );

  return rows;
};

export const getAllProductsForAdmin = async () => {
  const db = await DbConnect();
  const { rows } = await db.query(`
    SELECT ${productFields}
    FROM products
    ORDER BY created_at DESC, title ASC
  `);

  return rows;
};

export const addProductInDb = async (product) => {
  const db = await DbConnect();
  const normalizedProduct = normalizeProductInput(product);
  const { rows } = await db.query(
    `
      INSERT INTO products (
        id,
        title,
        image,
        price,
        category,
        description,
        quantity,
        sells,
        made_date,
        manufacture_authority,
        location,
        active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING ${productFields}
    `,
    [
      normalizedProduct.id,
      normalizedProduct.title,
      normalizedProduct.image,
      normalizedProduct.price,
      normalizedProduct.category,
      normalizedProduct.description,
      normalizedProduct.quantity,
      normalizedProduct.sells,
      normalizedProduct.madeDate,
      normalizedProduct.manufactureAuthority,
      normalizedProduct.location,
      normalizedProduct.active,
    ]
  );

  return rows[0];
};

export const updateProductInDb = async (id, product) => {
  const db = await DbConnect();
  const normalizedProduct = normalizeProductInput({ ...product, id });
  const { rows } = await db.query(
    `
      UPDATE products
      SET
        title = $2,
        image = $3,
        price = $4,
        category = $5,
        description = $6,
        quantity = $7,
        sells = $8,
        made_date = $9,
        manufacture_authority = $10,
        location = $11,
        active = $12,
        updated_at = NOW()
      WHERE id = $1
      RETURNING ${productFields}
    `,
    [
      id,
      normalizedProduct.title,
      normalizedProduct.image,
      normalizedProduct.price,
      normalizedProduct.category,
      normalizedProduct.description,
      normalizedProduct.quantity,
      normalizedProduct.sells,
      normalizedProduct.madeDate,
      normalizedProduct.manufactureAuthority,
      normalizedProduct.location,
      normalizedProduct.active,
    ]
  );

  return rows[0] || null;
};

export const setProductActiveInDb = async (id, active) => {
  const db = await DbConnect();
  const { rows } = await db.query(
    `
      UPDATE products
      SET active = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING ${productFields}
    `,
    [id, active]
  );

  return rows[0] || null;
};
