/**
 * Main Application Entry Point
 * 
 * Loads slide decks, validates IR, and renders slides.
 */

import React, { useState } from 'react';
import { SlideRenderer } from '@renderer/SlideRenderer';
import { validateSlideDeck, formatValidationError, ValidationError } from '@ir/validator';
import { parseLatexLite, formatParserError, ParserError } from '@parser/latexParser';
import type { SlideDeck } from '@ir/types';
import { EXAMPLE_SLIDE_DECK } from '@parser/schema';
import { motion, AnimatePresence } from 'framer-motion';

export const App: React.FC = () => {
    const [slideDeck, setSlideDeck] = useState<SlideDeck | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
    const [pasteContent, setPasteContent] = useState('');

    const loadExampleDeck = () => {
        try {
            setIsLoading(true);
            setError(null);

            const validated = validateSlideDeck(EXAMPLE_SLIDE_DECK);
            setSlideDeck(validated);
        } catch (err) {
            if (err instanceof ValidationError) {
                setError(formatValidationError(err));
            } else {
                setError(err instanceof Error ? err.message : 'Unknown error loading example deck');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsLoading(true);
            setError(null);

            const content = await file.text();
            const extension = file.name.split('.').pop()?.toLowerCase();

            let deck: SlideDeck;

            if (extension === 'json') {
                // Parse and validate JSON IR
                const json = JSON.parse(content);
                deck = validateSlideDeck(json);
            } else if (extension === 'tex' || extension === 'txt') {
                // Parse LaTeX-Lite
                const parsed = parseLatexLite(content);
                // Validate the parsed result
                deck = validateSlideDeck(parsed);
            } else {
                throw new Error(`Unsupported file type: .${extension}. Use .json, .tex, or .txt`);
            }

            setSlideDeck(deck);
        } catch (err) {
            if (err instanceof ValidationError) {
                setError(formatValidationError(err));
            } else if (err instanceof ParserError) {
                setError(formatParserError(err));
            } else if (err instanceof SyntaxError) {
                setError(`❌ JSON Parse Error\n\n${err.message}`);
            } else {
                setError(err instanceof Error ? err.message : 'Unknown error loading file');
            }
        } finally {
            setIsLoading(false);
            // Reset file input
            event.target.value = '';
        }
    };

    const handleLoadFromText = () => {
        setIsPasteModalOpen(true);
    };

    const processPastedContent = () => {
        if (!pasteContent.trim()) return;

        try {
            setIsLoading(true);
            setError(null);
            setIsPasteModalOpen(false);

            let deck: SlideDeck;

            // Try JSON first
            try {
                const json = JSON.parse(pasteContent);
                deck = validateSlideDeck(json);
            } catch {
                // Not JSON, try LaTeX-Lite
                const parsed = parseLatexLite(pasteContent);
                deck = validateSlideDeck(parsed);
            }

            setSlideDeck(deck);
            setPasteContent(''); // Clear on success
        } catch (err) {
            if (err instanceof ValidationError) {
                setError(formatValidationError(err));
            } else if (err instanceof ParserError) {
                setError(formatParserError(err));
            } else {
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/10 dark:to-black">
                <motion.div
                    className="max-w-3xl w-full glass rounded-4xl p-12 shadow-premium"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="mb-8">
                        <span className="text-4xl">⚠️</span>
                        <h2 className="text-3xl font-bold mt-4 text-gray-900 dark:text-white">Validation Error</h2>
                    </div>
                    <pre className="text-red-600 dark:text-red-400 whitespace-pre-wrap font-mono text-sm mb-10 bg-red-500/5 dark:bg-red-500/10 p-6 rounded-2xl border border-red-500/10">
                        {error}
                    </pre>
                    <div className="flex gap-4">
                        <button
                            onClick={loadExampleDeck}
                            className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-primary-500/20"
                        >
                            Load Example
                        </button>
                        <button
                            onClick={() => setError(null)}
                            className="px-8 py-4 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-2xl font-bold transition-all"
                        >
                            Dismiss
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        className="w-20 h-20 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-6"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                    <p className="text-2xl font-bold text-gray-400 dark:text-gray-600 tracking-tight animate-pulse">
                        Analyzing Input...
                    </p>
                </div>
            </div>
        );
    }

    // Welcome screen (no deck loaded)
    if (!slideDeck) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 font-outfit">
                {/* Background Decorations */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-primary-500/20 blur-[100px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] bg-accent-500/20 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="max-w-5xl w-full relative z-10">
                    <motion.div
                        className="glass rounded-[3rem] shadow-premium p-16 md:p-24 overflow-hidden"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <header className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mb-6"
                            >
                                <span className="px-4 py-2 bg-primary-500/10 text-primary-500 rounded-full text-xs font-black tracking-widest uppercase border border-primary-500/20">
                                    V1.0 - MERLIN ENGINE
                                </span>
                            </motion.div>
                            <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-8">
                                Merlin<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">Generator.</span>
                            </h1>
                            <p className="text-2xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
                                A high-end, deterministic framework for technical slide generation.
                                Built for precision, aesthetics, and LLM safety.
                            </p>
                        </header>

                        <div className="grid md:grid-cols-3 gap-6 mb-16">
                            <label className="group cursor-pointer">
                                <input
                                    type="file"
                                    accept=".json,.tex,.txt"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <motion.div
                                    className="h-full border-2 border-border-glass bg-white/5 hover:bg-white/10 dark:hover:bg-white/5 rounded-4xl p-10 transition-all hover:scale-[1.02] hover:shadow-xl relative overflow-hidden"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">📁</div>
                                    <div className="font-bold text-xl text-gray-900 dark:text-white mb-2 leading-tight">Upload File</div>
                                    <div className="text-sm text-gray-400 dark:text-gray-500 font-mono">.json / .tex / .txt</div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                                </motion.div>
                            </label>

                            <motion.button
                                onClick={handleLoadFromText}
                                className="group h-full text-left border-2 border-border-glass bg-white/5 hover:bg-white/10 dark:hover:bg-white/5 rounded-4xl p-10 transition-all hover:scale-[1.02] hover:shadow-xl relative overflow-hidden"
                                whileHover={{ y: -5 }}
                            >
                                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">📋</div>
                                <div className="font-bold text-xl text-gray-900 dark:text-white mb-2 leading-tight">Paste Content</div>
                                <div className="text-sm text-gray-400 dark:text-gray-500 font-mono">raw input source</div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                            </motion.button>

                            <motion.button
                                onClick={loadExampleDeck}
                                className="group h-full text-left bg-gradient-to-br from-primary-500 to-indigo-600 rounded-4xl p-10 transition-all hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden"
                                whileHover={{ y: -5 }}
                            >
                                <div className="text-5xl mb-6 transform group-hover:rotate-12 transition-transform">✨</div>
                                <div className="font-bold text-xl text-white mb-2 leading-tight">Try Demo</div>
                                <div className="text-sm text-white/60 font-mono">calculus module</div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                            </motion.button>
                        </div>

                        <div className="flex flex-wrap items-center gap-10 text-gray-400 dark:text-gray-600 font-bold uppercase tracking-[0.2em] text-[10px]">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full" /> DETERMINISTIC
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full" /> KATEX SUPPORTED
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full" /> LLM AGNOSTIC
                            </span>
                        </div>
                    </motion.div>
                </div>

                <AnimatePresence>
                    {isPasteModalOpen && (
                        <motion.div
                            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="max-w-4xl w-full glass rounded-[3rem] p-10 md:p-16 shadow-2xl border border-white/10 relative overflow-hidden"
                                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[80px] rounded-full -mr-32 -mt-32" />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-center mb-10">
                                        <div>
                                            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Paste Source</h2>
                                            <p className="text-gray-500 dark:text-gray-400 font-medium">Insert your LaTeX-Lite or IR JSON content below</p>
                                        </div>
                                        <button
                                            onClick={() => setIsPasteModalOpen(false)}
                                            className="w-12 h-12 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-2xl"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <textarea
                                        autoFocus
                                        className="w-full h-[40vh] bg-black/5 dark:bg-black/40 border-2 border-black/5 dark:border-white/5 rounded-3xl p-8 text-gray-900 dark:text-white font-mono text-lg focus:outline-none focus:border-primary-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 mb-10 resize-none"
                                        placeholder={"# Title\n## Slide 1\nYour content here..."}
                                        value={pasteContent}
                                        onChange={(e) => setPasteContent(e.target.value)}
                                    />

                                    <div className="flex gap-4">
                                        <button
                                            onClick={processPastedContent}
                                            className="px-12 py-5 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-black text-xl transition-all shadow-xl hover:shadow-primary-500/20 active:scale-95 flex items-center gap-3"
                                        >
                                            <span>Generate Slides</span>
                                            <span className="text-2xl">✨</span>
                                        </button>
                                        <button
                                            onClick={() => setIsPasteModalOpen(false)}
                                            className="px-8 py-5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 rounded-2xl font-bold transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // Render slides
    return <SlideRenderer slideDeck={slideDeck} onClose={() => setSlideDeck(null)} />;
};
