"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";import axios from "axios";
type Props = {};

export default function RegisterPage({ }: Props) {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [dialog, setDialog] = useState({
        open: false,
        title: "",
        description: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const openDialog = (title: string, description: string) => {
        setDialog({ open: true, title, description });
    };

    const handleDialogClose = () => {
        setDialog({ ...dialog, open: false });
        if (isSuccess) {
            router.push("/auth/login");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            openDialog("Password Error", "Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post("/api/auth/register", {
                name: form.name,
                email: form.email,
                password: form.password,
            });

            setIsSuccess(true);

            openDialog(
                "Register Success",
                response.data.message || "Your account has been created successfully"
            );
        } catch (error) {
            if (axios.isAxiosError(error)) {
                openDialog(
                    "Register Failed",
                    error.response?.data?.message || "Something went wrong"
                );
            } else {
                openDialog("Register Failed", "Unexpected error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex min-h-screen items-center justify-center px-4">
                <Card className="w-full ring-0 max-w-md border border-2 border-dashed shadow-none bg-transparent">
                    <CardHeader className="space-y-2 text-center">
                        <CardTitle className="text-2xl font-bold">
                            Register
                        </CardTitle>

                        <p className="text-sm text-muted-foreground">
                            Create your account
                        </p>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={form.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="example@gmail.com"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Password</label>
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Confirm Password</label>
                                <Input
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Loading..." : "Register"}
                            </Button>

                            <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link
                                    href="/auth/login"
                                    className="font-medium text-primary hover:underline"
                                >
                                    Login
                                </Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <Dialog
                open={dialog.open}
                onOpenChange={(open) => {
                    if (!open) handleDialogClose();
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{dialog.title}</DialogTitle>
                        <DialogDescription>{dialog.description}</DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button onClick={handleDialogClose}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}