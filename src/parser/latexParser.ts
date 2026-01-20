/**
 * LaTeX-Lite Parser
 * 
 * Parses a restricted LaTeX dialect into IR JSON.
 * This is a deterministic, pure function with strict error handling.
 * 
 * IMPORTANT: No rendering logic, no defaults, no silent recovery.
 */

import type {
    SlideDeck,
    SlideNode,
    ContentNode,
    AnimationMode
} from '@ir/types';

/**
 * Token types for lexical analysis
 */
enum TokenType {
    COMMAND = 'COMMAND',
    LBRACE = 'LBRACE',
    RBRACE = 'RBRACE',
    LBRACKET = 'LBRACKET',
    RBRACKET = 'RBRACKET',
    TEXT = 'TEXT',
    NEWLINE = 'NEWLINE',
    EOF = 'EOF',
}

/**
 * Token interface
 */
interface Token {
    type: TokenType;
    value: string;
    line: number;
    column: number;
}

/**
 * Parser error class with location information
 */
export class ParserError extends Error {
    constructor(
        message: string,
        public line: number,
        public column: number
    ) {
        super(`Parse error at line ${line}, column ${column}: ${message}`);
        this.name = 'ParserError';
    }
}

/**
 * Tokenizer class
 */
class Tokenizer {
    private pos = 0;
    private line = 1;
    private column = 1;
    private input: string;

    constructor(input: string) {
        this.input = input;
    }

    private peek(): string {
        return this.input[this.pos] || '';
    }

    private advance(): string {
        const char = this.input[this.pos++];
        if (char === '\n') {
            this.line++;
            this.column = 1;
        } else {
            this.column++;
        }
        return char;
    }

    private skipWhitespace(): void {
        while (this.pos < this.input.length) {
            const char = this.peek();
            if (char === ' ' || char === '\t' || char === '\r') {
                this.advance();
            } else {
                break;
            }
        }
    }

    private readCommand(): string {
        let cmd = '';
        this.advance(); // Skip backslash
        while (this.pos < this.input.length) {
            const char = this.peek();
            if (/[a-zA-Z]/.test(char)) {
                cmd += this.advance();
            } else {
                break;
            }
        }
        return cmd;
    }

    private readText(): string {
        let text = '';
        while (this.pos < this.input.length) {
            const char = this.peek();
            if (char === '\\' || char === '{' || char === '}' || char === '[' || char === ']' || char === '\n') {
                break;
            }
            text += this.advance();
        }
        return text.trim();
    }

    tokenize(): Token[] {
        const tokens: Token[] = [];

        while (this.pos < this.input.length) {
            this.skipWhitespace();

            if (this.pos >= this.input.length) break;

            const char = this.peek();
            const line = this.line;
            const column = this.column;

            if (char === '\\') {
                const cmd = this.readCommand();
                tokens.push({ type: TokenType.COMMAND, value: cmd, line, column });
            } else if (char === '{') {
                this.advance();
                tokens.push({ type: TokenType.LBRACE, value: '{', line, column });
            } else if (char === '}') {
                this.advance();
                tokens.push({ type: TokenType.RBRACE, value: '}', line, column });
            } else if (char === '[') {
                this.advance();
                tokens.push({ type: TokenType.LBRACKET, value: '[', line, column });
            } else if (char === ']') {
                this.advance();
                tokens.push({ type: TokenType.RBRACKET, value: ']', line, column });
            } else if (char === '\n') {
                this.advance();
                tokens.push({ type: TokenType.NEWLINE, value: '\n', line, column });
            } else {
                const text = this.readText();
                if (text) {
                    tokens.push({ type: TokenType.TEXT, value: text, line, column });
                }
            }
        }

        tokens.push({ type: TokenType.EOF, value: '', line: this.line, column: this.column });
        return tokens;
    }
}

/**
 * Parser class
 */
class Parser {
    private pos = 0;
    private tokens: Token[];

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    private current(): Token {
        return this.tokens[this.pos] || this.tokens[this.tokens.length - 1];
    }

    private advance(): Token {
        const token = this.current();
        this.pos++;
        return token;
    }

    private expect(type: TokenType): Token {
        const token = this.current();
        if (token.type !== type) {
            throw new ParserError(
                `Expected ${type}, got ${token.type}`,
                token.line,
                token.column
            );
        }
        return this.advance();
    }

    private readBraceContent(): string {
        this.expect(TokenType.LBRACE);
        let content = '';
        let depth = 1;

        while (depth > 0 && this.current().type !== TokenType.EOF) {
            const token = this.current();
            if (token.type === TokenType.LBRACE) {
                depth++;
                content += '{';
                this.advance();
            } else if (token.type === TokenType.RBRACE) {
                depth--;
                if (depth > 0) content += '}';
                this.advance();
            } else {
                content += token.value;
                this.advance();
            }
        }

        return content.trim();
    }

