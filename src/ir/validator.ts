/**
 * IR Schema Validator using Zod
 * 
 * Validates IR JSON at runtime to ensure schema compliance before rendering.
 * This is critical for LLM-generated content and user-provided JSON files.
 */

import { z } from 'zod';
import type { SlideDeck, ContentNode, SlideNode } from './types';

/**
 * Animation mode schema
 */
const animationModeSchema = z.enum(['none', 'reveal', 'highlight']);

/**
 * Definition node schema
 */
const definitionNodeSchema = z.object({
    type: z.literal('definition'),
    title: z.string(),
    body: z.string(),
});

/**
 * Theorem node schema
 */
const theoremNodeSchema = z.object({
    type: z.literal('theorem'),
    title: z.string(),
    body: z.string(),
});

/**
 * Proof node schema
 */
const proofNodeSchema = z.object({
    type: z.literal('proof'),
    body: z.string(),
});

/**
 * Equation node schema
 */
const equationNodeSchema = z.object({
    type: z.literal('equation'),
    latex: z.string(),
    animate: animationModeSchema.optional(),
});

/**
 * Figure node schema
 */
const figureNodeSchema = z.object({
    type: z.literal('figure'),
    ref: z.string(),
    alt: z.string().optional(),
    caption: z.string().optional(),
});

/**
 * Algorithm node schema
 */
const algorithmNodeSchema = z.object({
    type: z.literal('algorithm'),
    name: z.string(),
    steps: z.array(z.string()),
});

/**
 * Presenter note node schema
 */
const presenterNoteNodeSchema = z.object({
    type: z.literal('note'),
    body: z.string(),
});

/**
 * Text node schema
 */
const textNodeSchema = z.object({
    type: z.literal('text'),
    content: z.string(),
});

/**
 * Content node discriminated union schema
 */
const contentNodeSchema = z.discriminatedUnion('type', [
    definitionNodeSchema,
    theoremNodeSchema,
    proofNodeSchema,
    equationNodeSchema,
    figureNodeSchema,
    algorithmNodeSchema,
    presenterNoteNodeSchema,
    textNodeSchema,
]);

/**
 * Slide node schema
 */
const slideNodeSchema = z.object({
    type: z.literal('slide'),
    id: z.string(),
    title: z.string(),
    content: z.array(contentNodeSchema),
});

/**
 * Slide deck schema (root)
 */
const slideDeckSchema = z.object({
    meta: z.object({
        title: z.string(),
        author: z.string().optional(),
        date: z.string().optional(),
    }),
    slides: z.array(slideNodeSchema),
});

/**
 * Validation error class
 */
export class ValidationError extends Error {
    constructor(message: string, public issues: z.ZodIssue[]) {
        super(message);
        this.name = 'ValidationError';
    }
}

/**
 * Validates a content node
 */
export function validateContentNode(data: unknown): ContentNode {
    const result = contentNodeSchema.safeParse(data);
    if (!result.success) {
        throw new ValidationError(
            'Invalid content node',
            result.error.issues
        );
    }
    return result.data;
}

/**
 * Validates a slide node
 */
export function validateSlideNode(data: unknown): SlideNode {
    const result = slideNodeSchema.safeParse(data);
    if (!result.success) {
        throw new ValidationError(
            'Invalid slide node',
            result.error.issues
        );
    }
    return result.data;
}

/**
 * Validates a complete slide deck
 * 
 * This is the main validation function that should be called before rendering.
 * Throws ValidationError with detailed information if validation fails.
 */
export function validateSlideDeck(data: unknown): SlideDeck {
    const result = slideDeckSchema.safeParse(data);
    if (!result.success) {
        const errors = result.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`
        ).join('\n');

        throw new ValidationError(
            `Slide deck validation failed:\n${errors}`,
            result.error.issues
        );
    }
    return result.data;
}

/**
 * Formats validation errors for user-friendly display
 */
export function formatValidationError(error: ValidationError): string {
    const header = 'IR Validation Failed\n\n';
    const issues = error.issues.map((issue, idx) => {
        const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
        return `${idx + 1}. Path: ${path}\n   Error: ${issue.message}`;
    }).join('\n\n');

    return header + issues;
}
