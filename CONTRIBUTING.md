# Contributing

Thanks for helping improve the portfolio project.

## Run it locally

1. Fork the repository.
2. Clone your fork or open it in a GitHub Codespace.
3. Install dependencies with `pnpm install`.
4. Start the development server with `pnpm dev`.
5. Use the ignored `local-config/` folder for development-only configuration. It overrides `public/config/` while `NODE_ENV=development` is active.

The project uses Node.js `26.8.1` and pnpm `12.18.0`. See `package.json` for the supported versions and available scripts.

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
