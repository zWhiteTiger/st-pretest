import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import Movie from "@/models/Movie";

const MONGODB_URI = process.env.MONGODB_URI as string;

async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(MONGODB_URI);
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authConfig);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
        }

        const body = await req.json();
        // ✅ เพิ่ม movieRelease
        const { title, movieDescription, posterUrl, bannerUrl, tags, rating, movieRelease } = body;

        if (!title || !movieDescription || !posterUrl) {
            return NextResponse.json(
                { message: "title, movieDescription, and posterUrl are required." },
                { status: 400 }
            );
        }

        const validRatingCodes = ["G", "PG", "M", "MA", "R"];
        if (rating && Array.isArray(rating)) {
            for (const r of rating) {
                if (!validRatingCodes.includes(r.code)) {
                    return NextResponse.json(
                        { message: `Invalid rating code "${r.code}". Must be one of: ${validRatingCodes.join(", ")}.` },
                        { status: 400 }
                    );
                }
            }
        }

        await connectDB();

        let slug = generateSlug(title);
        const existing = await Movie.findOne({ slug });
        if (existing) slug = `${slug}-${Date.now()}`;

        const movie = await Movie.create({
            title,
            slug,
            movieDescription,
            posterUrl,
            ...(bannerUrl && { bannerUrl }),
            // ✅ ส่ง movieRelease ถ้ามี
            ...(movieRelease && { movieRelease: new Date(movieRelease) }),
            tags: tags ?? [],
            rating: rating ?? [],
            createdBy: session.user.id,
        });

        return NextResponse.json(
            { message: "Movie created successfully.", movie },
            { status: 201 }
        );
    } catch (error) {
        console.error("[CREATE MOVIE ERROR]", error);
        return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
}