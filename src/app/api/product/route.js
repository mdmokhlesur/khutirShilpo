import { getProductById } from "@/server/productsCollection";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET=async(request)=>{
    const {searchParams} = new URL(request.url);
    const id =searchParams.get('id');
    const result = await getProductById(id);
    return NextResponse.json(result);
}
