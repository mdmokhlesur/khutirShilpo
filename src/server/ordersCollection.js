import "server-only";
import DbConnect from "./DbConnect";

const mapOrder = (order) => {
  if (!order) return null;

  return {
    _id: Number(order.id),
    email: order.email,
    customerName: order.customerName,
    items: order.items || [],
    total: Number(order.total || 0),
    paymentMethod: order.paymentMethod,
    status: order.status,
    refundRequested: order.refundRequested,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};

export const getOrdersFromDb = async ({ email, isAdmin = false }) => {
  if (!isAdmin && !email) return [];

  const orders = await DbConnect.order.findMany({
    where: isAdmin ? undefined : { email },
    orderBy: { createdAt: "desc" },
  });

  return orders.map(mapOrder);
};

export const addOrderInDb = async (order) => {
  if (!order?.email) return null;

  const items = order?.items || [];
  const total = items.reduce(
    (sum, item) => sum + Number(item?.price || 0) * Number(item?.quantity || 1),
    0
  );
  const createdOrder = await DbConnect.order.create({
    data: {
      email: order?.email,
      customerName: order?.customerName || null,
      items,
      total,
      paymentMethod: order?.paymentMethod || null,
      status: order?.status || "payment unsupported",
    },
  });

  return mapOrder(createdOrder);
};

export const updateOrderInDb = async ({ id, status, refundRequested }) => {
  if (!id) return null;

  const data = {};

  if (status) data.status = status;
  if (refundRequested !== undefined) data.refundRequested = refundRequested;

  try {
    const updatedOrder = await DbConnect.order.update({
      where: { id: BigInt(id) },
      data,
    });

    return mapOrder(updatedOrder);
  } catch (error) {
    if (error?.code === "P2025") return null;
    throw error;
  }
};
