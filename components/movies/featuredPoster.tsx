import React, { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import Image from 'next/image'
import { RiStarFill, RiArrowDownSLine } from '@remixicon/react'
import { Button } from '../ui/button'

type Movie = {
    id: number
    title: string
    description: string
    posterUrl: string
    genres: string[]
    rating: { code: string }[]
    movieRelease: Date
}

type Props = {
    movies: Movie[]
}

const INITIAL_SHOW = 6

function MovieCard({ movie }: { movie: Movie }) {
    return (
        <Card className="flex flex-row w-full h-[180px] overflow-hidden p-3 gap-3">
            <div className="relative w-[100px] min-w-[100px] h-full shrink-0">
                <Image
                    src={movie.posterUrl}
                    alt={`${movie.title} poster`}
                    fill
                    className="object-cover rounded-md"
                />
            </div>

            <CardContent className="flex flex-col gap-2 flex-1 min-w-0 p-0 justify-center">
                <div className="flex flex-wrap gap-1">
                    {movie.genres.slice(0, 2).map((genre) => (
                        <span
                            key={genre}
                            className="text-xs px-2 py-0.5 rounded-full border border-border
                                       bg-secondary text-secondary-foreground"
                        >
                            {genre}
                        </span>
                    ))}
                </div>

                <div>
                    <h3 className="text-sm font-semibold leading-tight line-clamp-1">
                        {movie.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {movie.movieRelease && new Date(movie.movieRelease).getFullYear()}
                    </p>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {movie.description}
                </p>
            </CardContent>
        </Card>
    )
}

export default function MoviesByGenre({ movies }: Props) {
    const grouped = movies.reduce<Record<string, Movie[]>>((acc, movie) => {
        const genre = movie.genres[0] ?? "Other"
        if (!acc[genre]) acc[genre] = []
        acc[genre].push(movie)
        return acc
    }, {})

    return (
        <div className="flex flex-col gap-10 w-full">
            {Object.entries(grouped).map(([genre, list]) => (
                <GenreSection key={genre} genre={genre} movies={list} />
            ))}
        </div>
    )
}

function GenreSection({ genre, movies }: { genre: string; movies: Movie[] }) {
    const [showAll, setShowAll] = useState(false)

    const visible = showAll ? movies : movies.slice(0, INITIAL_SHOW)
    const remaining = movies.length - INITIAL_SHOW

    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold">{genre}</h2>
                    <span className="text-xs text-muted-foreground bg-secondary
                                     px-2 py-0.5 rounded-full border border-border">
                        {movies.length} titles
                    </span>
                </div>
                {movies.length > INITIAL_SHOW && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground gap-1"
                        onClick={() => setShowAll((prev) => !prev)}
                    >
                        {showAll ? (
                            "Show less"
                        ) : (
                            <>
                                Show {remaining} more
                                <RiArrowDownSLine size={14} />
                            </>
                        )}
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {visible.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>

            {!showAll && movies.length > INITIAL_SHOW && (
                <button
                    onClick={() => setShowAll(true)}
                    className="text-xs text-muted-foreground hover:text-foreground
                               transition-colors text-center py-2 border border-dashed
                               border-border rounded-lg"
                >
                    + {remaining} more in {genre}
                </button>
            )}
        </section>
    )
}