import {dbConnect} from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();
        return NextResponse.json({ message: "MongoDB is connected" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "MongoDB is not connected" }, { status: 500 });
    }
}