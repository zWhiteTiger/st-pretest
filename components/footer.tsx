import React from 'react'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="w-full border-t border-border mt-auto">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
                    <div className="flex flex-col gap-3 sm:col-span-1">
                        <span className="text-lg font-bold">Cinema</span>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Discover and explore the best movies from around the world.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-medium">Explore</p>
                        <div className="flex flex-col gap-2">
                            {[
                                { label: "Home", href: "/" },
                                { label: "Movies", href: "/movies" },
                                { label: "Top Rated", href: "/top-rated" },
                                { label: "Upcoming", href: "/upcoming" },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-medium">Genres</p>
                        <div className="flex flex-col gap-2">
                            {["Action", "Drama", "Sci-Fi", "Thriller"].map((genre) => (
                                <Link
                                    key={genre}
                                    href={`/genre/${genre.toLowerCase()}`}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {genre}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-medium">Company</p>
                        <div className="flex flex-col gap-2">
                            {[
                                { label: "About", href: "/about" },
                                { label: "Contact", href: "/contact" },
                                { label: "Privacy", href: "/privacy" },
                                { label: "Terms", href: "/terms" },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between
                                gap-3 mt-12 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Cinema. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        {[
                            { label: "Privacy Policy", href: "/privacy" },
                            { label: "Terms of Service", href: "/terms" },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}