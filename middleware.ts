import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const ALLOWED_ROLES = ["FLOORSTAFF", "TEAMLEADER", "MANAGER"]

export async function middleware(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: process.env.NODE_ENV === "production",
        cookieName: process.env.NODE_ENV === "production"
            ? "__Secure-next-auth.session-token"
            : "next-auth.session-token",
    })

    console.log("=== Middleware Debug ===")
    console.log("Path:", req.nextUrl.pathname)
    console.log("Has Token:", !!token)
    if (token) console.log("Role:", (token as any)?.role || (token as any)?.user?.role)

    const pathname = req.nextUrl.pathname

    if (pathname.startsWith("/manage") || pathname.startsWith("/manager")) {
        if (!token) {
            console.log("No token → Redirect to login")
            return NextResponse.redirect(new URL("/auth/login", req.url))
        }

        const role = (token as any)?.role || (token as any)?.user?.role

        if (!role || !ALLOWED_ROLES.includes(role)) {
            console.log("Role not allowed")
            return NextResponse.redirect(new URL("/", req.url))
        }

        console.log("✅ Access Granted to", pathname)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/manage/:path*", "/manager/:path*"],
}