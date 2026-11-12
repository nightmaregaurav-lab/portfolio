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
2. Run `pnpm lint` and, when relevant, `pnpm build`.
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

The portfolio uses a template system to separate visual presentation from configuration and routing. Content pages are loaded from the `templates/` directory based on the `template` value in the core configuration.

### How it works

1. The `template` field in `configuration/core.ts` stores the active template name (default: `"default"`).
2. Each content page in `app/(app)/` uses `next/dynamic` with the `PageContentProps` type from its `page.types.ts` to import the template component:
   ```ts
   import type {PageContentProps} from "./page.types";

   const PageContent = dynamic<PageContentProps>(
     () => import(`@/templates/${CoreConfig.template}/<component-name>/page.content`),
     {ssr: true}
   );
   ```
3. The template folder mirrors the app route structure, containing `page.content.tsx` (client component) and `page.module.css` (styles) for each route.

### Available template pages

The following routes have template content pages:

- `home/page.content.tsx`
- `about/page.content.tsx`
- `blogs/page.content.tsx`
- `blogs/[blogSlug]/page.content.tsx`
- `gallery/page.content.tsx`
- `gallery/[collectionSlug]/page.content.tsx`
- `journey/page.content.tsx`
- `projects/page.content.tsx`
- `projects/[projectSlug]/page.content.tsx`
- `services/page.content.tsx`
- `skills/page.content.tsx`
- `testimonials/page.content.tsx`

### Adding a new template

1. Create a new folder inside `templates/` using a lowercase, hyphenated name (e.g., `templates/minimal/`).
2. Copy the `templates/default/` folder structure into your new template folder as a starting point.
3. Customize the `page.content.tsx` and `page.module.css` files in each route.
4. Set the `template` value in the core configuration via the Setup page at `/setup/core` (dropdown will automatically list available template folders).

**Important rules:**

- Each template page must export a default client component named `PageContent` with `"use client"` directive.
- The `page.content.tsx` template must import and use `PageContentProps` from the app folder:
  ```ts
  import type {PageContentProps} from "@/app/(app)/<route>/page.types";

  function PageContent(props: PageContentProps) {
    // ...
  }
  ```
- If you change the props passed to a template, update `PageContentProps` in `app/(app)/<route>/page.types.ts` — both the app page and all templates use this central type.
- Do not rename or remove `page.content.tsx` files — the dynamic import path is fixed by the app route.
- Dynamic imports require `{ssr: true}` for static generation to work correctly.

### Updating an existing template

- When adding a new route to the app, create the corresponding template page in **all** existing template folders, not just the active one.
- If you change the props passed to a template component from an app page, update the same component across all template folders.
- After changing a template's component interface, verify the build with `pnpm build` to catch type mismatches.
- The Setup page at `/setup/core` reads available templates from the `templates/` directory using `node:fs` — new folders appear automatically in the dropdown.
