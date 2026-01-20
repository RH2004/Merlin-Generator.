import React from 'react';
import type { ProofNode } from '@ir/types';
import { motion } from 'framer-motion';

interface ProofProps extends ProofNode {
    index?: number;
}

export const Proof: React.FC<ProofProps> = ({ body, index = 0 }) => {
    return (
        <motion.div
            className="proof-card bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 my-8 shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 + 0.4, duration: 0.6 }}
        >
            <div className="mb-4">
                <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 dark:text-gray-500 uppercase">
                    Formal Proof
                </span>
            </div>
            <div className="relative">
                <p className="text-lg text-gray-700 dark:text-gray-300 italic leading-loose font-medium font-serif pl-6 border-l-2 border-primary-500/30">
                    {body}
                </p>
                <div className="mt-8 text-right">
                    <motion.span
                        className="text-primary-500 font-serif text-2xl"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.15 + 1 }}
                    >
                        ∎
                    </motion.span>
                </div>
            </div>
        </motion.div>
    );
};
