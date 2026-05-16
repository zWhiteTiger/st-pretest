import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import Movie from "@/models/Movie";
import "@/models/User";

const MONGODB_URI = process.env.MONGODB_URI as string;

async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(MONGODB_URI);
}

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
    try {
        const { slug } = await params;
        await connectDB();
        const movie = await Movie.findOne({ slug });
        if (!movie) {
            return NextResponse.json({ message: "Movie not found." }, { status: 404 });
        }
        return NextResponse.json({ movie }, { status: 200 });
    } catch (error) {
        console.error("[GET MOVIE ERROR]", error);
        return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const session = await getServerSession(authConfig);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
        }

        const { slug } = await params;
        const body = await req.json();
        const { title, movieDescription, posterUrl, bannerUrl, tags, rating, movieRelease } = body;

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

        const updateData: Record<string, unknown> = {};
        if (title !== undefined) updateData.title = title;
        if (movieDescription !== undefined) updateData.movieDescription = movieDescription;
        if (posterUrl !== undefined) updateData.posterUrl = posterUrl;
        if (bannerUrl !== undefined) updateData.bannerUrl = bannerUrl;
        if (tags !== undefined) updateData.tags = tags;
        if (rating !== undefined) updateData.rating = rating;
        // ✅ แก้จาก updateData.releaseDate → updateData.movieRelease
        if (movieRelease !== undefined) updateData.movieRelease = new Date(movieRelease);

        const movie = await Movie.findOneAndUpdate(
            { slug },
            { $set: updateData },
            { returnDocument: 'after', runValidators: true }
        );

        if (!movie) {
            return NextResponse.json({ message: "Movie not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Movie updated successfully.", movie }, { status: 200 });
    } catch (error) {
        console.error("[PATCH MOVIE ERROR]", error);
        return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        const session = await getServerSession(authConfig);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
        }

        const { slug } = await params;
        await connectDB();
        const movie = await Movie.findOneAndDelete({ slug });

        if (!movie) {
            return NextResponse.json({ message: "Movie not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Movie deleted successfully." }, { status: 200 });
    } catch (error) {
        console.error("[DELETE MOVIE ERROR]", error);
        return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
}