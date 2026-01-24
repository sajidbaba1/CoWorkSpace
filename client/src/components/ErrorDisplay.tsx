"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface ErrorDisplayProps {
    errors: string[];
    clearError: () => void;
}

export function ErrorDisplay({ errors, clearError }: ErrorDisplayProps) {
    if (errors.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="relative bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-6 shadow-lg shadow-red-500/5"
            >
                <button
                    onClick={clearError}
                    className="absolute top-2 right-2 p-1 hover:bg-red-500/10 rounded-full transition-all"
                >
                    <X className="h-4 w-4 text-red-500" />
                </button>

                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-red-500 font-bold text-sm mb-1">Attention Required</p>
                        <ul className="text-red-400 text-xs space-y-1 list-disc ml-4">
                            {errors.map((error, i) => (
                                <li key={i}>{error}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
