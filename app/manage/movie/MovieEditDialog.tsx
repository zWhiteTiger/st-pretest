"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { RiCalendar2Fill } from "@remixicon/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

type Props = {
    slug: string | null;
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onUpdated?: () => void;
    onDeleted?: () => void;
};

type Movie = {
    _id: string;
    title: string;
    slug: string;
    movieDescription: string;
    posterUrl: string;
    bannerUrl?: string;
    tags: string[];
    rating: { code: string }[];
    movieRelease?: string;
};

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

const ratings = ["G", "PG", "M", "MA", "R"];

export default function MovieEditDialog({
    slug,
    open,
    onOpenChange,
    onUpdated,
    onDeleted,
}: Props) {
    const { data: session } = useSession();

    const [movie, setMovie] = useState<Movie | null>(null);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [releaseDate, setReleaseDate] = useState<Date>();

    const [form, setForm] = useState({
        title: "",
        movieDescription: "",
        posterUrl: "",
        bannerUrl: "",
        tags: "",
        rating: "",
    });

    const updateForm = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm((p) => ({
            ...p,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        if (!slug || !open) return;

        (async () => {
            try {
                setLoading(true);

                const { data } = await api.get(`/manage/movie/${slug}`);

                const m = data.movie;

                setMovie(m);

                setForm({
                    title: m.title,
                    movieDescription: m.movieDescription,
                    posterUrl: m.posterUrl,
                    bannerUrl: m.bannerUrl || "",
                    tags: m.tags.join(", "),
                    rating: m.rating?.[0]?.code || "",
                });

                setReleaseDate(
                    m.movieRelease
                        ? new Date(m.movieRelease)
                        : undefined
                );
            } catch (e) {
                setError("Failed to fetch movie");
            } finally {
                setLoading(false);
            }
        })();
    }, [slug, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            await api.patch(`/manage/movie/${slug}`, {
                ...form,
                bannerUrl: form.bannerUrl || undefined,
                tags: form.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),

                rating: form.rating
                    ? [{ code: form.rating }]
                    : [],

                movieRelease: releaseDate?.toISOString(),
            });

            onOpenChange(false);

            onUpdated?.();
        } catch {
            setError("Failed to update movie");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            setSaving(true);

            await api.delete(`/manage/movie/${slug}`);

            onOpenChange(false);

            onDeleted?.();
        } catch {
            setError("Failed to delete movie");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Movie</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="py-6 text-sm text-muted-foreground">
                        Loading...
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        {error && (
                            <div className="text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <Input
                            name="title"
                            value={form.title}
                            onChange={updateForm}
                            placeholder="Movie title"
                        />

                        <textarea
                            name="movieDescription"
                            value={form.movieDescription}
                            onChange={updateForm}
                            rows={4}
                            placeholder="Description..."
                            className="border rounded-md px-3 py-2 text-sm"
                        />

                        <Input
                            name="posterUrl"
                            value={form.posterUrl}
                            onChange={updateForm}
                            placeholder="Poster URL"
                        />

                        <Input
                            name="bannerUrl"
                            value={form.bannerUrl}
                            onChange={updateForm}
                            placeholder="Banner URL"
                        />

                        <Input
                            name="tags"
                            value={form.tags}
                            onChange={updateForm}
                            placeholder="action, sci-fi"
                        />

                        <div className="flex gap-2 flex-wrap">
                            {ratings.map((r) => (
                                <Button
                                    key={r}
                                    type="button"
                                    size="sm"
                                    variant={
                                        form.rating === r
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() =>
                                        setForm((p) => ({
                                            ...p,
                                            rating:
                                                p.rating === r
                                                    ? ""
                                                    : r,
                                        }))
                                    }
                                >
                                    {r}
                                </Button>
                            ))}
                        </div>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="justify-start"
                                >
                                    <RiCalendar2Fill className="mr-2 h-4 w-4" />

                                    {releaseDate
                                        ? format(releaseDate, "PPP")
                                        : "Pick a date"}
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={releaseDate}
                                    onSelect={setReleaseDate}
                                />
                            </PopoverContent>
                        </Popover>

                        <DialogFooter>
                            {session?.user?.role === "MANAGER" && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                        >
                                            Delete
                                        </Button>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Delete movie?
                                            </AlertDialogTitle>

                                            <AlertDialogDescription>
                                                This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>

                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>

                                            <AlertDialogAction
                                                onClick={handleDelete}
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}

                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>

                            <Button type="submit" disabled={saving}>
                                {saving ? "Saving..." : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}