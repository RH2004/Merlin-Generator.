/**
 * IR Type Definitions for Atlas Slides Generator
 * 
 * This file defines the strict intermediate representation (IR) schema
 * that separates parsing from rendering. All nodes use discriminated unions
 * for type-safe pattern matching.
 */

/**
 * Animation modes for equations and other content
 */
export type AnimationMode = 'none' | 'reveal' | 'highlight';

/**
 * Base interface for all IR nodes
 */
export interface BaseNode {
    type: string;
}

/**
 * Definition node - for mathematical definitions
 */
export interface DefinitionNode extends BaseNode {
    type: 'definition';
    title: string;
    body: string;
}

/**
 * Theorem node - for mathematical theorems
 */
export interface TheoremNode extends BaseNode {
    type: 'theorem';
    title: string;
    body: string;
}

/**
 * Proof node - for mathematical proofs
 */
export interface ProofNode extends BaseNode {
    type: 'proof';
    body: string;
}

/**
 * Equation node - for LaTeX mathematical equations
 */
export interface EquationNode extends BaseNode {
    type: 'equation';
    latex: string;
    animate?: AnimationMode;
}

/**
 * Figure node - for images and diagrams
 */
export interface FigureNode extends BaseNode {
    type: 'figure';
    ref: string;
    alt?: string;
    caption?: string;
}

/**
 * Algorithm node - for pseudocode/algorithms
 */
export interface AlgorithmNode extends BaseNode {
    type: 'algorithm';
    name: string;
    steps: string[];
}

/**
 * Presenter note node - visible only in presenter mode
 */
export interface PresenterNoteNode extends BaseNode {
    type: 'note';
    body: string;
}

/**
 * Text node - for plain text content
 */
export interface TextNode extends BaseNode {
    type: 'text';
    content: string;
}

/**
 * Discriminated union of all content node types
 */
export type ContentNode =
    | DefinitionNode
    | TheoremNode
    | ProofNode
    | EquationNode
    | FigureNode
    | AlgorithmNode
    | PresenterNoteNode
    | TextNode;

/**
 * Slide node - contains a slide's content
 */
export interface SlideNode {
    type: 'slide';
    id: string;
    title: string;
    content: ContentNode[];
}

/**
 * Root document type - represents a complete slide deck
 */
export interface SlideDeck {
    meta: {
        title: string;
        author?: string;
        date?: string;
    };
    slides: SlideNode[];
}

/**
 * Type guard for ContentNode
 */
export function isContentNode(node: unknown): node is ContentNode {
    if (typeof node !== 'object' || node === null) return false;
    const n = node as BaseNode;
    return ['definition', 'theorem', 'proof', 'equation', 'figure', 'algorithm', 'note', 'text'].includes(n.type);
}

/**
 * Type guard for SlideNode
 */
export function isSlideNode(node: unknown): node is SlideNode {
    if (typeof node !== 'object' || node === null) return false;
    const n = node as SlideNode;
    return n.type === 'slide' && typeof n.id === 'string' && typeof n.title === 'string' && Array.isArray(n.content);
}
