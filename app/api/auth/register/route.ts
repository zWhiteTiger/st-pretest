import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "@/models/User";

const MONGODB_URI = process.env.MONGODB_URI as string;

async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(MONGODB_URI);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, password, role } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Name, email, and password are required." },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Invalid email format." },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { message: "Password must be at least 8 characters." },
                { status: 400 }
            );
        }

        const validRoles = ["FLOORSTAFF", "TEAMLEADER", "MANAGER"];
        if (role && !validRoles.includes(role)) {
            return NextResponse.json(
                { message: `Role must be one of: ${validRoles.join(", ")}.` },
                { status: 400 }
            );
        }

        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "An account with this email already exists." },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            ...(role && { role }),
        });

        const { password: _pw, ...userWithoutPassword } = newUser.toObject();

        return NextResponse.json(
            {
                message: "User registered successfully.",
                user: userWithoutPassword,
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error("[REGISTER ERROR]", error);

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as { code: number }).code === 11000
        ) {
            return NextResponse.json(
                { message: "An account with this email already exists." },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}