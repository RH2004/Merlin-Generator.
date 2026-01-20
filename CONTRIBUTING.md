# Contributing to Merlin

Welcome! We are thrilled that you are interested in contributing to Merlin. As a framework built for precision, aesthetics, and deterministic slide generation, we maintain high standards for code quality and documentation.

## Core Values

1. **Determinism**: Every input must produce a predictable, reproducible output.
2. **Semantic Integrity**: Content structure remains separate from visual rendering.
3. **Professional Aesthetics**: High-end design is a first-class citizen.
4. **Safety**: Strict validation for all user-provided or LLM-generated content.

## How to Contribute

### Reporting Bugs
- Use the GitHub Issue Tracker.
- Provide a minimal reproducible example (LaTeX-Lite source or IR JSON).
- Describe the expected vs. actual behavior.

### Feature Requests
- Open an issue titled "[Feature] Your Feature Name".
- Explain the use case and how it aligns with Merlin's core principles.

### Pull Requests
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Ensure all TypeScript types are strict and correct.
4. If adding a new content type, update the IR schema in `src/parser/schema.ts` and the Zod validator in `src/ir/validator.ts`.
5. Submit the PR with a clear description of the change.

## Development Setup

```bash
npm install
npm run dev
```

## Architectural Guidelines

Merlin follows a strict 3-layer architecture:
1. **Parser Layer**: Converts source to IR. Must be pure and deterministic.
2. **Validation Layer**: Uses Zod to ensure IR integrity.
3. **Renderer Layer**: Maps IR to React components. Must not contain business logic.

Thank you for helping make Merlin the best framework for scientific storytelling!
