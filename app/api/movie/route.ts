import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Movie from "@/models/Movie";
import "@/models/User";

const MONGODB_URI = process.env.MONGODB_URI as string;

async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(MONGODB_URI);
}

export async function GET() {
    try {
        await connectDB();

        const movies = await Movie.find({})
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ movies }, { status: 200 });
    } catch (error) {
        console.error("[GET MOVIES ERROR]", error);
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}