/**
 * IR Schema Documentation
 * 
 * This file documents the complete IR schema for the Merlin Slide Generator.
 * It serves as the canonical reference for both humans and LLMs generating IR JSON.
 */

/**
 * SCHEMA OVERVIEW
 * 
 * The IR is a strict JSON format that represents a slide deck. It uses a hierarchical
 * structure: SlideDeck -> Slides -> Content Nodes
 * 
 * All nodes use a discriminated union pattern with a "type" field for type safety.
 */

export const IR_SCHEMA_VERSION = '1.0.0';

/**
 * ROOT: SlideDeck
 * 
 * {
 *   "meta": {
 *     "title": string,        // Required: deck title
 *     "author": string?,      // Optional: author name
 *     "date": string?         // Optional: creation date
 *   },
 *   "slides": SlideNode[]     // Array of slides
 * }
 */

/**
 * SlideNode
 * 
 * {
 *   "type": "slide",
 *   "id": string,             // Unique identifier (e.g., "slide-1")
 *   "title": string,          // Slide title
 *   "content": ContentNode[]  // Array of content nodes
 * }
 */

/**
 * CONTENT NODE TYPES
 * 
 * All content nodes have a "type" field that determines their structure.
 */

/**
 * DefinitionNode
 * 
 * Semantic node for mathematical definitions.
 * 
 * {
 *   "type": "definition",
 *   "title": string,
 *   "body": string
 * }
 * 
 * Example:
 * {
 *   "type": "definition",
 *   "title": "Limit",
 *   "body": "A value that a function approaches as the input approaches some value."
 * }
 */

/**
 * TheoremNode
 * 
 * Semantic node for mathematical theorems.
 * 
 * {
 *   "type": "theorem",
 *   "title": string,
 *   "body": string
 * }
 */

/**
 * ProofNode
 * 
 * Semantic node for mathematical proofs.
 * 
 * {
 *   "type": "proof",
 *   "body": string
 * }
 */

/**
 * EquationNode
 * 
 * LaTeX mathematical equation.
 * 
 * {
 *   "type": "equation",
 *   "latex": string,
 *   "animate": "none" | "reveal" | "highlight"  // Optional, default: "none"
 * }
 * 
 * Example:
 * {
 *   "type": "equation",
 *   "latex": "E = mc^2",
 *   "animate": "reveal"
 * }
 */

/**
 * FigureNode
 * 
 * Image or diagram reference.
 * 
 * {
 *   "type": "figure",
 *   "ref": string,           // Path to image file
 *   "alt": string?,          // Optional: alt text
 *   "caption": string?       // Optional: caption
 * }
 */

/**
 * AlgorithmNode
 * 
 * Pseudocode or algorithm steps.
 * 
 * {
 *   "type": "algorithm",
 *   "name": string,
 *   "steps": string[]
 * }
 * 
 * Example:
 * {
 *   "type": "algorithm",
 *   "name": "Binary Search",
 *   "steps": [
 *     "Set low = 0, high = n-1",
 *     "While low <= high:",
 *     "  Calculate mid = (low + high) / 2",
 *     "  If arr[mid] == target, return mid",
 *     "  If arr[mid] < target, set low = mid + 1",
 *     "  Else set high = mid - 1",
 *     "Return -1"
 *   ]
 * }
 */

/**
 * PresenterNoteNode
 * 
 * Notes visible only in presenter mode.
 * 
 * {
 *   "type": "note",
 *   "body": string
 * }
 */

/**
 * TextNode
 * 
 * Plain text content.
 * 
 * {
 *   "type": "text",
 *   "content": string
 * }
 */

/**
 * LATEX-LITE SUPPORTED COMMANDS
 * 
 * The parser supports these LaTeX commands:
 * 
 * \slide{title}{content}                 - Create a slide
 * \definition{title}{body}               - Definition node
 * \theorem{title}{body}                  - Theorem node
 * \proof{body}                           - Proof node
 * \equation{latex}                       - Equation (no animation)
 * \equation[animate=reveal]{latex}       - Equation with reveal animation
 * \equation[animate=highlight]{latex}    - Equation with highlight animation
 * \figure{path}                          - Figure node
 * \algorithm{name}{step1, step2, ...}    - Algorithm node
 * \note{text}                            - Presenter note
 * 
 * IMPORTANT: Any command not listed above will cause a parser error.
 * No custom commands, no LaTeX packages, no arbitrary LaTeX code.
 */

/**
 * VALIDATION RULES
 * 
 * 1. All required fields must be present
 * 2. No unknown fields are allowed
 * 3. Type fields must match exactly (case-sensitive)
 * 4. Arrays must contain valid elements of the specified type
 * 5. Strings cannot be empty where semantically required
 * 6. Animation modes must be one of: "none", "reveal", "highlight"
 */

/**
 * COMPLETE EXAMPLE
 */
export const EXAMPLE_SLIDE_DECK = {
    meta: {
        title: "Introduction to Calculus",
        author: "Dr. Jane Smith",
        date: "2026-01-20"
    },
    slides: [
        {
            type: "slide",
            id: "slide-1",
            title: "Limits",
            content: [
                {
                    type: "definition",
                    title: "Limit",
                    body: "A value that a function approaches as the input approaches some value."
                },
                {
                    type: "equation",
                    latex: "\\lim_{x \\to a} f(x) = L",
                    animate: "reveal"
                },
                {
                    type: "note",
                    body: "Emphasize that limits are fundamental to calculus."
                }
            ]
        },
        {
            type: "slide",
            id: "slide-2",
            title: "L'Hôpital's Rule",
            content: [
                {
                    type: "theorem",
                    title: "L'Hôpital's Rule",
                    body: "If the limit of f(x)/g(x) as x approaches a gives 0/0 or ∞/∞, then the limit equals the limit of f'(x)/g'(x)."
                },
                {
                    type: "proof",
                    body: "Follows from the mean value theorem and Cauchy's generalization."
                }
            ]
        }
    ]
};
