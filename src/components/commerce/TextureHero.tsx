"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export const TextureHero = () => {
    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Video Background */}
            {/* Hero Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/hero-bread.jpg"
                    alt="Shokupan Texture"
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-flour/10 via-flour/20 to-flour" />
            </div>

            {/* Glassmorphic Overlay */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10 p-12 bg-flour/30 backdrop-blur-md border border-flour/50 rounded-2xl shadow-2xl text-center max-w-2xl mx-4"
            >
                <span className="block text-matcha font-bold tracking-widest uppercase text-sm mb-4">
                    Park Slope, Brooklyn
                </span>
                <h1 className="font-serif text-6xl md:text-7xl text-matcha mb-6 leading-tight">
                    The Sound of <br />
                    <span className="italic text-crust-dark">Softness.</span>
                </h1>
                <p className="font-sans text-matcha/80 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                    Japanese milk bread so pillowy, you can hear the tear. Baked fresh every morning using premium Hokkaido flour.
                </p>

                <Link
                    href="/reserve"
                    prefetch={false}
                    className="inline-block bg-matcha text-flour px-8 py-4 rounded-full font-serif text-lg hover:bg-matcha-light transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                    Reserve Your Loaf
                </Link>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-matcha/50"
            >
                <div className="w-px h-16 bg-gradient-to-b from-matcha/0 via-matcha/50 to-matcha/0" />
            </motion.div>
        </section>
    );
};
