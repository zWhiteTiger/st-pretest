import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";

const MONGODB_URI = process.env.MONGODB_URI as string;

async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(MONGODB_URI);
}

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authConfig);

        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized." },
                { status: 401 }
            );
        }

        await connectDB();

        const users = await User.find({}).select("-password").lean();

        return NextResponse.json(
            { users },
            { status: 200 }
        );
    } catch (error) {
        console.error("[GET USERS ERROR]", error);
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}