    private readBracketContent(): string {
        this.expect(TokenType.LBRACKET);
        let content = '';

        while (this.current().type !== TokenType.RBRACKET && this.current().type !== TokenType.EOF) {
            content += this.current().value;
            this.advance();
        }

        this.expect(TokenType.RBRACKET);
        return content.trim();
    }

    private parseDefinition(token: Token): ContentNode {
        const title = this.readBraceContent();
        const body = this.readBraceContent();

        return {
            type: 'definition',
            title,
            body,
        };
    }

    private parseTheorem(token: Token): ContentNode {
        const title = this.readBraceContent();
        const body = this.readBraceContent();

        return {
            type: 'theorem',
            title,
            body,
        };
    }

    private parseProof(token: Token): ContentNode {
        const body = this.readBraceContent();

        return {
            type: 'proof',
            body,
        };
    }

    private parseEquation(token: Token): ContentNode {
        let animate: AnimationMode = 'none';

        // Check for optional animation parameter
        if (this.current().type === TokenType.LBRACKET) {
            const params = this.readBracketContent();
            const match = params.match(/animate=(none|reveal|highlight)/);
            if (match) {
                animate = match[1] as AnimationMode;
            }
        }

        const latex = this.readBraceContent();

        return {
            type: 'equation',
            latex,
            animate,
        };
    }

    private parseFigure(token: Token): ContentNode {
        const ref = this.readBraceContent();

        return {
            type: 'figure',
            ref,
        };
    }

    private parseAlgorithm(token: Token): ContentNode {
        const name = this.readBraceContent();
        const stepsContent = this.readBraceContent();

        // Split steps by comma
        const steps = stepsContent
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        return {
            type: 'algorithm',
            name,
            steps,
        };
    }

    private parseNote(token: Token): ContentNode {
        const body = this.readBraceContent();

        return {
            type: 'note',
            body,
        };
    }

    private parseSlide(token: Token): SlideNode {
        const title = this.readBraceContent();
        const contentBlock = this.readBraceContent();

        // Parse content block into content nodes
        const contentTokens = new Tokenizer(contentBlock).tokenize();
        const contentParser = new Parser(contentTokens);
        const content = contentParser.parseContent();

        // Generate unique ID
        const id = `slide-${title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;

        return {
            type: 'slide',
            id,
            title,
            content,
        };
    }

    private parseContent(): ContentNode[] {
        const nodes: ContentNode[] = [];

        while (this.current().type !== TokenType.EOF) {
            const token = this.current();

            if (token.type === TokenType.COMMAND) {
                this.advance();

                switch (token.value) {
                    case 'definition':
                        nodes.push(this.parseDefinition(token));
                        break;
                    case 'theorem':
                        nodes.push(this.parseTheorem(token));
                        break;
                    case 'proof':
                        nodes.push(this.parseProof(token));
                        break;
                    case 'equation':
                        nodes.push(this.parseEquation(token));
                        break;
                    case 'figure':
                        nodes.push(this.parseFigure(token));
                        break;
                    case 'algorithm':
                        nodes.push(this.parseAlgorithm(token));
                        break;
                    case 'note':
                        nodes.push(this.parseNote(token));
                        break;
                    default:
                        throw new ParserError(
                            `Unknown command: \\${token.value}`,
                            token.line,
                            token.column
                        );
                }
            } else if (token.type === TokenType.TEXT) {
                // Plain text node
                const content = token.value;
                this.advance();
                if (content.trim()) {
                    nodes.push({
                        type: 'text',
                        content,
                    });
                }
            } else {
                // Skip newlines and other tokens in content
                this.advance();
            }
        }

        return nodes;
    }

    parse(): SlideDeck {
        const slides: SlideNode[] = [];
        let deckTitle = 'Untitled Deck';

        while (this.current().type !== TokenType.EOF) {
            const token = this.current();

            if (token.type === TokenType.COMMAND) {
                this.advance();

                if (token.value === 'slide') {
                    slides.push(this.parseSlide(token));
                } else if (token.value === 'title') {
                    deckTitle = this.readBraceContent();
                } else {
                    throw new ParserError(
                        `Unexpected command at top level: \\${token.value}. Only \\slide and \\title are allowed.`,
                        token.line,
                        token.column
                    );
                }
            } else if (token.type === TokenType.NEWLINE) {
                this.advance();
            } else {
                throw new ParserError(
                    `Unexpected token at top level: ${token.type}`,
                    token.line,
                    token.column
                );
            }
        }

        return {
            meta: {
                title: deckTitle,
            },
            slides,
        };
    }
}

/**
 * Main parsing function
 * 
 * Parses LaTeX-Lite source into IR JSON.
 * Throws ParserError on any syntax error.
 */
export function parseLatexLite(input: string): SlideDeck {
    const tokenizer = new Tokenizer(input);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    return parser.parse();
}

/**
 * Format parser error for user-friendly display
 */
export function formatParserError(error: ParserError): string {
    return `❌ Parse Error\n\nLine ${error.line}, Column ${error.column}:\n${error.message}`;
}
