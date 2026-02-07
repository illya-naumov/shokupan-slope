"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

interface LiveInventoryProps {
    initialStock?: number;
}

export const LiveInventory = ({ initialStock = 12 }: LiveInventoryProps) => {
    const [stock, setStock] = useState(initialStock);

    // Simulate live sales (just for demo effect)
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.8) {
                setStock((prev) => Math.max(0, prev - 1));
            }
        }, 45000); // Reduce stock every 45s sporadically
        return () => clearInterval(interval);
    }, []);

    if (stock === 0) {
        return (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full border border-gray-200">
                <div className="w-2 h-2 rounded-full bg-gray-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-gray-500">
                    Sold Out for Today
                </span>
            </div>
        )
    }

    return (
        <div className={clsx(
            "inline-flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-sm transition-all duration-300",
            stock < 5
                ? "bg-red-50 border-red-100 text-red-800"
                : "bg-crust/10 border-crust/20 text-crust-dark"
        )}>
            <span className="relative flex h-2 w-2">
                <motion.span
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className={clsx(
                        "absolute inline-flex h-full w-full rounded-full opacity-75",
                        stock < 5 ? "bg-red-500" : "bg-crust"
                    )}
                />
                <span className={clsx(
                    "relative inline-flex rounded-full h-2 w-2",
                    stock < 5 ? "bg-red-600" : "bg-crust-dark"
                )} />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                {stock} Loaves Remaining
            </span>
        </div>
    );
};
