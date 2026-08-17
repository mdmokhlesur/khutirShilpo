import { addProductInDb, getProductFromDb } from "@/server/productsCollection";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (request) => {
const result = await getProductFromDb();
return NextResponse.json(result);
};

export const POST = async (request) => {
  const body = await request.json();

  if (body?.adminEmail !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const result = await addProductInDb(body);
  return NextResponse.json(result);
};
