import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "@/models/User";

const MONGODB_URI = process.env.MONGODB_URI as string;

async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(MONGODB_URI);
}

export const authConfig: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials as {
                    email: string;
                    password: string;
                };

                if (!email || !password) {
                    throw new Error("Email and password are required.");
                }

                await connectDB();

                const user = await User.findOne({ email }).lean();

                if (!user) {
                    throw new Error("No account found with this email.");
                }

                const isPasswordValid = await bcrypt.compare(
                    password,
                    user.password as string
                );

                if (!isPasswordValid) {
                    throw new Error("Incorrect password.");
                }

                return {
                    id: user._id.toString(),
                    name: user.name as string,
                    email: user.email as string,
                    role: user.role as string,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as { role: string }).role;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },

    pages: {
        signIn: "/login",
    },

    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 7,
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };