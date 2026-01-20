import React from 'react';
import type { SlideNode } from '@ir/types';
import { motion } from 'framer-motion';

interface SlideProps {
    slide: SlideNode;
    isPresenterMode: boolean;
    slideNumber: number;
    totalSlides: number;
    children: React.ReactNode;
}

export const Slide: React.FC<SlideProps> = ({
    slide,
    isPresenterMode,
    slideNumber,
    totalSlides,
    children
}) => {
    return (
        <div className="slide-wrapper min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-hidden font-outfit">
            {/* Halo Glow Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-500/10 dark:bg-primary-500/5 filter blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-accent-500/10 dark:bg-accent-500/5 filter blur-[120px] rounded-full" />
            </div>

            <motion.div
                className="slide-card glass w-full max-w-6xl aspect-[16/9] flex flex-col rounded-4xl shadow-premium relative z-10 p-10 md:p-14 lg:p-16"
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                key={slide.id}
            >
                {/* Header Section */}
                <div className="slide-header mb-12 flex-shrink-0">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <span className="text-xs font-bold tracking-[0.2em] text-primary-500 uppercase mb-3 block">
                            Section Content
                        </span>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-gray-100 leading-tight">
                            {slide.title}
                        </h1>
                    </motion.div>
                </div>

                {/* Content Section */}
                <div className="slide-content flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <div className="max-w-4xl mx-auto py-4">
                        {children}
                    </div>
                </div>

                {/* Footer Section */}
                <div className="slide-footer mt-10 pt-6 border-t border-border-glass flex items-center justify-between text-sm">
                    <div className="flex items-center gap-6">
                        <span className="font-semibold text-gray-400 dark:text-gray-500 tracking-wider">
                            ATLAS FRAMEWORK
                        </span>
                        {isPresenterMode && (
                            <span className="px-3 py-1 bg-yellow-400 font-bold text-black rounded-lg text-xs tracking-tighter shadow-sm">
                                PRESENTER ACTIVE
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-gray-400 dark:text-gray-600 font-mono font-medium">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-border-glass">
                            {slideNumber}
                        </span>
                        <span className="opacity-40">/</span>
                        <span>{totalSlides}</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
