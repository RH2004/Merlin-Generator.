# Merlin

**The deterministic, compiler-native framework for technical storytelling.**

Merlin represents a paradigm shift in slide generation. Moving away from fragile templates and visual editors, Merlin treats presentations as code. Built with a strict Intermediate Representation (IR), it ensures that your scientific and technical content is parsed with precision and rendered with a premium, high-end aesthetic automatically.

## Why Merlin?

In an era of AI-generated content, presentations need to be more than just "slides." They need to be reproducible, semantically correct, and visually stunning. Merlin is designed for:

- **Researchers**: Convert LaTeX-Lite directly into interactive, web-native presentations.
- **STEM Educators**: Focus on the math and logic, let the Merlin Engine handle the layout and animations.
- **AI Agents**: A schema-validated target for LLMs to generate high-fidelity technical decks without "hallucinated" layouts.

## Engineering Principles

- **Zero Layout Logic**: The source describes the *what*. The engine determines the *how*.
- **Compiler-Grade Precision**: Strict LR-like parsing of LaTeX-Lite source ensures errors are caught early and loudly.
- **IR-First Architecture**: A robust intermediate layer allows for multiple input formats (LaTeX, JSON, YAML) and multiple potential outputs (React, PDF, CLI).
- **Aesthetic Determinism**: High-end typography and glassmorphism styling are baked into the core, not added as a theme.


## Features

- **LaTeX-Lite Parser**: Restricted LaTeX dialect for slide authoring
- **IR Validation**: Runtime schema validation with Zod
- **Beautiful Rendering**: Modern React components with Framer Motion
- **Math Support**: KaTeX rendering with animation modes
- **Presenter Mode**: Hidden notes visible only to presenters
- **Dark Mode**: Automatic theme switching
- **Keyboard Navigation**: Arrow keys, shortcuts for everything
- **Responsive**: Works on all screen sizes

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

### Option 1: Upload a File

1. Click "Upload File" on the welcome screen
2. Select a `.tex` (LaTeX-Lite), `.json` (IR JSON), or `.txt` file
3. Slides will render automatically

### Option 2: Paste Content

1. Click "Paste Content"
2. Paste LaTeX-Lite source or IR JSON
3. Press OK

### Option 3: Try the Example

Click "Load Example" to see a sample calculus presentation.

## LaTeX-Lite Syntax

### Document Structure

```latex
\title{Your Deck Title}

\slide{Slide Title}{
  % Content goes here
}
```

### Supported Commands

#### `\definition{title}{body}`
Creates a definition block with semantic styling.

```latex
\definition{Limit}{A value that a function approaches as the input approaches some value.}
```

#### `\theorem{title}{body}`
Creates a theorem block.

```latex
\theorem{Pythagorean Theorem}{In a right triangle, a² + b² = c².}
```

#### `\proof{body}`
Creates a proof block with QED symbol.

```latex
\proof{By construction and the triangle inequality...}
```

#### `\equation{latex}` or `\equation[animate=mode]{latex}`
Renders LaTeX math equation. Animation modes: `none`, `reveal`, `highlight`.

```latex
\equation[animate=reveal]{\int_a^b f(x)\,dx = F(b) - F(a)}
```

#### `\algorithm{name}{step1, step2, ...}`
Creates a numbered algorithm block.

```latex
\algorithm{Binary Search}{
  Set low = 0 and high = n-1,
  While low <= high: calculate mid,
  Compare arr[mid] with target,
  Adjust bounds accordingly
}
```

#### `\figure{path}`
Embeds an image.

```latex
\figure{/path/to/image.png}
```

#### `\note{text}`
Creates a presenter note (visible only in presenter mode).

```latex
\note{Remember to explain this slowly and use the whiteboard.}
```

#### Plain Text
Text outside commands is rendered as paragraph text.

```latex
This connects differentiation and integration as inverse operations.
```

### Complete Example

