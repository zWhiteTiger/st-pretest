import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const ALLOWED_ROLES = ["FLOORSTAFF", "TEAMLEADER", "MANAGER"]

export async function middleware(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    })

    console.log("=== Middleware Debug ===")
    console.log("Path:", req.nextUrl.pathname)
    console.log("Token exists:", !!token)
    console.log("Full Token:", JSON.stringify(token, null, 2))   // ← ดูอันนี้สำคัญ

    const pathname = req.nextUrl.pathname

    if (pathname.startsWith("/manage")) {
        if (!token) {
            console.log("No token → Redirect to login")
            return NextResponse.redirect(new URL("/auth/login", req.url))
        }

        // วิธีหา role แบบครอบคลุม
        const userRole =
            (token as any)?.role ||
            (token as any)?.user?.role ||
            (token as any)?.user?.user?.role;

        console.log("Extracted Role:", userRole)

        if (!userRole || !ALLOWED_ROLES.includes(userRole)) {
            console.log("Role not allowed → Redirect to /")
            return NextResponse.redirect(new URL("/", req.url))
        }

        console.log("✅ Access Granted")
    }

    return NextResponse.next()
}