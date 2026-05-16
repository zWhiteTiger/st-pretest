"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

const STAFF_ROLES = [
    "FLOORSTAFF",
    "TEAMLEADER",
    "MANAGER",
];

export default function Appbar() {

    const [scrolled, setScrolled] = useState(false);

    const { data: session, status } = useSession();

    const role = session?.user?.role;

    const isStaff = STAFF_ROLES.includes(role as string);

    useEffect(() => {

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };

    }, []);

    return (
        <div className="fixed top-0 left-0 z-50 w-full">

            <motion.div
                initial={false}
                animate={{
                    paddingTop: scrolled ? 12 : 0,
                    paddingLeft: scrolled ? 16 : 0,
                    paddingRight: scrolled ? 16 : 0,
                }}
                transition={{
                    duration: 0.35,
                    ease: [0.4, 0, 0.2, 1],
                }}
            >

                <div
                    className={`mx-auto flex h-14 items-center justify-between px-6
                        ${scrolled
                            ? "ring-1 ring-current/10 shadow-sm backdrop-blur-xl bg-background/70"
                            : "ring-0 bg-transparent"
                        }
                    `}
                    style={{
                        maxWidth: scrolled ? "960px" : "100%",
                        borderRadius: scrolled ? 9999 : 0,
                        transition: [
                            "max-width 0.35s cubic-bezier(0.4,0,0.2,1)",
                            "border-radius 0.35s cubic-bezier(0.4,0,0.2,1)",
                            "background-color 0.35s cubic-bezier(0.4,0,0.2,1)",
                            "border-color 0.35s cubic-bezier(0.4,0,0.2,1)",
                            "box-shadow 0.35s cubic-bezier(0.4,0,0.2,1)",
                        ].join(", "),
                    }}>
                    <Link
                        href="/"
                        className="text-base font-semibold tracking-tight">
                        Cinema
                    </Link>
                    <nav className="flex items-center gap-3 text-sm">
                        <Link href="/movies">
                            <Button
                                size="lg"
                                variant="ghost"
                            >
                                Movies
                            </Button>
                        </Link>
                        {status === "loading" ? null : session ? (
                            <div className="flex items-center gap-2">

                                {isStaff && (
                                    <Link href="/manage">
                                        <Button
                                            size="lg"
                                            variant="ghost"
                                        >
                                            Dashboard
                                        </Button>
                                    </Link>
                                )}
                                <Button
                                    size="lg"
                                    variant="destructive"
                                    onClick={() =>
                                        signOut({
                                            callbackUrl: "/",
                                        })
                                    }
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Link href="/auth">
                                <Button size="lg"
                                    variant="default">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </nav>
                </div>
            </motion.div>
        </div>
    );
}