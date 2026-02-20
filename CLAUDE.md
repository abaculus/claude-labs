# CLAUDE.md — claude-labs

## Project Purpose

`claude-labs` is a TypeScript/Node.js learning sandbox for exploring the Claude API. Each "lab" is a focused, self-contained, runnable script that demonstrates one concept: basic chat, streaming, tool use, agents, multimodal input, and so on.

**Goal:** Build a growing collection of clean, well-commented examples that can be read, run, and extended independently.

---

## Directory Structure

```
claude-labs/
├── labs/               # Individual lab scripts, one concept each
│   ├── 01-basic-chat/
│   ├── 02-streaming/
│   ├── 03-tool-use/
│   └── ...
├── shared/             # Reusable utilities imported by labs
│   ├── client.ts       # Anthropic SDK client (single source of truth)
│   └── utils.ts        # Logging, formatting helpers
├── .env.example        # Template for required environment variables
├── package.json
├── tsconfig.json
└── CLAUDE.md
```

Labs are numbered for progression. Each lab lives in its own directory and runs with:

```bash
npx ts-node labs/NN-concept-name/index.ts
```

---

## Key Architecture Decisions

- **SDK**: Use `@anthropic-ai/sdk` (latest). Import from `../../shared/client.ts` — never instantiate `Anthropic` inline.
- **Default model**: `claude-sonnet-4-6`. Define it as a constant at the top of the file; don't hardcode it inline.
- **Runtime**: Node.js + `ts-node` for direct TypeScript execution. No build step needed for labs.
- **No frameworks**: Labs are plain scripts, not servers. Keep dependencies minimal.
- **API key**: Always via `ANTHROPIC_API_KEY` environment variable. Never hardcode credentials.
- **Self-contained labs**: Each lab should be runnable on its own. Shared code lives in `shared/`; nothing is shared between individual labs.

---

## Coding Conventions

- **TypeScript strict mode**: `"strict": true` in `tsconfig.json`. No `any` types.
- **Module format**: CommonJS (`require` / `module.exports`) unless a lab specifically demonstrates ESM.
- **Naming**:
  - `camelCase` — variables and functions
  - `PascalCase` — types and interfaces
  - `kebab-case` — directory and file names
- **Error handling**: Always wrap API calls in `try/catch`. Log a meaningful message before re-throwing or exiting.
- **Lab header comment**: Every `index.ts` must start with a block comment explaining what the lab demonstrates and what to look for in the output.
- **No magic strings**: Model names, API parameters, and other constants go at the top of the file, named clearly.

---

## Common Tasks

### Adding a new lab

1. Create `labs/NN-concept-name/` (pick the next number in sequence).
2. Add `index.ts` with a header comment describing the concept.
3. Import the shared client: `import { anthropic } from '../../shared/client';`
4. Keep it focused — one concept, minimal boilerplate.
5. Verify it runs cleanly: `npx ts-node labs/NN-concept-name/index.ts`

### Debugging API calls

- Enable verbose SDK logging: `ANTHROPIC_LOG=debug npx ts-node labs/.../index.ts`
- **429 / rate limit errors**: Back off and retry, or switch to a lower-traffic model temporarily.
- **529 / overloaded errors**: Retry with exponential backoff; these are transient.
- **Streaming issues**: Ensure the stream is fully consumed with `for await` and that the surrounding function is `async`.
- **Type errors**: Check the SDK types — parameter shapes change between SDK versions. Run `npm update @anthropic-ai/sdk` and check the changelog if a type suddenly breaks.

### Updating the SDK

```bash
npm update @anthropic-ai/sdk
```

Review the [Anthropic changelog](https://docs.anthropic.com/changelog) for breaking changes before updating.

### Running all labs (smoke test)

There is no test runner yet. To manually verify labs still work after a dependency update, run each `index.ts` in order and confirm clean output.

---

## Environment Setup

Copy `.env.example` to `.env` and fill in your API key:

```bash
cp .env.example .env
```

Required variables:

| Variable            | Description                     |
|---------------------|---------------------------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key          |

Load `.env` in labs using `dotenv`:

```ts
import 'dotenv/config';
```

---

## What Claude Should Not Do Here

- Do not add a web server or HTTP framework unless a lab explicitly requires it.
- Do not create shared state between labs.
- Do not commit `.env` or any file containing API keys.
- Do not abstract prematurely — labs should be readable top-to-bottom without jumping between files.
