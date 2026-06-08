// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ALLOWED_ROLES = [
    "FLOORSTAFF",
    "TEAMLEADER",
    "MANAGER",
];

export async function middleware(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });


    if (!token) {
        return NextResponse.redirect(
            new URL("/auth/login", req.url)
        );
    }

    const role = token.role as string;

    console.log(
        req.cookies.get(role)
    )

    if (!ALLOWED_ROLES.includes(role)) {
        return NextResponse.redirect(
            new URL("/", req.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/manage/:path*"],
};