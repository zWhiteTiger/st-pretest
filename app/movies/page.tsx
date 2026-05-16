"use client"

import { useEffect, useState } from 'react'
import FeaturedPoster from '@/components/movies/featuredPoster'
import ListMovies from '@/components/movies/listMovies'
import MovieHero from '@/components/movies/movieHero'

type ApiMovie = {
    _id: string
    title: string
    movieDescription: string
    posterUrl: string
    slug: string
    bannerUrl?: string
    tags: string[]
    rating: { code: string }[]
    createdAt: string
    movieRelease: Date
}

type Movie = {
    id: number
    title: string
    description: string
    slug: string
    posterUrl: string
    genres: string[]
    rating: { code: string }[]
    movieRelease: Date
}

function extractYouTubeId(url?: string): string | null {
    if (!url) return null
    const patterns = [
        /youtu\.be\/([^?&]+)/,
        /youtube\.com\/watch\?v=([^&]+)/,
        /youtube\.com\/embed\/([^?&]+)/,
    ]
    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
    }
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url
    return null
}

function mapApiMovie(movie: ApiMovie, index: number): Movie {
    const ratingCode = movie.rating?.[0]?.code ?? "G"
    return {
        id: index,
        title: movie.title,
        description: movie.movieDescription,
        posterUrl: movie.posterUrl,
        slug: movie.slug,
        genres: movie.tags.length > 0 ? movie.tags : ["General"],
        rating: movie.rating,
        movieRelease: movie.movieRelease,
    }
}

export default function MoviesPage() {
    const [apiMovies, setApiMovies] = useState<ApiMovie[]>([])
    const [movies, setMovies] = useState<Movie[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await fetch("/api/movie")
                const data = await res.json()
                if (!res.ok) throw new Error(data.message || "Failed to fetch movies.")
                setApiMovies(data.movies)
                setMovies((data.movies as ApiMovie[]).map(mapApiMovie))
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong.")
            } finally {
                setLoading(false)
            }
        }

        fetchMovies()
    }, [])

    const heroVideos = apiMovies
        .map((m) => ({
            youtubeId: extractYouTubeId(m.bannerUrl),
            title: m.title,
            description: m.movieDescription,
            genre: m.tags[0],
        }))
        .filter((v) => v.youtubeId !== null)
        .slice(0, 5)
        .map((v) => ({
            id: v.youtubeId as string,
            title: v.title,
            description: v.description,
            genre: v.genre,
        }))

    return (
        <div className='flex flex-col gap-5'>

            {heroVideos.length > 0 && <MovieHero videos={heroVideos} movie={movies} />}

            <div className='container mx-auto flex flex-col gap-5 p-5 md:p-0'>

                {loading && (
                    <div className="flex flex-col gap-4">
                        <div className="h-6 w-40 rounded bg-muted animate-pulse" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="aspect-[2/3] rounded-lg bg-muted animate-pulse" />
                            ))}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <ListMovies movies={movies} />
                        <FeaturedPoster movies={movies} />
                    </>
                )}

            </div>
        </div>
    )
}