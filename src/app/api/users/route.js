import { addUserInDb, getUserFromDb, updateUserActivityInDb } from "@/server/usersCollection";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET=async(request)=>{
    const {searchParams}=new URL(request.url);
    const email = searchParams.get("email");
    const result = await getUserFromDb(email);
    return NextResponse.json(result);
}
export const PUT=async(request)=>{
    const body = await request.json();
    const result = await addUserInDb(body);
    return NextResponse.json({
        ...result,
        role: body?.email === process.env.ADMIN_EMAIL ? "admin" : "user",
    });
}

export const PATCH=async(request)=>{
    const body=await request.json();
    const result = await updateUserActivityInDb(body);
    return NextResponse.json(result);
}
