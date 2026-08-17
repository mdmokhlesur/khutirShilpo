import {
    getProductById,
    setProductActiveInDb,
    updateProductInDb,
} from "@/server/productsCollection";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET=async(request)=>{
    const {searchParams} = new URL(request.url);
    const id =searchParams.get('id');
    const result = await getProductById(id);
    return NextResponse.json(result);
}

export const PATCH = async (request) => {
    const body = await request.json();

    if (body?.adminEmail !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const result = await updateProductInDb(body?.id, body);
    return NextResponse.json(result);
}

export const DELETE = async (request) => {
    const {searchParams} = new URL(request.url);
    const id = searchParams.get('id');
    const adminEmail = searchParams.get('adminEmail');

    if (adminEmail !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const result = await setProductActiveInDb(id, false);
    return NextResponse.json(result);
}
