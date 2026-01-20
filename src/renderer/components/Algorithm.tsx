import React from 'react';
import type { AlgorithmNode } from '@ir/types';
import { motion } from 'framer-motion';

interface AlgorithmProps extends AlgorithmNode {
    index?: number;
}

export const Algorithm: React.FC<AlgorithmProps> = ({ name, steps, index = 0 }) => {
    return (
        <motion.div
            className="algorithm-card bg-slate-900 dark:bg-black border border-slate-700 dark:border-slate-800 rounded-3xl p-8 my-8 shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
        >
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <code className="text-4xl font-mono text-primary-400">{"{ }"}</code>
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                    <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-bold tracking-widest uppercase rounded-full">
                        Algorithm
                    </span>
                    <span className="text-slate-400 text-sm font-mono opacity-50">/ {name.toLowerCase().replace(/\s+/g, '_')}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-6 font-mono border-b border-slate-800 pb-4">
                    {name}
                </h3>

                <ol className="space-y-4 font-mono text-sm md:text-base">
                    {steps.map((step, idx) => (
                        <motion.li
                            key={idx}
                            className="flex gap-4 text-slate-300 group"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15 + idx * 0.08 + 0.5, duration: 0.4 }}
                        >
                            <span className="text-primary-500/50 font-bold min-w-[1.5rem] select-none text-right">
                                {(idx + 1).toString().padStart(2, '0')}
                            </span>
                            <span className="text-slate-200 group-hover:text-blue-400 transition-colors">
                                {step}
                            </span>
                        </motion.li>
                    ))}
                </ol>
            </div>
        </motion.div>
    );
};
