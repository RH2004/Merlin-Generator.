import React from 'react';
import type { DefinitionNode } from '@ir/types';
import { motion } from 'framer-motion';

interface DefinitionProps extends DefinitionNode {
    index?: number;
}

export const Definition: React.FC<DefinitionProps> = ({ title, body, index = 0 }) => {
    return (
        <motion.div
            className="definition-card bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-500/20 rounded-3xl p-8 my-8 shadow-glass overflow-hidden relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
        >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-8xl font-black text-emerald-500">D</span>
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold tracking-widest uppercase rounded-full">
                        Definition
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
