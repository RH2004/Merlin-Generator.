import React from 'react';
import type { FigureNode } from '@ir/types';
import { motion } from 'framer-motion';

interface FigureProps extends FigureNode {
    index?: number;
}

export const Figure: React.FC<FigureProps> = ({ ref: imagePath, alt, caption, index = 0 }) => {
    return (
        <motion.div
            className="figure-container my-12"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.15 + 0.4, duration: 0.6 }}
        >
            <div className="relative glass rounded-4xl overflow-hidden shadow-premium group">
                <img
                    src={imagePath}
                    alt={alt || caption || 'Figure'}
                    className="w-full h-auto object-contain max-h-[500px] transition-transform duration-700 group-hover:scale-105"
                />
                {caption && (
                    <div className="px-8 py-4 bg-white/5 dark:bg-black/20 backdrop-blur-md border-t border-border-glass">
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center italic font-medium tracking-wide">
                            {caption}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
