import {
  addOrderInDb,
  getOrdersFromDb,
  updateOrderInDb,
} from "@/server/ordersCollection";
import { updateUserActivityInDb } from "@/server/usersCollection";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (request) => {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const isAdmin = email === process.env.ADMIN_EMAIL;
  const result = await getOrdersFromDb({ email, isAdmin });

  return NextResponse.json(result);
};

export const POST = async (request) => {
  const body = await request.json();
  const result = await addOrderInDb(body);

  if (body?.clearCart) {
    await updateUserActivityInDb({ email: body?.email, clearCart: true });
  }

  return NextResponse.json(result);
};

export const PATCH = async (request) => {
  const body = await request.json();

  if (body?.adminEmail && body?.adminEmail !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const result = await updateOrderInDb(body);
  return NextResponse.json(result);
};
