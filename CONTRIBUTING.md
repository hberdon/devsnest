# Contributing to devsnest

devsnest is an open-source developer toolbox. Contributions are welcome — especially new tools, bug fixes, and improvements to existing ones.

## Before you start

Open an issue before writing code. It avoids duplicated effort and lets us align on approach before you invest time.

## What I accept

- **New tools** — must be client-side only (no backend calls, no telemetry)
- **Bug fixes** — broken output, edge cases, wrong conversions
- **UX improvements** — usability, accessibility, keyboard navigation
- **i18n** — translations or fixes to existing ones
- **Performance** — bundle size, rendering, debounce tuning

## What I don't accept

- Tools that require a server or send data externally
- Breaking changes to the design system or theming without prior discussion
- Dependency additions without justification — this project intentionally keeps deps minimal

## Adding a new tool

Each tool lives in `src/tools/<tool-name>/` and must export a default React component. Register it in `src/tools/registry.ts`.

Structure:
```
src/tools/my-tool/
├── index.tsx       # Tool component (default export)
└── README.md       # Optional: what it does, edge cases
```

Requirements:
- TypeScript strict — no `any`, no type assertions without comment
- All processing client-side — nothing leaves the browser
- Follows the existing `ToolLayout` + `SplitPane` pattern
- Works in both light and dark mode across all 8 themes
- Keyboard accessible

## Process

1. Open an issue — describe the tool or bug
2. Fork the repo, create a branch: `feat/tool-name` or `fix/brief-description`
3. Run `npm run type-check` before opening a PR — no TypeScript errors
4. Open a pull request referencing the issue

## Stack

React 19 · TypeScript 5.8 (strict) · Vite 6 · React Router 7

```bash
npm install
npm run dev          # http://localhost:5173
npm run type-check   # verify before PR
```

## Code style

- Functional components only, no class components
- Hooks in `src/hooks/` if reusable across tools
- Use design system tokens from `src/design-system/tokens.css` — no hardcoded colors
- Keep tool components self-contained

## Note

PRs may be closed if they don't fit the project's direction. Nothing personal — open an issue first and we'll figure it out before you write a single line.
