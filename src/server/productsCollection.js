import "server-only";
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
  location
`;

export const getProductFromDb = async () => {
  const db = DbConnect();
  const { rows } = await db.query(`
    SELECT ${productFields}
    FROM products
    ORDER BY created_at DESC, title ASC
  `);

  return rows;
};
export const getProductById = async (id) => {
  const db = DbConnect();
  const { rows } = await db.query(
    `
      SELECT ${productFields}
      FROM products
      WHERE id = $1
      LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
};
export const getProductByCategory = async (category) => {
  const db = DbConnect();
  const { rows } = await db.query(
    `
      SELECT ${productFields}
      FROM products
      WHERE category = $1
      ORDER BY created_at DESC, title ASC
    `,
    [category]
  );

  return rows;
};
