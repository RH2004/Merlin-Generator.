import React from 'react';
import type { TheoremNode } from '@ir/types';
import { motion } from 'framer-motion';

interface TheoremProps extends TheoremNode {
    index?: number;
}

export const Theorem: React.FC<TheoremProps> = ({ title, body, index = 0 }) => {
    return (
        <motion.div
            className="theorem-card bg-blue-50/50 dark:bg-blue-950/10 border border-blue-500/20 rounded-3xl p-8 my-8 shadow-glass overflow-hidden relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
        >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-8xl font-black text-blue-500">T</span>
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-500 text-white text-[10px] font-bold tracking-widest uppercase rounded-full">
                        Theorem
                    </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
                    {title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                    {body}
                </p>
            </div>
        </motion.div>
    );
};
