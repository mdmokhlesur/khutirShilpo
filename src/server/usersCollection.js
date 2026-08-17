import "server-only";
import DbConnect from "./DbConnect";

const mapUser = (user) => {
  if (!user) return null;

  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    userId: user.user_id,
    metadata: user.metadata || {},
    cartItem: user.cart_item || [],
    payments: user.payments || [],
    role: user.email === process.env.ADMIN_EMAIL ? "admin" : "user",
  };
};

const mongoStyleWriteResult = (result) => ({
  acknowledged: true,
  matchedCount: result.rowCount,
  modifiedCount: result.rowCount,
  upsertedCount: result.rowCount,
});

// get user from db
export const getUserFromDb = async (email) => {
  const db = await DbConnect();
  const { rows } = await db.query(
    `
      SELECT id, name, email, image, user_id, metadata, cart_item, payments
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email]
  );

  return mapUser(rows[0]);
};
export const addUserInDb = async (loggedUser) => {
  const db = await DbConnect();
  const result = await db.query(
    `
      INSERT INTO users (name, email, image, user_id, metadata)
      VALUES ($1, $2, $3, $4, $5::jsonb)
      ON CONFLICT (email)
      DO UPDATE SET
        name = EXCLUDED.name,
        image = EXCLUDED.image,
        user_id = EXCLUDED.user_id,
        metadata = EXCLUDED.metadata,
        updated_at = NOW()
    `,
    [
      loggedUser?.name || null,
      loggedUser?.email,
      loggedUser?.image || null,
      loggedUser?.userId || null,
      JSON.stringify(loggedUser?.metadata || {}),
    ]
  );

  return mongoStyleWriteResult(result);
};

export const updateUserActivityInDb = async (updateInfo) => {
  const db = await DbConnect();

  if (updateInfo?.clearCart) {
    const result = await db.query(
      `
        UPDATE users
        SET cart_item = '[]'::jsonb, updated_at = NOW()
        WHERE email = $1
      `,
      [updateInfo?.email]
    );

    return mongoStyleWriteResult(result);
  }

  if (updateInfo?.removeCartItem) {
    const result = await db.query(
      `
        UPDATE users
        SET
          cart_item = (
            SELECT COALESCE(jsonb_agg(item), '[]'::jsonb)
            FROM jsonb_array_elements(COALESCE(cart_item, '[]'::jsonb)) AS item
            WHERE item->>'id' IS DISTINCT FROM $2
          ),
          updated_at = NOW()
        WHERE email = $1
      `,
      [updateInfo?.email, updateInfo?.removeCartItem]
    );

    return mongoStyleWriteResult(result);
  }

  if (updateInfo?.updateCartItemQuantity) {
    const quantity = Math.max(Number(updateInfo?.quantity || 1), 1);
    const result = await db.query(
      `
        UPDATE users
        SET
          cart_item = (
            SELECT COALESCE(
              jsonb_agg(
                CASE
                  WHEN item->>'id' = $2
                    THEN jsonb_set(item, '{quantity}', to_jsonb($3::int), true)
                  ELSE item
                END
              ),
              '[]'::jsonb
            )
            FROM jsonb_array_elements(COALESCE(cart_item, '[]'::jsonb)) AS item
          ),
          updated_at = NOW()
        WHERE email = $1
      `,
      [updateInfo?.email, updateInfo?.updateCartItemQuantity, quantity]
    );

    return mongoStyleWriteResult(result);
  }

  if (updateInfo?.cartItem && updateInfo?.payments) {
    const result = await db.query(
      `
        UPDATE users
        SET
          cart_item = (
            SELECT COALESCE(jsonb_agg(item), '[]'::jsonb)
            FROM jsonb_array_elements(COALESCE(cart_item, '[]'::jsonb)) AS item
            WHERE item->>'id' IS DISTINCT FROM $2
          ),
          payments = COALESCE(payments, '[]'::jsonb) || $3::jsonb,
          updated_at = NOW()
        WHERE email = $1
      `,
      [
        updateInfo?.email,
        updateInfo?.cartItem?.id,
        JSON.stringify([updateInfo?.payments]),
      ]
    );

    return mongoStyleWriteResult(result);
  }

  if (updateInfo?.cartItem) {
    const cartItem = {
      ...updateInfo.cartItem,
      quantity: Number(updateInfo?.cartItem?.quantity || 1),
    };
    const result = await db.query(
      `
        UPDATE users
        SET
          cart_item = CASE
            WHEN EXISTS (
              SELECT 1
              FROM jsonb_array_elements(COALESCE(cart_item, '[]'::jsonb)) AS item
              WHERE item->>'id' = $2
            )
              THEN (
                SELECT COALESCE(
                  jsonb_agg(
                    CASE
                      WHEN item->>'id' = $2
                        THEN jsonb_set(
                          item,
                          '{quantity}',
                          to_jsonb((COALESCE((item->>'quantity')::int, 1) + $3)::int),
                          true
                        )
                      ELSE item
                    END
                  ),
                  '[]'::jsonb
                )
                FROM jsonb_array_elements(COALESCE(cart_item, '[]'::jsonb)) AS item
              )
            ELSE COALESCE(cart_item, '[]'::jsonb) || $4::jsonb
          END,
          updated_at = NOW()
        WHERE email = $1
      `,
      [
        updateInfo?.email,
        cartItem.id,
        cartItem.quantity,
        JSON.stringify([cartItem]),
      ]
    );

    return mongoStyleWriteResult(result);
  }

  return { acknowledged: false, matchedCount: 0, modifiedCount: 0 };
};
