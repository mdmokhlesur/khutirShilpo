import "server-only";
import DbConnect from "./DbConnect";

const mapUser = (user) => {
  if (!user) return null;

  return {
    _id: Number(user.id),
    name: user.name,
    email: user.email,
    image: user.image,
    userId: user.userId,
    metadata: user.metadata || {},
    cartItem: user.cartItem || [],
    payments: user.payments || [],
    role: user.email === process.env.ADMIN_EMAIL ? "admin" : "user",
  };
};

const mongoStyleWriteResult = (count = 1) => ({
  acknowledged: true,
  matchedCount: count,
  modifiedCount: count,
  upsertedCount: count,
});

// get user from db
export const getUserFromDb = async (email) => {
  if (!email) return null;

  const user = await DbConnect.user.findUnique({
    where: { email },
  });

  return mapUser(user);
};
export const addUserInDb = async (loggedUser) => {
  if (!loggedUser?.email) return mongoStyleWriteResult(0);

  await DbConnect.user.upsert({
    where: { email: loggedUser?.email },
    update: {
      name: loggedUser?.name || null,
      image: loggedUser?.image || null,
      userId: loggedUser?.userId || null,
      metadata: loggedUser?.metadata || {},
    },
    create: {
      name: loggedUser?.name || null,
      email: loggedUser?.email,
      image: loggedUser?.image || null,
      userId: loggedUser?.userId || null,
      metadata: loggedUser?.metadata || {},
    },
  });

  return mongoStyleWriteResult();
};

export const updateUserActivityInDb = async (updateInfo) => {
  if (!updateInfo?.email) {
    return { acknowledged: false, matchedCount: 0, modifiedCount: 0 };
  }

  const updateUserCart = async (cartItemUpdater, extraData = {}) => {
    const user = await DbConnect.user.findUnique({
      where: { email: updateInfo?.email },
      select: { cartItem: true },
    });

    if (!user) return mongoStyleWriteResult(0);

    const cartItems = Array.isArray(user.cartItem) ? user.cartItem : [];
    await DbConnect.user.update({
      where: { email: updateInfo?.email },
      data: {
        cartItem: cartItemUpdater(cartItems),
        ...extraData,
      },
    });

    return mongoStyleWriteResult();
  };

  if (updateInfo?.clearCart) {
    const result = await DbConnect.user.updateMany({
      where: { email: updateInfo?.email },
      data: { cartItem: [] },
    });

    return mongoStyleWriteResult(result.count);
  }

  if (updateInfo?.removeCartItem) {
    return updateUserCart((cartItems) =>
      cartItems.filter((cartItem) => cartItem?.id !== updateInfo.removeCartItem)
    );
  }

  if (updateInfo?.updateCartItemQuantity) {
    const quantity = Math.max(Number(updateInfo?.quantity || 1), 1);
    return updateUserCart((cartItems) =>
      cartItems.map((cartItem) =>
        cartItem?.id === updateInfo.updateCartItemQuantity
          ? { ...cartItem, quantity }
          : cartItem
      )
    );
  }

  if (updateInfo?.cartItem && updateInfo?.payments) {
    const user = await DbConnect.user.findUnique({
      where: { email: updateInfo?.email },
      select: { cartItem: true, payments: true },
    });

    if (!user) return mongoStyleWriteResult(0);

    const cartItems = Array.isArray(user.cartItem) ? user.cartItem : [];
    const payments = Array.isArray(user.payments) ? user.payments : [];
    await DbConnect.user.update({
      where: { email: updateInfo?.email },
      data: {
        cartItem: cartItems.filter(
          (cartItem) => cartItem?.id !== updateInfo.cartItem.id
        ),
        payments: [...payments, updateInfo.payments],
      },
    });

    return mongoStyleWriteResult();
  }

  if (updateInfo?.cartItem) {
    const cartItem = {
      ...updateInfo.cartItem,
      quantity: Number(updateInfo?.cartItem?.quantity || 1),
    };

    return updateUserCart((cartItems) => {
      const existingItem = cartItems.find((item) => item?.id === cartItem.id);

      if (!existingItem) return [...cartItems, cartItem];

      return cartItems.map((item) =>
        item?.id === cartItem.id
          ? {
              ...item,
              quantity: Number(item?.quantity || 1) + cartItem.quantity,
            }
          : item
      );
    });
  }

  return { acknowledged: false, matchedCount: 0, modifiedCount: 0 };
};
