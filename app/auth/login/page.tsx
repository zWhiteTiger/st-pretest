"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password.");
                return;
            }

            if (result?.ok) {
                router.push("/manage");
                router.refresh();
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <Card className="w-full ring-0 max-w-md border border-2 border-dashed shadow-none bg-transparent">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-2xl font-bold">
                        Login
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Enter your email and password to continue
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4 p-5">

                        {error && (
                            <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="example@gmail.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError(null);
                                }}
                                disabled={loading}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError(null);
                                }}
                                disabled={loading}
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Signing in…" : "Login"}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/auth/register"
                                className="font-medium text-primary hover:underline"
                            >
                                Register
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}