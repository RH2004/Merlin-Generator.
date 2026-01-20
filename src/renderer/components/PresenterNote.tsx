import React from 'react';
import type { PresenterNoteNode } from '@ir/types';

interface PresenterNoteProps extends PresenterNoteNode {
    isPresenterMode: boolean;
}

export const PresenterNote: React.FC<PresenterNoteProps> = ({ body, isPresenterMode }) => {
    if (!isPresenterMode) return null;

    return (
        <div className="presenter-note bg-yellow-400 dark:bg-yellow-500/10 border-2 border-yellow-500/20 rounded-3xl p-6 mt-8 shadow-lg">
            <div className="flex items-start gap-4">
                <div className="flex-1">
                    <p className="text-xs font-black text-black dark:text-yellow-400 mb-2 uppercase tracking-[0.2em]">
                        PRESENTER NOTE
                    </p>
                    <p className="text-sm text-gray-900 dark:text-yellow-200/80 leading-relaxed font-semibold">
                        {body}
                    </p>
                </div>
            </div>
        </div>
    );
};
