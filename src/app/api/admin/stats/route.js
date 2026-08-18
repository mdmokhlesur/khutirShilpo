import { getOrdersFromDb } from "@/server/ordersCollection";
import { getAllProductsForAdmin } from "@/server/productsCollection";
import DbConnect from "@/server/DbConnect";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (request) => {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const [products, orders, totalUsers] = await Promise.all([
    getAllProductsForAdmin(),
    getOrdersFromDb({ email, isAdmin: true }),
    DbConnect.user.count(),
  ]);

  const totalSales = orders.reduce(
    (sum, order) => sum + Number(order?.total || 0),
    0
  );
  const bestProducts = products
    .filter((product) => Number(product?.sells || 0) > 0)
    .sort((a, b) => Number(b?.sells || 0) - Number(a?.sells || 0))
    .slice(0, 5);

  return NextResponse.json({
    totalSales,
    totalOrders: orders.length,
    totalProducts: products.length,
    totalUsers,
    products,
    bestProducts,
  });
};
