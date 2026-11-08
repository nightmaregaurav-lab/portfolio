<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:development-information -->

## Working style

- Keep code and changes consistent, predictable, and easy to review.
- Treat consistency as an important requirement. Before editing, inspect the relevant files and follow their established patterns.
- Keep changes focused on the requested work. Avoid unrelated cleanup, broad rewrites, or new abstractions without a clear need.
- Preserve existing behavior and interfaces unless the request calls for a change.

## Code conventions

- Follow the repository’s instructions and configured formatter, linter, and language conventions.
- Match nearby code for naming, file organization, imports, types, error handling, and comments.
- Prefer existing project patterns over introducing a new style or framework.
- Avoid reformatting untouched code.
- If conventions conflict, follow the most local, well-established pattern and keep the change as small as practical.

## Changes and dependencies

- Make the smallest coherent change that completes the request.
- Do not add dependencies, configuration, generated files, or extra features unless they are needed for the requested work.
- Keep comments focused on non-obvious reasoning or behavior; avoid comments that merely restate the code.

## Verification and reporting

- Follow the user’s instructions about whether to run checks or tests.
- Report clearly what changed and what was or was not verified. Never imply that a check was run if it was not.

<!-- End:development-information -->
