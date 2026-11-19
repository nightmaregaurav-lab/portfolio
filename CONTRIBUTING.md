# Contributing

Thanks for helping improve the portfolio project.

## Run it locally

1. Fork the repository.
2. Clone your fork or open it in a GitHub Codespace.
3. Install dependencies with `pnpm install`.
4. Start the development server with `pnpm dev`.
5. Use the ignored `local-config/` folder for development-only configuration. It overrides `public/config/` while `NODE_ENV=development` is active.

The project uses Node.js `26.13.0` and pnpm `12.18.0`. See `package.json` for the supported versions and available scripts.

## Make a contribution

1. Create a focused change in your fork.
2. Run `pnpm check` to lint, format, and sort imports (all in one command), and ensure everything passes. When relevant, also run `pnpm build`.
3. Push your branch to your fork.
4. Open a pull request against `nightmaregaurav/portfolio`.

## Contribution rules

- Read [AGENTS.md](AGENTS.md) before changing code.
- Keep changes focused and follow existing patterns.
- Do not commit secrets, generated build output, or `local-config/`.
- Preserve the project's personal-use, attribution, and non-commercial license requirements.
- Update relevant documentation when behavior or setup changes.
- Keep configuration migrations backward-compatible. When changing a configuration shape, update the migration manager and add the required transition.
- Use clear commit messages and describe user-visible changes in pull requests.

## Templates

Content pages are loaded from `templates/` based on the `template` value in the core configuration. Each template folder mirrors the app route structure with `page.content.tsx` and optional `page.module.css` per route.

### Server vs Client templates

Templates can be either server or client components. The app checks for a `"use client"` directive at the top of each `page.content.tsx`:

- **Server components** (no directive) — statically imported. Recommended for static export and better performance.
- **Client components** (`"use client"` directive) — dynamically imported via `next/dynamic`.

### Adding a new template

1. Run `pnpm mktemp <name>` to scaffold a new template folder and copy the default structure, or manually create a folder inside `templates/` with a lowercase, hyphenated name and copy `templates/default/` as a starting point.
2. Customize each `page.content.tsx` and its styles. Prefer server components where possible.
3. Add `about.html` to the root of the template folder - it is a standalone HTML page with embedded styles that describes the template and its author.

### Rules

- Each `page.content.tsx` must export a default component `PageContent` typed with `PageContentProps` from the corresponding `page.types.ts`.
- Templates may provide `layout.content.tsx` (typed with `LayoutContentProps`) wrapping all content pages.
- Missing template folders for a route return 404. Setup pages are always active.
- When adding a new route, create the template page in **all** template folders.
- Run `pnpm build` after changes to catch type mismatches.
- Run `pnpm check` to lint, format, and sort imports before submitting.
