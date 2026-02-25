# Contributing to Wiki.js MCP Server

Thank you for your interest in contributing to the Wiki.js MCP Server! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Community](#community)

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect differing viewpoints and experiences
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, trolling, or discriminatory language
- Personal attacks or inflammatory comments
- Publishing others' private information
- Any conduct that would be inappropriate in a professional setting

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** for version control
- A **Wiki.js instance** for testing (or access to one)
- A code editor (we recommend **VS Code** with TypeScript extensions)

### Fork and Clone

1. **Fork the repository** on GitHub/GitLab
2. **Clone your fork** locally:
   ```bash
   git clone <your-fork-url>
   cd wikijs-mcp-server-npm
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/smith8ca/wikijs-mcp-server-npm.git
   ```

## Development Environment

### Initial Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your Wiki.js credentials:

   ```env
   WIKIJS_API_URL=http://localhost:3000/graphql
   WIKIJS_API_TOKEN=your_test_api_token
   WIKIJS_SSL_VERIFY=false  # For local testing
   ```

3. **Build the project**:

   ```bash
   npm run build
   ```

4. **Verify installation**:
   ```bash
   npm start
   ```

### Development Mode

Run the server with auto-reload during development:

```bash
npm run dev
```

This uses `tsx watch` which automatically restarts when you make changes.

### Available Commands

```bash
npm run build          # Compile TypeScript to JavaScript
npm run dev            # Development mode with auto-reload
npm start              # Run the compiled server
npm test               # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Generate test coverage report
npm run lint           # Check code style
npm run lint:fix       # Auto-fix linting issues
npm run type-check     # Type check without building
npm run clean          # Remove build artifacts
```

## Development Workflow

### Branching Strategy

1. **Create a feature branch** from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Branch naming conventions**:
   - `feature/` - New features (e.g., `feature/add-page-versioning`)
   - `fix/` - Bug fixes (e.g., `fix/auth-token-validation`)
   - `docs/` - Documentation updates (e.g., `docs/update-api-reference`)
   - `refactor/` - Code refactoring (e.g., `refactor/graphql-client`)
   - `test/` - Test additions/updates (e.g., `test/add-integration-tests`)
   - `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### Making Changes

1. **Keep changes focused**: One feature or fix per branch
2. **Write tests**: Add tests for new features and bug fixes
3. **Update documentation**: Keep README.md and code comments current
4. **Follow code style**: Run `npm run lint:fix` before committing

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates
- `perf`: Performance improvements
- `ci`: CI/CD pipeline changes

**Examples**:

```bash
# Feature
git commit -m "feat(tools): add page versioning tool"

# Bug fix
git commit -m "fix(auth): handle expired API tokens gracefully"

# Documentation
git commit -m "docs(readme): add Docker installation instructions"

# Multiple paragraphs
git commit -m "feat(resources): add page tree resource handler

Add hierarchical page tree as an MCP resource that can be
browsed by AI assistants. Includes caching for performance.

Closes #123"
```

### Pull Request Workflow

1. **Update your branch** with latest upstream changes:

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run full test suite**:

   ```bash
   npm run lint
   npm run type-check
   npm test
   npm run build
   ```

3. **Push to your fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a pull request** on GitHub/GitLab

## Code Style Guidelines

### TypeScript Best Practices

1. **Use strict type checking**: Enable all strict options in `tsconfig.json`
2. **Avoid `any` type**: Use proper types or `unknown` if needed
3. **Use interfaces for objects**: Define clear interfaces for data structures
4. **Async/await**: Prefer async/await over raw promises
5. **Error handling**: Always handle errors appropriately

**Good Example**:

```typescript
interface PageData {
  id: number;
  path: string;
  title: string;
  content: string;
}

async function getPage(path: string): Promise<PageData> {
  try {
    const response = await graphqlClient.query<PageData>(GET_PAGE, { path });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch page: ${error.message}`);
  }
}
```

**Bad Example**:

```typescript
// Don't do this
function getPage(path: any): any {
  return graphqlClient
    .query(GET_PAGE, { path })
    .then((res: any) => res.data)
    .catch((e: any) => console.log(e)); // Don't just log errors
}
```

### Code Organization

1. **Modular structure**: Keep files focused and under 300 lines
2. **Clear naming**: Use descriptive names for variables, functions, and files
3. **Exports**: Use named exports, avoid default exports
4. **Imports**: Group and order imports logically:

   ```typescript
   // 1. Node.js built-ins
   import { readFileSync } from "fs";

   // 2. External packages
   import { Server } from "@modelcontextprotocol/sdk/server/index.js";
   import axios from "axios";

   // 3. Internal modules
   import { config } from "./config/env.js";
   import { GraphQLClient } from "./graphql/client.js";
   ```

### ESLint Configuration

The project uses ESLint with TypeScript support. Run before committing:

```bash
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix what's possible
```

### Code Comments

- **JSDoc comments** for public functions and classes:

  ```typescript
  /**
   * Search for pages matching a query string.
   * @param query - The search query text
   * @param locale - Optional locale filter (default: "en")
   * @returns Array of matching pages with metadata
   */
  async function searchPages(query: string, locale = "en"): Promise<Page[]> {
    // Implementation
  }
  ```

- **Inline comments** for complex logic:

  ```typescript
  // Cache the page tree for 5 minutes to reduce API load
  const CACHE_TTL = 5 * 60 * 1000;
  ```

- **Don't comment obvious code**:
  ```typescript
  // Bad: counter++  // Increment counter
  // Good: Just write counter++ without comment
  ```

## Testing

### Test Structure

Tests are located in the `tests/` directory and use **Jest**.

```
tests/
├── handlers/
│   ├── tools.test.ts       # Tool handler tests
│   └── resources.test.ts   # Resource handler tests
├── graphql/
│   └── client.test.ts      # GraphQL client tests
└── utils/
    └── formatters.test.ts  # Utility function tests
```

### Writing Tests

1. **Test file naming**: `*.test.ts`
2. **One test file per source file**
3. **Group related tests** with `describe` blocks
4. **Clear test names** that describe the behavior

**Example**:

```typescript
import { searchPages } from "../src/handlers/tools";

describe("searchPages", () => {
  describe("with valid query", () => {
    it("should return matching pages", async () => {
      const result = await searchPages("docker");
      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty("title");
    });
  });

  describe("with empty query", () => {
    it("should throw validation error", async () => {
      await expect(searchPages("")).rejects.toThrow("Query cannot be empty");
    });
  });

  describe("with API error", () => {
    it("should handle connection failures", async () => {
      // Mock API failure
      jest
        .spyOn(graphqlClient, "query")
        .mockRejectedValue(new Error("Network error"));

      await expect(searchPages("test")).rejects.toThrow(
        "Failed to search pages",
      );
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode (re-runs on changes)
npm run test:watch

# Coverage report
npm run test:coverage

# Run specific test file
npm test -- handlers/tools.test.ts
```

### Test Coverage Goals

- **Minimum**: 80% coverage for new code
- **Focus areas**: Tool handlers, GraphQL queries, error handling
- **View coverage**: Open `coverage/lcov-report/index.html` after running coverage

### Integration Testing

For testing with a real Wiki.js instance:

1. Set up test environment variables
2. Use a dedicated test wiki instance
3. Clean up test data after tests

```typescript
describe("Integration: create_page", () => {
  beforeAll(async () => {
    // Setup: Ensure test environment is ready
  });

  afterAll(async () => {
    // Cleanup: Remove test pages
  });

  it("should create and retrieve page", async () => {
    const created = await createPage({
      path: "test",
      title: "Test",
      content: "Content",
    });
    const retrieved = await getPage("test");
    expect(retrieved.title).toBe("Test");
  });
});
```

## Documentation

### What to Document

1. **Code comments**: Complex logic, algorithms, workarounds
2. **Function documentation**: JSDoc for public APIs
3. **README.md**: User-facing documentation, setup instructions
4. **CHANGELOG.md**: All notable changes (see below)

### Updating README.md

When adding new features:

1. Update the **Features** section
2. Add to **Tool Reference** with examples
3. Update **Configuration** if new env vars added
4. Add **Troubleshooting** entry for common issues

### Changelog Maintenance

Follow [Keep a Changelog](https://keepachangelog.com/) format.

Add entries to `CHANGELOG.md` under `[Unreleased]`:

```markdown
## [Unreleased]

### Added

- New `get_page_versions` tool for retrieving page history

### Changed

- Improved error messages for authentication failures

### Fixed

- Fixed pagination issue in `list_pages` tool
```

## Pull Request Process

### Before Submitting

1. **Ensure tests pass**:

   ```bash
   npm run lint
   npm run type-check
   npm test
   npm run build
   ```

2. **Update documentation**: README, CHANGELOG, code comments

3. **Rebase on latest main**:

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

4. **Clean commit history**: Squash work-in-progress commits if needed

### PR Description Template

```markdown
## Description

Brief description of what this PR does and why.

## Type of Change

- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## Changes Made

- Item 1
- Item 2
- Item 3

## Testing

Describe the tests you ran and how to reproduce.

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Code comments added for complex logic
- [ ] Documentation updated (README, CHANGELOG)
- [ ] Tests added/updated
- [ ] All tests pass locally
- [ ] No new warnings from linter or TypeScript
```

### Review Process

1. **Maintainer review**: A project maintainer will review your PR
2. **Feedback**: Address any requested changes
3. **Approval**: Once approved, a maintainer will merge

### After Merge

1. **Delete your branch** (optional):

   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Update your fork**:
   ```bash
   git fetch upstream
   git merge upstream/main
   ```

## Community

### Getting Help

- **Issues**: Browse existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check README.md and code comments

### Reporting Bugs

When reporting bugs, include:

1. **Description**: What happened vs. what you expected
2. **Steps to reproduce**: Minimal steps to trigger the bug
3. **Environment**:
   - Node.js version (`node --version`)
   - npm version (`npm --version`)
   - OS and version
   - Wiki.js version
4. **Logs**: Relevant error messages or logs
5. **Configuration**: Sanitized environment variables

**Example**:

```markdown
## Bug: search_pages returns empty results

**Expected**: Should return pages matching "docker"
**Actual**: Returns empty array

**Steps to Reproduce**:

1. Configure MCP server with valid API token
2. Call `search_pages` tool with query "docker"
3. Observe empty results despite pages existing

**Environment**:

- Node.js: v20.10.0
- npm: 10.2.3
- OS: Ubuntu 22.04
- Wiki.js: 2.5.299

**Logs**:
```

Error: GraphQL query returned null
at searchPages (src/handlers/tools.ts:42)

```

```

### Feature Requests

1. **Check existing issues** to avoid duplicates
2. **Describe the use case**: Why is this feature needed?
3. **Propose a solution**: How should it work?
4. **Consider alternatives**: What other approaches did you think of?

### Adding New Tools

To add a new MCP tool:

1. **Define the tool** in `src/handlers/tools.ts`:

   ```typescript
   export const toolDefinitions = [
     // ... existing tools
     {
       name: "your_new_tool",
       description: "What your tool does",
       inputSchema: zodToJsonSchema(
         z.object({
           param1: z.string().describe("Description of param1"),
           param2: z.number().optional().describe("Optional param2"),
         }),
       ),
     },
   ];
   ```

2. **Implement the handler** in the same file:

   ```typescript
   export const toolHandlers = {
     // ... existing handlers
     your_new_tool: async (args: { param1: string; param2?: number }) => {
       // Implementation
       const result = await someOperation(args.param1);
       return {
         content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
       };
     },
   };
   ```

3. **Add GraphQL queries/mutations** if needed in `src/graphql/`

4. **Write tests** in `tests/handlers/tools.test.ts`

5. **Update documentation** in README.md

### Code Review Guidelines

When reviewing others' code:

- **Be constructive**: Suggest improvements, don't just criticize
- **Be specific**: Point to exact lines, provide examples
- **Be timely**: Respond within a few days if possible
- **Approve when ready**: If minor issues remain, approve and note them

### Recognition

Contributors will be:

- Listed in project contributors
- Mentioned in release notes for significant contributions
- Credited in CHANGELOG.md

---

## Questions?

If you have questions not covered here:

1. Check existing documentation and issues
2. Open a new issue with the `question` label
3. Be patient and respectful - maintainers are volunteers

Thank you for contributing! 🎉
