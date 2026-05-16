"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiBallPenLine } from "@remixicon/react";
import { useSession } from "next-auth/react";

type User = {
    _id: string;
    name: string;
    email: string;
    role: "FLOORSTAFF" | "TEAMLEADER" | "MANAGER" | "GUEST";
    createdAt: string;
};

const roleConfig = {
    GUEST: {
        label: "Guest",
        className: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
    },
    MANAGER: {
        label: "Manager",
        className: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100",
    },
    TEAMLEADER: {
        label: "Team Leader",
        className: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",
    },
    FLOORSTAFF: {
        label: "Floor Staff",
        className: "bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-100",
    },
};

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function AvatarPlaceholder({ name }: { name: string }) {
    const colors = [
        "bg-violet-100 text-violet-600",
        "bg-teal-100 text-teal-600",
        "bg-orange-100 text-orange-600",
        "bg-pink-100 text-pink-600",
        "bg-indigo-100 text-indigo-600",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return (
        <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${colors[index]}`}
        >
            {getInitials(name)}
        </div>
    );
}

export default function UsersSection() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/users");
                const data = await res.json();

                if (!res.ok) throw new Error(data.message || "Failed to fetch users.");

                setUsers(data.users);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold">Users</h2>
                <p className="text-sm text-muted-foreground">you're {session?.user?.name}</p>
            </div>

            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-24 rounded-xl bg-muted animate-pulse"
                        />
                    ))}
                </div>
            )}

            {error && (
                <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            {!loading && !error && users.length === 0 && (
                <p className="text-sm text-muted-foreground">No users found.</p>
            )}

            {!loading && !error && users.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {users.map((user) => {
                        const role = roleConfig[user.role] ?? roleConfig.FLOORSTAFF;
                        return (
                            <Card
                                key={user._id}
                                className="shadow-none ring-0 w-full border border-dashed hover:border-solid hover:shadow-sm transition-all duration-200"
                            >
                                <CardContent className="flex w-full items-center gap-4">
                                    <AvatarPlaceholder name={user.name} />
                                    <div className="flex flex-row w-full gap-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold truncate">
                                                {user.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground truncate">
                                                {user.email}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold truncate">
                                                Role
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs w-fit mt-0.5 ${role.className}`}
                                            >
                                                {role.label}
                                            </Badge>
                                        </div>

                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}