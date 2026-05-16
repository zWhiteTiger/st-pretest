"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RiCalendar2Fill, RiClapperboardLine } from "@remixicon/react";
import { format } from "date-fns";
import MovieEditDialog from "./MovieEditDialog";
import Image from "next/image";
import { api } from "@/lib/axios";
import axios from "axios";

type Rating = { code: "G" | "PG" | "M" | "MA" | "R" };

type Movie = {
    _id: string;
    title: string;
    slug: string;
    movieDescription: string;
    posterUrl: string;
    bannerUrl?: string;
    tags: string[];
    rating: Rating[];
    createdAt: string;
    movieRelease?: string;
};

const ratingColors: Record<string, string> = {
    G: "text-green-700 border-green-200",
    PG: "text-sky-700 border-sky-200",
    M: "text-amber-700 border-amber-200",
    MA: "text-orange-700 border-orange-200",
    R: "text-rose-700 border-rose-200",
};

const RATING_OPTIONS = ["G", "PG", "M", "MA", "R"];

const defaultForm = {
    title: "",
    movieDescription: "",
    posterUrl: "",
    bannerUrl: "",
    tags: "",
    rating: "",
};

export default function MoviesSection() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editSlug, setEditSlug] = useState<string | null>(null);

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(defaultForm);
    const [movieRelease, setMovieRelease] = useState<Date | undefined>(undefined);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const fetchMovies = async () => {
        try {
            setLoading(true);

            const { data } = await api.get("/movie");

            setMovies(data.movies);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Failed to fetch movies.");
            } else {
                setError("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setFormError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!form.title || !form.movieDescription || !form.posterUrl) {
            setFormError("Title, description, and poster URL are required.");
            return;
        }

        setSubmitting(true);

        try {
            await api.post("/manage/movie", {
                title: form.title,
                movieDescription: form.movieDescription,
                posterUrl: form.posterUrl,
                ...(form.bannerUrl && { bannerUrl: form.bannerUrl }),
                tags: form.tags
                    ? form.tags
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                    : [],
                rating: form.rating ? [{ code: form.rating }] : [],
                movieRelease: movieRelease
                    ? movieRelease.toISOString()
                    : undefined,
            });

            setOpen(false);
            setForm(defaultForm);
            setMovieRelease(undefined);

            await fetchMovies();
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setFormError(
                    err.response?.data?.message || "Failed to create movie."
                );
            } else {
                setFormError("Something went wrong.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-semibold">Movies</h2>
                    <p className="text-sm text-muted-foreground">Manage Movies</p>
                </div>
                <Button onClick={() => setOpen(true)}>+ Add Movie</Button>
            </div>

            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
                    ))}
                </div>
            )}

            {error && (
                <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            {!loading && !error && movies.length === 0 && (
                <p className="text-sm text-muted-foreground">No movies found. Add one!</p>
            )}

            {!loading && !error && movies.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {movies.map((movie) => (
                        <Card
                            key={movie._id}
                            className="shadow-none p-0 border border-dashed hover:border-solid hover:shadow-sm transition-all duration-200 overflow-hidden"
                        >
                            <div className="relative w-full h-40 bg-muted overflow-hidden">
                                <Image
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    fill
                                    priority
                                    quality={100}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            "https://placehold.co/400x160?text=No+Image";
                                    }}
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
                            </div>

                            <CardContent className="p-4 flex flex-col gap-2">
                                <h3 className="font-semibold text-sm leading-tight line-clamp-1">
                                    {movie.title}
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {movie.movieDescription}
                                </p>
                                {movie.movieRelease && (
                                    <p className="text-xs text-muted-foreground flex flex-row gap-2 items-center">
                                        <RiClapperboardLine size={12} /> {format(new Date(movie.movieRelease), "PPP")}
                                    </p>
                                )}
                                {movie.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {movie.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-1 w-full"
                                    onClick={() => setEditSlug(movie.slug)}
                                >
                                    Edit
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <MovieEditDialog
                slug={editSlug}
                open={editSlug !== null}
                onOpenChange={(v) => { if (!v) setEditSlug(null); }}
                onUpdated={fetchMovies}
                onDeleted={fetchMovies}
            />

            <Dialog open={open} onOpenChange={(v) => { setOpen(v); setFormError(null); }}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Movie</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
                        {formError && (
                            <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
                                {formError}
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Title <span className="text-destructive">*</span></label>
                            <Input name="title" placeholder="The Dark Knight" value={form.title} onChange={handleChange} disabled={submitting} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Description <span className="text-destructive">*</span></label>
                            <textarea
                                name="movieDescription"
                                placeholder="Movie description..."
                                value={form.movieDescription}
                                onChange={handleChange}
                                disabled={submitting}
                                rows={3}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 resize-none"
                            />
                        </div>

                        {/* Release Date */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Release Date</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={submitting}
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <RiCalendar2Fill className="mr-2 h-4 w-4" />
                                        {movieRelease
                                            ? format(movieRelease, "PPP")
                                            : <span className="text-muted-foreground">Pick a date</span>
                                        }
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={movieRelease} onSelect={setMovieRelease} />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Poster URL <span className="text-destructive">*</span></label>
                            <Input name="posterUrl" placeholder="https://..." value={form.posterUrl} onChange={handleChange} disabled={submitting} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Banner URL</label>
                            <Input name="bannerUrl" placeholder="https://... (optional)" value={form.bannerUrl} onChange={handleChange} disabled={submitting} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Tags</label>
                            <Input name="tags" placeholder="action, thriller, sci-fi" value={form.tags} onChange={handleChange} disabled={submitting} />
                            <p className="text-xs text-muted-foreground">Separate tags with commas</p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Rating</label>
                            <div className="flex gap-2 flex-wrap">
                                {RATING_OPTIONS.map((code) => (
                                    <button
                                        key={code}
                                        type="button"
                                        onClick={() => setForm((prev) => ({ ...prev, rating: prev.rating === code ? "" : code }))}
                                        disabled={submitting}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${form.rating === code
                                            ? ratingColors[code]
                                            : "border-border text-muted-foreground hover:border-foreground"
                                            }`}
                                    >
                                        {code}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => { setOpen(false); setMovieRelease(undefined); }}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Creating..." : "Create Movie"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}