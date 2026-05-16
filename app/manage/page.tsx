"use client"

import React, { useState } from 'react'
import { RiUserLine, RiMovieLine } from '@remixicon/react'
import { Card, CardContent } from '@/components/ui/card'
import UsersSection from './users/UserSelection'
import MoviesSection from './movie/MovieSelection'

type Section = "users" | "movies"

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
    {
        id: "users",
        label: "Users",
        icon: <RiUserLine size={18} />,
    },
    {
        id: "movies",
        label: "Moives",
        icon: <RiMovieLine size={18} />,
    },
]

const SECTION_MAP: Record<Section, React.ReactNode> = {
    users: <UsersSection />,
    movies: <MoviesSection />,
}

export default function ManagePage() {
    const [active, setActive] = useState<Section>("users")

    return (
        <div className="flex mt-15 mx-auto container flex-col md:flex-row min-h-[calc(100vh-5rem)] gap-0 p-5">

            <Card>
                <CardContent>
                    <aside className="w-64 min-w-64 flex flex-col gap-1 p-3">
                        <p className="text-xs font-medium text-muted-foreground px-3 py-2 uppercase tracking-wider">
                            Management
                        </p>

                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActive(item.id)}
                                className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-md text-sm
                            transition-colors w-full text-left
                            ${active === item.id
                                        ? "bg-secondary text-foreground font-medium"
                                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                                    }
                        `}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </aside>
                </CardContent>
            </Card>

            <main className="flex-1 p-8">
                {SECTION_MAP[active]}
            </main>

        </div>
    )
}