"use client";

import Image from 'next/image'
import { Button } from '../ui/button'
import { RiStarFill } from '@remixicon/react'
import { useState, useMemo } from 'react'
import { Badge } from '../ui/badge';
import { DetailsDialog } from './detailDialog';

type Movie = {
    id: number
    title: string
    posterUrl: string
    rating: { code: string }[]
    genres: string[]
    movieRelease: Date
    description: string
    slug: string
}

type Props = {
    movies: Movie[]
    onOpen?: (movie: Movie) => void
}

const FEATURED_COUNT = 6

const ratingColors: Record<string, string> = {
    G: "text-green-700 border-green-200",
    PG: "text-sky-700 border-sky-200",
    M: "text-amber-700 border-amber-200",
    MA: "text-orange-700 border-orange-200",
    R: "text-rose-700 border-rose-200",
};


function MovieCard({ movie, onOpen }: { movie: Movie; onOpen?: (movie: Movie) => void }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden group">
                <Image
                    src={movie.posterUrl}
                    alt={`${movie.title} poster`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {movie.rating.length > 0 && (
                    <div className="absolute top-2 right-2 flex gap-1">
                        {movie.rating.map((r) => (
                            <Badge
                                key={r.code}
                                variant="default"
                                className={`text-xs font-bold ${ratingColors[r.code] ?? ""}`}
                            >
                                {r.code}
                            </Badge>
                        ))}
                    </div>
                )}
                <div
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3"
                >
                    <div className="w-full">
                        <DetailsDialog
                            id={movie.id}
                            title={movie.title}
                            slug={movie.slug}
                            description={movie.description}
                            posterUrl={movie.posterUrl}
                            rating={movie.rating}
                            genres={movie.genres}
                            movieRelease={movie.movieRelease} />
                    </div>
                </div>
            </div>

            <p className="text-sm font-medium leading-tight line-clamp-1 flex justify-between">
                {movie.title}
                <Badge variant={"outline"}>{movie.movieRelease && new Date(movie.movieRelease).getFullYear()}</Badge>
            </p>
        </div>
    )
}

export default function ListMovies({ movies, onOpen }: Props) {
    const genres = useMemo(() => {
        const all = movies.flatMap((m) => m.genres)
        return ["All", ...Array.from(new Set(all))]
    }, [movies])

    const [activeGenre, setActiveGenre] = useState("All")

    const filtered = useMemo(() => {
        const list =
            activeGenre === "All"
                ? movies
                : movies.filter((m) => m.genres.includes(activeGenre))
        return list.slice(0, FEATURED_COUNT)
    }, [movies, activeGenre])

    return (
        <div className="flex flex-col gap-6 w-full">

            <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                    <button
                        key={genre}
                        onClick={() => setActiveGenre(genre)}
                        className={`
                            px-4 py-1.5 rounded-full text-sm border transition-colors
                            ${activeGenre === genre
                                ? "bg-foreground text-background border-foreground"
                                : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                            }
                        `}
                    >
                        {genre}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {filtered.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} onOpen={onOpen} />
                ))}
            </div>

        </div>
    )
}