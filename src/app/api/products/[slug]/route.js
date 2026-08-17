import { getProductByCategory } from "@/server/productsCollection";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (request) => {
  const url = request.url;
  const category=url.split('/').slice(-1)[0];
  const result = await getProductByCategory(category);
  return NextResponse.json(result)
};
