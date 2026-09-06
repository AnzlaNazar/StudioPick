# Project: StudioPick

## Stack
Next.js (App Router), TypeScript, Tailwind CSS, Zustand (+persist), Zod, Framer Motion, Vercel AI SDK, Claude API (Anthropic).

## Conventions
- Conventional Commits on every commit (`feat:`, `fix:`, `chore:`, `test:`, `docs:`)
- Server Components by default. Client Components only where interactivity is needed, always marked `"use client"` with a one-line comment explaining why.
- All Zustand state changes go through the store's own actions (e.g., `setLayout(id)`) — never mutate state directly from a component.
- Price calculations live in one place: `src/lib/pricing.ts`. Never compute a price inline in a component.
- AI route logic (system prompt, tool definitions) lives only in `app/api/advisor/` — never duplicated elsewhere.
- No hardcoded secrets, ever — all keys come from environment variables.

## Rules learned along the way
- Rule 1: Always validate tool inputs with Zod schemas before triggering UI state changes.
- Rule 2: Keep mock product catalog strictly typed in a central types file (`src/types/product.ts`).
- Rule 3: Use semantic HTML and proper ARIA attributes on interactive configurator controls for a11y compliance.