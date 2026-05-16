"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { DetailsDialog } from "./detailDialog";

type Video = {
    id: string;
    title: string;
    description?: string;
    genre?: string;
};

type Props = {
    videos: Video[];
    movie: Movie[];
};

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


export default function MovieHero({ videos, movie }: Props) {
    const playerRef = useRef<any>(null);
    const [index, setIndex] = useState(0);

    const currentVideo = videos?.[index];
    const currentMovies = movie?.[index];

    useEffect(() => {

        if (!videos?.length) return;

        const createPlayer = () => {

            if (!window.YT || !window.YT.Player) return;

            playerRef.current = new window.YT.Player("yt-player", {
                videoId: videos[0].id,

                playerVars: {
                    autoplay: 1,
                    mute: 1,
                    controls: 0,
                    rel: 0,
                    modestbranding: 1,
                    fs: 0,
                    iv_load_policy: 3,
                    playsinline: 1,
                },

                events: {
                    onReady: (event: any) => {
                        event.target.playVideo();
                    },

                    onStateChange: (event: any) => {

                        // ended
                        if (event.data === window.YT.PlayerState.ENDED) {
                            nextVideo();
                        }
                    },
                },
            });
        };

        if (window.YT && window.YT.Player) {
            createPlayer();
            return;
        }

        const existingScript = document.querySelector(
            'script[src="https://www.youtube.com/iframe_api"]'
        );

        if (!existingScript) {

            const tag = document.createElement("script");

            tag.src = "https://www.youtube.com/iframe_api";

            document.body.appendChild(tag);
        }

        window.onYouTubeIframeAPIReady = () => {
            createPlayer();
        };

        if (!playerRef.current) return;

        if (
            typeof playerRef.current.loadVideoById !== "function"
        ) return;

        if (!videos[index]) return;

        playerRef.current.loadVideoById(videos[index].id);

        return () => {
            playerRef.current?.destroy?.();
        };

    }, [index, videos]);

    const nextVideo = () => {

        setIndex((prev) => {

            const next = (prev + 1) % videos.length;

            if (
                playerRef.current &&
                typeof playerRef.current.loadVideoById === "function"
            ) {
                playerRef.current.loadVideoById(videos[next].id);
            }

            return next;
        });
    };

    return (
        <section className="relative h-[330px] md:h-[800px] w-full overflow-hidden bg-black">

            <div
                id="yt-player"
                className="
                    absolute top-1/2 left-1/2
                    min-w-[120%] min-h-[120%]
                    -translate-x-1/2 -translate-y-1/2
                    pointer-events-none
                    scale-125
                "
            />

            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent" />

            <div className="relative z-10 flex h-full items-end">
                <div className="mx-auto w-full max-w-7xl px-6 pb-10 md:pb-24">
                    <div className="max-w-2xl space-y-6">
                        <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                            {currentVideo.genre || "Movie"}
                        </p>

                        <h1 className="text-5xl font-bold text-white md:text-7xl">
                            {currentVideo.title}
                        </h1>

                        <p className="max-w-xl text-base text-white/80 md:text-lg">
                            {currentVideo.description}
                        </p>
                    </div>

                    <div className="flex flex-row gap-3 mt-5 max-w-[100px]">
                        {currentMovies && (
                            <DetailsDialog
                                id={currentMovies.id}
                                title={currentMovies.title}
                                slug={currentMovies.slug}
                                description={currentMovies.description}
                                posterUrl={currentMovies.posterUrl}
                                rating={currentMovies.rating}
                                genres={currentMovies.genres}
                                movieRelease={currentMovies.movieRelease}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}