import React from 'react';
import type { TextNode } from '@ir/types';
import { motion } from 'framer-motion';

interface TextContentProps extends TextNode {
    index?: number;
}

export const TextContent: React.FC<TextContentProps> = ({ content, index = 0 }) => {
    return (
        <motion.p
            className="text-content text-gray-600 dark:text-gray-400 leading-[1.8] my-6 text-xl font-medium tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4, duration: 0.6 }}
        >
            {content}
        </motion.p>
    );
};
