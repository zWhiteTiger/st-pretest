"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

type Movie = {
    id: number
    title: string
    slug: string
    description: string
    posterUrl: string
    rating: { code: string }[]
    genres: string[]
    movieRelease: Date
}

export function DetailsDialog(movie: Movie) {

    const releaseYear = movie.movieRelease
        ? new Date(movie.movieRelease).getFullYear()
        : null

    return (
        <Dialog>

            <DialogTrigger asChild>
                <Button
                    variant="default"
                    className="w-full"
                >
                    View Details
                </Button>
            </DialogTrigger>

            <DialogContent
                className="sm:max-w-3xl overflow-hidden p-0 gap-0">

                <div className="flex flex-col md:flex-row">

                    <div
                        className="relative w-full md:w-[280px] h-[420px] shrink-0">
                        <Image
                            src={movie.posterUrl}
                            alt={movie.title}
                            fill
                            className="object-cover"
                        />

                        <div
                            className=" absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </div>

                    <div
                        className="flex flex-col flex-1 p-6 gap-5">

                        <DialogHeader className="space-y-3 text-left">

                            <div className="flex flex-col gap-2">

                                <DialogTitle
                                    className="text-2xl font-bold leading-tight">
                                    {movie.title}
                                </DialogTitle>

                                <div
                                    className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground"
                                >
                                    {releaseYear && (
                                        <span>{releaseYear}</span>
                                    )}

                                    {movie.rating.length > 0 && (
                                        <>
                                            <span>•</span>

                                            <div className="flex gap-1 flex-wrap">
                                                {movie.rating.map((rating, index) => (
                                                    <span
                                                        key={`${rating.code}-${index}`}
                                                        className="text-[11px] px-2 py-0.5 rounded-md bg-secondary border border-border text-foreground">
                                                        {rating.code}
                                                    </span>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                            </div>

                            <div className="flex flex-wrap gap-2">
                                {movie.genres.map((genre) => (
                                    <span
                                        key={genre}
                                        className="text-xs px-3 py-1 rounded-full border border-border bg-secondary text-secondary-foreground">
                                        {genre}
                                    </span>
                                ))}
                            </div>

                        </DialogHeader>

                        <div className="flex flex-col gap-3">

                            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Overview
                            </h3>

                            <p className="text-sm leading-7 text-muted-foreground" >
                                {movie.description}
                            </p>
                        </div>

                        <DialogFooter className="mt-auto">

                            <DialogClose asChild>
                                <Button variant="outline">
                                    Close
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}