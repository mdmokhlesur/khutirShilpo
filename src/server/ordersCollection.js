import "server-only";
import DbConnect from "./DbConnect";

const mapOrder = (order) => {
  if (!order) return null;

  return {
    _id: order.id,
    email: order.email,
    customerName: order.customer_name,
    items: order.items || [],
    total: order.total,
    paymentMethod: order.payment_method,
    status: order.status,
    refundRequested: order.refund_requested,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
  };
};

export const getOrdersFromDb = async ({ email, isAdmin = false }) => {
  const db = await DbConnect();
  const { rows } = isAdmin
    ? await db.query(`
        SELECT *
        FROM orders
        ORDER BY created_at DESC
      `)
    : await db.query(
        `
          SELECT *
          FROM orders
          WHERE email = $1
          ORDER BY created_at DESC
        `,
        [email]
      );

  return rows.map(mapOrder);
};

export const addOrderInDb = async (order) => {
  const db = await DbConnect();
  const items = order?.items || [];
  const total = items.reduce(
    (sum, item) => sum + Number(item?.price || 0) * Number(item?.quantity || 1),
    0
  );
  const { rows } = await db.query(
    `
      INSERT INTO orders (email, customer_name, items, total, payment_method, status)
      VALUES ($1, $2, $3::jsonb, $4, $5, $6)
      RETURNING *
    `,
    [
      order?.email,
      order?.customerName || null,
      JSON.stringify(items),
      total,
      order?.paymentMethod || null,
      order?.status || "payment unsupported",
    ]
  );

  return mapOrder(rows[0]);
};

export const updateOrderInDb = async ({ id, status, refundRequested }) => {
  const db = await DbConnect();
  const { rows } = await db.query(
    `
      UPDATE orders
      SET
        status = COALESCE($2, status),
        refund_requested = COALESCE($3, refund_requested),
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [id, status || null, refundRequested ?? null]
  );

  return mapOrder(rows[0]);
};
