"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function RadiantNoiseBackground({
    trigger = true,
}: {
    trigger?: boolean;
}) {
    const [showNoise, setShowNoise] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (trigger) {
            const t = setTimeout(() => setShowNoise(true), 1200);
            return () => clearTimeout(t);
        }
    }, [trigger]);

    useEffect(() => {
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                setIsVisible(false);
                requestAnimationFrame(() => {
                    setIsVisible(true);
                });
            }
        };

        window.addEventListener("pageshow", handlePageShow);
        return () => window.removeEventListener("pageshow", handlePageShow);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showNoise ? 0.65 : 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute inset-0 dark:hidden"
                style={{
                    mixBlendMode: "multiply",
                    maskImage:
                        "radial-gradient(circle at center, transparent 0%, transparent 10%, black 50%, black 1%)",
                    WebkitMaskImage:
                        "radial-gradient(circle at center, transparent 0%, transparent 10%, black 50%, black 1%)",
                }}
            >
                <svg className="w-full h-full">
                    <defs>
                        <filter id="noiseFilter">
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="1.2"
                                numOctaves="3"
                                stitchTiles="stitch"
                            />
                        </filter>
                    </defs>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" fill="black" />
                </svg>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showNoise ? 0.35 : 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute inset-0 hidden dark:block"
                style={{
                    mixBlendMode: "soft-light",
                    maskImage:
                        "radial-gradient(circle at center, transparent 0%, transparent 10%, black 200%, black 1%)",
                    WebkitMaskImage:
                        "radial-gradient(circle at center, transparent 0%, transparent 10%, black 200%, black 1%)",
                }}
            >
                <svg className="w-full h-full">
                    <defs>
                        <filter id="noiseFilterDark">
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="1.2"
                                numOctaves="3"
                                stitchTiles="stitch"
                            />
                        </filter>
                    </defs>
                    <rect width="100%" height="100%" filter="url(#noiseFilterDark)" fill="white" />
                </svg>
            </motion.div>
        </div>
    );
}