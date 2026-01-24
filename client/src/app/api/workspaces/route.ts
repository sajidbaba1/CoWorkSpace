import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Workspace from "@/models/Workspace";

export async function GET() {
    try {
        await dbConnect();
        const workspaces = await Workspace.find({}).limit(10);
        return NextResponse.json({ success: true, data: workspaces });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const workspace = await Workspace.create(body);
        return NextResponse.json({ success: true, data: workspace }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
