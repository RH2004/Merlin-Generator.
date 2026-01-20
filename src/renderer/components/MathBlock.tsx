import React, { useEffect, useRef, useState } from 'react';
import type { EquationNode } from '@ir/types';
import { motion } from 'framer-motion';
import katex from 'katex';

interface MathBlockProps extends EquationNode {
    index?: number;
}

export const MathBlock: React.FC<MathBlockProps> = ({ latex, animate = 'none', index = 0 }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (containerRef.current) {
            try {
                katex.render(latex, containerRef.current, {
                    displayMode: true,
                    throwOnError: true,
                    strict: false,
                });
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to render equation');
            }
        }
    }, [latex]);

    const getAnimationProps = () => {
        const baseDelay = index * 0.1;

        switch (animate) {
            case 'reveal':
                return {
                    initial: { opacity: 0, scale: 0.8 },
                    animate: { opacity: 1, scale: 1 },
                    transition: { delay: baseDelay + 0.2, duration: 0.6, ease: 'easeOut' },
                };
            case 'highlight':
                return {
                    initial: { opacity: 1 },
                    animate: {
                        backgroundColor: ['rgba(59, 130, 246, 0)', 'rgba(59, 130, 246, 0.2)', 'rgba(59, 130, 246, 0)'],
                    },
                    transition: { delay: baseDelay, duration: 1.5 },
                };
            default:
                return {
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: baseDelay, duration: 0.3 },
                };
        }
    };

    if (error) {
        return (
            <div className="equation-error bg-red-50 dark:bg-red-950/20 border-2 border-red-300 dark:border-red-800 rounded-lg p-4 my-4">
                <p className="text-red-800 dark:text-red-300 font-semibold mb-2">⚠️ Equation Error</p>
                <p className="text-red-700 dark:text-red-400 text-sm font-mono">{error}</p>
                <p className="text-red-600 dark:text-red-500 text-sm mt-2 font-mono">{latex}</p>
            </div>
        );
    }

    return (
        <motion.div
            className="equation-container my-12"
            {...getAnimationProps()}
        >
            <div className="relative group">
                <div className="absolute inset-0 bg-primary-500/5 dark:bg-primary-500/10 blur-xl rounded-full scale-75 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div
                    ref={containerRef}
                    className="katex-wrapper text-center text-3xl md:text-4xl text-gray-900 dark:text-white leading-loose relative z-10 py-6"
                />
            </div>
        </motion.div>
    );
};
