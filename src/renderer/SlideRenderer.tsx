/**
 * SlideRenderer - Main rendering engine
 * 
 * Pure function from IR JSON to React elements.
 * Component mapping, navigation, and keyboard controls.
 */

import React, { useState, useEffect } from 'react';
import type { SlideDeck, ContentNode } from '@ir/types';
import { AnimatePresence } from 'framer-motion';

import { Slide } from './components/Slide';
import { Definition } from './components/Definition';
import { Theorem } from './components/Theorem';
import { Proof } from './components/Proof';
import { MathBlock } from './components/MathBlock';
import { Algorithm } from './components/Algorithm';
import { Figure } from './components/Figure';
import { PresenterNote } from './components/PresenterNote';
import { TextContent } from './components/TextContent';

interface SlideRendererProps {
    slideDeck: SlideDeck;
    onClose: () => void;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({ slideDeck, onClose }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isPresenterMode, setIsPresenterMode] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const { slides } = slideDeck;
    const currentSlide = slides[currentSlideIndex];

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    nextSlide();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    prevSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    setCurrentSlideIndex(0);
                    break;
                case 'End':
                    e.preventDefault();
                    setCurrentSlideIndex(slides.length - 1);
                    break;
                case 'p':
                case 'P':
                    e.preventDefault();
                    setIsPresenterMode(prev => !prev);
                    break;
                case 'd':
                case 'D':
                    e.preventDefault();
                    toggleDarkMode();
                    break;
                case 'Escape':
                    e.preventDefault();
                    onClose();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlideIndex, slides.length, onClose]);

    // Apply dark mode
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const nextSlide = () => {
        setCurrentSlideIndex(prev => Math.min(prev + 1, slides.length - 1));
    };

    const prevSlide = () => {
        setCurrentSlideIndex(prev => Math.max(prev - 1, 0));
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    /**
     * Render a single content node
     * 
     * This is the core component mapping logic - pure function from IR to JSX
     */
    const renderContentNode = (node: ContentNode, index: number): JSX.Element => {
        switch (node.type) {
            case 'definition':
                return <Definition key={index} {...node} index={index} />;

            case 'theorem':
                return <Theorem key={index} {...node} index={index} />;

            case 'proof':
                return <Proof key={index} {...node} index={index} />;

            case 'equation':
                return <MathBlock key={index} {...node} index={index} />;

            case 'algorithm':
                return <Algorithm key={index} {...node} index={index} />;

            case 'figure':
                return <Figure key={index} {...node} index={index} />;

            case 'note':
                return <PresenterNote key={index} {...node} isPresenterMode={isPresenterMode} />;

            case 'text':
                return <TextContent key={index} {...node} index={index} />;

            default:
                // TypeScript exhaustiveness check
                const _exhaustive: never = node;
                return <div key={index}>Unknown node type</div>;
        }
    };

    if (slides.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="text-center">
                    <p className="text-2xl text-gray-600 dark:text-gray-400">No slides to display</p>
                </div>
            </div>
        );
    }

    return (
        <div className="slide-renderer-container relative">
            {/* Control Panel */}
            <div className="fixed top-4 right-4 z-50 flex gap-2">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg hover:shadow-xl transition-all text-gray-700 dark:text-gray-300 font-bold group flex items-center gap-2 hover:bg-white dark:hover:bg-gray-700 active:scale-95"
                    title="New Presentation (Esc)"
                >
                    <span className="group-hover:rotate-90 transition-transform inline-block">➕</span>
                    <span className="hidden md:inline">New</span>
                </button>
                <button
                    onClick={toggleDarkMode}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg hover:shadow-xl transition-all text-gray-700 dark:text-gray-300 font-semibold"
                    title="Toggle Dark Mode (D)"
                >
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
                <button
                    onClick={() => setIsPresenterMode(prev => !prev)}
                    className={`px-4 py-2 border rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold ${isPresenterMode
                        ? 'bg-yellow-500 text-white border-yellow-600'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                    title="Toggle Presenter Mode (P)"
                >
                    📝
                </button>
            </div>

            {/* Navigation Arrows */}
            {currentSlideIndex > 0 && (
                <button
                    onClick={prevSlide}
                    className="fixed left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-gray-700 dark:text-gray-300 text-2xl"
                    title="Previous Slide (←)"
                >
                    ←
                </button>
            )}

            {currentSlideIndex < slides.length - 1 && (
                <button
                    onClick={nextSlide}
                    className="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-gray-700 dark:text-gray-300 text-2xl"
                    title="Next Slide (→)"
                >
                    →
                </button>
            )}

            {/* Slide Content */}
            <AnimatePresence mode="wait">
                <Slide
                    slide={currentSlide}
                    isPresenterMode={isPresenterMode}
                    slideNumber={currentSlideIndex + 1}
                    totalSlides={slides.length}
                >
                    {currentSlide.content.map((node, index) => renderContentNode(node, index))}
                </Slide>
            </AnimatePresence>

            {/* Keyboard Shortcuts Help */}
            <div className="fixed bottom-4 left-4 z-40 text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow">
                <div className="font-mono">
                    <span className="font-semibold">Keys:</span> ←/→ Navigate • P Presenter • D Dark • Esc Close
                </div>
            </div>
        </div>
    );
};