See [`examples/calculus.tex`](file:///c:/Users/user/Downloads/Slides%20Generator/examples/calculus.tex) for a full example.

## IR JSON Format

The IR (Intermediate Representation) is a strict JSON schema. See [`src/parser/schema.ts`](file:///c:/Users/user/Downloads/Slides%20Generator/src/parser/schema.ts) for complete documentation.

### Example IR

```json
{
  "meta": {
    "title": "Introduction to Calculus",
    "author": "Dr. Jane Smith",
    "date": "2026-01-20"
  },
  "slides": [
    {
      "type": "slide",
      "id": "slide-limits",
      "title": "Limits",
      "content": [
        {
          "type": "definition",
          "title": "Limit",
          "body": "A value that a function approaches..."
        },
        {
          "type": "equation",
          "latex": "\\lim_{x \\to a} f(x) = L",
          "animate": "reveal"
        }
      ]
    }
  ]
}
```

See [`examples/graphs.json`](file:///c:/Users/user/Downloads/Slides%20Generator/examples/graphs.json) for a complete example.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` / `Space` | Next slide |
| `←` | Previous slide |
| `Home` | First slide |
| `End` | Last slide |
| `P` | Toggle presenter mode |
| `D` | Toggle dark mode |

## Architecture

```
┌─────────────────┐
│  LaTeX-Lite     │  User Input
│  or IR JSON     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Parser Layer   │  latexParser.ts
│  (LaTeX → IR)   │  (Deterministic)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  IR Validation  │  validator.ts
│  (Zod Schema)   │  (Fail-fast)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Renderer Layer  │  SlideRenderer.tsx
│ (IR → React)    │  (Pure mapping)
└─────────────────┘
```

### Key Components

- **Parser** ([`src/parser/latexParser.ts`](file:///c:/Users/user/Downloads/Slides%20Generator/src/parser/latexParser.ts)): Tokenizer + parser for LaTeX-Lite
- **IR Types** ([`src/ir/types.ts`](file:///c:/Users/user/Downloads/Slides%20Generator/src/ir/types.ts)): TypeScript type definitions
- **Validator** ([`src/ir/validator.ts`](file:///c:/Users/user/Downloads/Slides%20Generator/src/ir/validator.ts)): Zod schemas for runtime validation
- **Components** ([`src/renderer/components/`](file:///c:/Users/user/Downloads/Slides%20Generator/src/renderer/components/)): React components for each IR node type
- **Renderer** ([`src/renderer/SlideRenderer.tsx`](file:///c:/Users/user/Downloads/Slides%20Generator/src/renderer/SlideRenderer.tsx)): Main rendering engine

## AI Generation

This framework is designed to be **LLM-safe**. AI models can reliably generate slides by outputting IR JSON that conforms to the schema.

### For LLM Prompts

```
Generate slides in this IR JSON format:
{
  "meta": { "title": "...", "author": "...", "date": "..." },
  "slides": [
    {
      "type": "slide",
      "id": "unique-id",
      "title": "Slide Title",
      "content": [
        { "type": "definition", "title": "...", "body": "..." },
        { "type": "equation", "latex": "...", "animate": "reveal" }
      ]
    }
  ]
}

Supported content types: definition, theorem, proof, equation, algorithm, figure, note, text
Animation modes: none, reveal, highlight
```

The system will validate and provide clear error messages if the schema is violated.

## Customization

### Tailwind Theme

Edit [`tailwind.config.js`](file:///c:/Users/user/Downloads/Slides%20Generator/tailwind.config.js) to customize colors:

```js
semantic: {
  definition: '#10b981',  // Green
  theorem: '#3b82f6',     // Blue
  proof: '#8b5cf6',       // Purple
  algorithm: '#f59e0b',   // Amber
}
```

### Global Styles

Edit [`src/styles/globals.css`](file:///c:/Users/user/Downloads/Slides%20Generator/src/styles/globals.css) for CSS variables and typography.

## Deployment

### Static Build

```bash
npm run build
```

The `dist/` folder contains static files ready for deployment.

### Deploy to Vercel

```bash
vercel
```

### Deploy to Netlify

Drag the `dist/` folder to Netlify or connect your Git repository.

## Development

### Project Structure

```
src/
├── ir/
│   ├── types.ts          # TypeScript types
│   └── validator.ts      # Zod schemas
├── parser/
│   ├── latexParser.ts    # LaTeX-Lite parser
│   └── schema.ts         # IR documentation
├── renderer/
│   ├── components/       # React components
│   └── SlideRenderer.tsx # Main renderer
├── app/
│   └── App.tsx          # Application entry
├── styles/
│   └── globals.css      # Global styles
└── main.tsx            # React root

examples/
├── calculus.tex        # LaTeX-Lite example
└── graphs.json         # IR JSON example
```

### Adding New Content Types

1. Add type to [`src/ir/types.ts`](file:///c:/Users/user/Downloads/Slides%20Generator/src/ir/types.ts)
2. Add Zod schema to [`src/ir/validator.ts`](file:///c:/Users/user/Downloads/Slides%20Generator/src/ir/validator.ts)
3. Add parser command to [`src/parser/latexParser.ts`](file:///c:/Users/user/Downloads/Slides%20Generator/src/parser/latexParser.ts)
4. Create React component in [`src/renderer/components/`](file:///c:/Users/user/Downloads/Slides%20Generator/src/renderer/components/)
5. Add mapping in [`src/renderer/SlideRenderer.tsx`](file:///c:/Users/user/Downloads/Slides%20Generator/src/renderer/SlideRenderer.tsx)

## Important Constraints

### NOT Supported

- Full LaTeX (only LaTeX-Lite subset)
- Arbitrary HTML/JSX injection
- Custom commands without schema updates
- Silent error recovery

### Design Philosophy

This is a **compiler**, not a template engine:
- Errors fail loudly with clear messages
- No implicit defaults or magic behavior
- Same input always produces same output
- Separation of concerns is strictly enforced

## Roadmap

The vision for Merlin is to become the standard for technical presentations. Our roadmap includes:

- [ ] **Merlin CLI**: Headless generation of PDF/Static decks from directories.
- [ ] **Plugin System**: Support for custom React components via a simple bridge.
- [ ] **Collaborative Mode**: Real-time sync for remote presentations.
- [ ] **Enhanced IR**: Support for complex graph layouts and interactive 3D models.
- [ ] **Template Gallery**: Community-curated themes with the same premium feel.

## Security

Merlin is designed to be **LLM-safe** and **Sandboxed**. 
- The LaTeX-Lite parser is restricted to a specific subset of commands, preventing arbitrary code execution.
- Runtime Zod validation ensures that the rendering engine never processes malformed or malicious data.
- For security vulnerabilities, please refer to our internal disclosure policy in `SECURITY.md` (Coming soon).

## Further Reading

- [IR Schema Documentation](file:///c:/Users/user/Downloads/Slides%20Generator/src/parser/schema.ts)
- [Implementation Plan](file:///C:/Users/user/.gemini/antigravity/brain/434e35d0-4de2-4f23-a760-6f5e4513bbe4/implementation_plan.md)

## License

MIT

## Acknowledgments

Built with:
- React + TypeScript
- Vite
- TailwindCSS
- KaTeX
- Framer Motion
- Zod

---

**Made for researchers, educators, and AI agents who value determinism and reproducibility.**
