# Portfolio

A configurable portfolio site built with `Next.js` to host with GitHub Pages.

## Configuration migrations

Configuration files are versioned independently in `public/config/`. The build runs
`pnpm migrate-config` before `next build`, so older configuration files are migrated
before Next.js validates or imports them.

When changing a configuration shape, increment its version in
`migrations/configurationMigrationManager.ts` and add a migration for each version transition.
Migrations are applied sequentially, so a file that skips several versions receives
every migration between its stored version and the current version.

## Publish your own portfolio

1. Fork this repository.
2. In the fork, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Edit the JSON files in public/config/, or use the site's **Setup** pages.
4. In the Actions tab, click "I understand my workflows, go ahead and enable them" to allow the GitHub Actions workflow to run.
