# CLAUDE.md — wikijs-mcp-server-npm

This file provides guidance for AI coding assistants working in this repository.

## Project Overview

`@smith8ca/wikijs-mcp-server` is a TypeScript/Node.js [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that gives AI assistants programmatic access to [Wiki.js](https://js.wiki/) instances via the GraphQL API.

- **Language**: TypeScript (strict mode), ES2022 modules
- **Runtime**: Node.js ≥ 18
- **Package name**: `@smith8ca/wikijs-mcp-server`
- **Entry point**: `dist/index.js` (compiled from `src/index.ts`)

## Common Commands

```bash
npm run build        # Compile TypeScript → dist/
npm run dev          # Dev mode with auto-reload (tsx watch)
npm start            # Run compiled server
npm test             # Run Jest test suite
npm run test:watch   # Tests in watch mode
npm run test:coverage # Coverage report
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run type-check   # tsc --noEmit (type check only)
npm run clean        # Remove dist/
```

## Source Layout

```
src/
├── index.ts              # Entry point — starts MCP server
├── server.ts             # MCP server setup and wiring
├── config/
│   └── env.ts            # Zod-validated environment config
├── graphql/
│   ├── client.ts         # Axios-based GraphQL client
│   ├── queries.ts        # Read query definitions
│   └── mutations.ts      # Write mutation definitions
├── handlers/
│   ├── tools.ts          # All 12 MCP tool definitions + handlers
│   └── resources.ts      # MCP resource handlers (wikijs://page/{path})
├── types/
│   ├── wikijs.ts         # Wiki.js entity types
│   └── index.ts          # Type re-exports
└── utils/
    └── formatters.ts     # Output formatting helpers

tests/
├── handlers/             # Tool and resource handler tests
├── graphql/              # GraphQL client tests
└── integration/          # End-to-end tests (require live Wiki.js)
```

## Environment Variables

Copy `.env.example` to `.env`:

```env
WIKIJS_API_URL=http://localhost:3000/graphql   # Required
WIKIJS_API_TOKEN=your_token_here               # Required
WIKIJS_SSL_VERIFY=true                         # Optional, default true
# WIKIJS_CA_BUNDLE=/path/to/ca-bundle.crt      # Optional custom CA
```

## Code Conventions

- **No `any` types** — use proper types or `unknown`
- **Named exports** only — no default exports
- **async/await** over raw promise chains
- **Zod** for all runtime validation (tool inputs, env vars)
- ESLint enforces style — run `npm run lint:fix` before committing
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)

## Testing

Jest with `--experimental-vm-modules` for ESM support. Tests use mocks for the GraphQL client — no live Wiki.js required for unit tests.

```bash
npm test                                # Run all tests
npm test -- handlers/tools.test.ts     # Run a specific file
```

## Git Remotes

- `gitlab` — primary remote (self-hosted GitLab, `gitlab.chuck.prod`)
- `github` — mirror (`github.com/smith8ca/wikijs-mcp-server-npm`)

**Always push to `gitlab` only.** The GitHub remote is a mirror.

## CI/CD Pipeline (`.gitlab-ci.yml`)

Three stages triggered by push to `gitlab`:

| Stage      | Triggers                          | Jobs                          |
|------------|-----------------------------------|-------------------------------|
| `validate` | MRs, default branch, `vX.Y.Z` tags | lint, typecheck, test        |
| `publish`  | `vX.Y.Z` tags only                | build + publish to GitLab npm registry |
| `sonar`    | MRs, default branch               | SonarQube scan (allow_failure) |

**To publish a new version**: bump version in `package.json`, update `CHANGELOG.md`, commit, then push a `vX.Y.Z` tag to `gitlab`. The CI pipeline handles the rest.

## MCP Tools (12)

`search_pages`, `list_pages`, `get_page`, `create_page`, `update_page`, `delete_page`, `get_page_tree`, `get_page_tags`, `add_page_tags`, `remove_page_tags`, `search_by_tags`, `list_all_tags`

All tools are defined in `src/handlers/tools.ts` with Zod input schemas.
