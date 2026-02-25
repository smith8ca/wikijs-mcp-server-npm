# Wiki.js MCP Server

![Chuckworks](https://shields.chuck.prod/badge/Chuckworks-darkgreen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js >= 22](https://img.shields.io/badge/Node.js-%3E%3D22-brightgreen.svg)](https://nodejs.org)

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that provides AI assistants like Claude with programmatic access to [Wiki.js](https://js.wiki/) instances. Built with TypeScript and Node.js.

- [Features](#features)
  - [MCP Tools (12 total)](#mcp-tools-12-total)
  - [MCP Resources](#mcp-resources)
- [Requirements](#requirements)
- [Installation](#installation)
  - [Local Installation](#local-installation)
  - [Docker Installation](#docker-installation)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
  - [Getting a Wiki.js API Token](#getting-a-wikijs-api-token)
  - [SSL Configuration](#ssl-configuration)
- [Usage](#usage)
  - [Running Locally](#running-locally)
  - [Integration with MCP Clients](#integration-with-mcp-clients)
    - [Claude Desktop](#claude-desktop)
    - [VS Code with Continue](#vs-code-with-continue)
    - [VS Code with Cline](#vs-code-with-cline)
  - [Docker Usage](#docker-usage)
- [Development](#development)
  - [Project Structure](#project-structure)
  - [Available Scripts](#available-scripts)
  - [Running Tests](#running-tests)
  - [Adding New Tools](#adding-new-tools)
- [Tool Reference](#tool-reference)
  - [search\_pages](#search_pages)
  - [list\_pages](#list_pages)
  - [get\_page](#get_page)
  - [create\_page](#create_page)
  - [update\_page](#update_page)
  - [delete\_page](#delete_page)
  - [get\_page\_tree](#get_page_tree)
  - [get\_page\_tags](#get_page_tags)
  - [add\_page\_tags](#add_page_tags)
  - [remove\_page\_tags](#remove_page_tags)
  - [search\_by\_tags](#search_by_tags)
  - [list\_all\_tags](#list_all_tags)
- [Troubleshooting](#troubleshooting)
  - [Connection Issues](#connection-issues)
  - [Authentication Issues](#authentication-issues)
  - [SSL Certificate Issues](#ssl-certificate-issues)
  - [Build Issues](#build-issues)
  - [Server Not Starting](#server-not-starting)
- [Contributing](#contributing)
- [License](#license)
- [Related Projects](#related-projects)
- [Support](#support)

&nbsp;

## Features

### MCP Tools (12 total)

- **search_pages** - Search for pages by keyword or phrase
- **list_pages** - List all pages with metadata
- **get_page** - Get full content of a specific page
- **create_page** - Create new markdown pages
- **update_page** - Update existing pages
- **delete_page** - Delete pages
- **get_page_tree** - Get hierarchical page structure
- **get_page_tags** - Get tags for a specific page
- **add_page_tags** - Add tags to a page
- **remove_page_tags** - Remove tags from a page
- **search_by_tags** - Find pages by tags
- **list_all_tags** - List all tags in the wiki

### MCP Resources

- Exposes all Wiki.js pages as MCP resources
- URI format: `wikijs://page/{path}`
- Allows AI assistants to browse and read pages directly

## Requirements

- Node.js 18 or higher
- A running Wiki.js instance
- Wiki.js API token with appropriate permissions

## Installation

### Local Installation

```bash
# Clone the repository
git clone <repository-url>
cd wikijs-mcp-server-npm

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your Wiki.js credentials
# WIKIJS_API_URL=https://your-wiki.com/graphql
# WIKIJS_API_TOKEN=your_api_token

# Build the project
npm run build
```

### Docker Installation

```bash
# Build the Docker image
docker-compose build

# Or pull from registry (if published)
docker pull wikijs-mcp-server:latest
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Required
WIKIJS_API_URL=http://localhost:3000/graphql
WIKIJS_API_TOKEN=your_api_token_here

# Optional
WIKIJS_SSL_VERIFY=true
# WIKIJS_CA_BUNDLE=/path/to/ca-bundle.crt
```

### Getting a Wiki.js API Token

1. Log into your Wiki.js instance as an administrator
2. Go to **Administration** → **API Access**
3. Click **New API Key**
4. Give it a name and select appropriate permissions:
   - **Read:Pages** (required)
   - **Write:Pages** (required for create/update/delete)
5. Copy the generated token to your `.env` file

### SSL Configuration

**Default**: Standard SSL certificate validation

**Disable SSL verification** (testing only):

```env
WIKIJS_SSL_VERIFY=false
```

**Custom CA certificate**:

```env
WIKIJS_CA_BUNDLE=/path/to/your/ca-bundle.crt
```

## Usage

### Running Locally

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### Integration with MCP Clients

#### Claude Desktop

Add to your `claude_desktop_config.json`:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "wikijs": {
      "command": "node",
      "args": ["/absolute/path/to/wikijs-mcp-server-npm/dist/index.js"],
      "env": {
        "WIKIJS_API_URL": "http://localhost:3000/graphql",
        "WIKIJS_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

#### VS Code with Continue

Add to `.continue/config.json`:

```json
{
  "mcpServers": [
    {
      "name": "wikijs",
      "command": "node",
      "args": ["/absolute/path/to/wikijs-mcp-server-npm/dist/index.js"],
      "env": {
        "WIKIJS_API_URL": "http://localhost:3000/graphql",
        "WIKIJS_API_TOKEN": "your_token_here"
      }
    }
  ]
}
```

#### VS Code with Cline

1. Open Cline settings
2. Go to **MCP Servers**
3. Add new server with:
   - Command: `node`
   - Args: `/absolute/path/to/wikijs-mcp-server-npm/dist/index.js`
   - Environment variables as above

### Docker Usage

```bash
# Using docker-compose
docker-compose up

# Or run directly
docker run -i --rm \
  -e WIKIJS_API_URL="https://your-wiki.com/graphql" \
  -e WIKIJS_API_TOKEN="your_token" \
  wikijs-mcp-server:latest
```

## Development

### Project Structure

```
wikijs-mcp-server-npm/
├── src/
│   ├── index.ts              # Entry point
│   ├── server.ts             # MCP server setup
│   ├── config/
│   │   └── env.ts           # Environment configuration
│   ├── graphql/
│   │   ├── client.ts        # GraphQL client
│   │   ├── queries.ts       # Query definitions
│   │   └── mutations.ts     # Mutation definitions
│   ├── handlers/
│   │   ├── tools.ts         # Tool implementations
│   │   └── resources.ts     # Resource implementations
│   ├── types/
│   │   ├── wikijs.ts        # Type definitions
│   │   └── index.ts         # Type exports
│   └── utils/
│       └── formatters.ts    # Formatting utilities
├── tests/                    # Test files
├── package.json
├── tsconfig.json
└── README.md
```

### Available Scripts

```bash
npm run build        # Compile TypeScript to JavaScript
npm run dev          # Run in development mode with auto-reload
npm start            # Run compiled server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run type-check   # Check types without compiling
npm run lint         # Lint code
npm run lint:fix     # Fix linting issues
npm run clean        # Remove build artifacts
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### Adding New Tools

1. Define the tool in `src/handlers/tools.ts`:
   - Add to `toolDefinitions` with Zod schema
   - Implement handler in `toolHandlers`

2. If needed, add new GraphQL queries/mutations in:
   - `src/graphql/queries.ts`
   - `src/graphql/mutations.ts`

3. Add tests in `tests/handlers/tools.test.ts`

## Tool Reference

### search_pages

Search for pages by keyword or phrase.

**Input**:

- `query` (string, required): Search query text

**Example**:

```json
{
  "query": "authentication"
}
```

### list_pages

List all pages in the wiki with metadata.

**Input**: None

### get_page

Get the full content of a specific page.

**Input**:

- `path` (string, required): Page path (e.g., "home" or "docs/api")
- `locale` (string, optional): Locale code (default: "en")

**Example**:

```json
{
  "path": "docs/getting-started",
  "locale": "en"
}
```

### create_page

Create a new markdown page.

**Input**:

- `path` (string, required): Path for the new page
- `title` (string, required): Page title
- `content` (string, required): Markdown content
- `description` (string, optional): Page description
- `locale` (string, optional): Locale code (default: "en")
- `isPublished` (boolean, optional): Publish immediately (default: true)

### update_page

Update an existing page.

**Input**:

- `page_id` (number, required): ID of the page to update
- `title` (string, optional): New title
- `content` (string, optional): New content
- `description` (string, optional): New description
- `isPublished` (boolean, optional): New publication status

### delete_page

Delete a page.

**Input**:

- `page_id` (number, required): ID of the page to delete

### get_page_tree

Get a hierarchical tree view of all pages.

**Input**:

- `parent` (string, optional): Parent path to filter by
- `locale` (string, optional): Locale to filter by (default: "en")

### get_page_tags

Get all tags associated with a page.

**Input**:

- `page_id` (number, required): ID of the page

### add_page_tags

Add tags to a page.

**Input**:

- `page_id` (number, required): ID of the page
- `tags` (array of strings, required): Tag names to add

### remove_page_tags

Remove tags from a page.

**Input**:

- `page_id` (number, required): ID of the page
- `tags` (array of strings, required): Tag names to remove

### search_by_tags

Find pages that have specific tags.

**Input**:

- `tags` (array of strings, required): Tag names to search for
- `locale` (string, optional): Locale to filter by (default: "en")

### list_all_tags

List all tags used in the wiki.

**Input**: None

## Troubleshooting

### Connection Issues

**Error**: "Failed to connect to Wiki.js API"

- Verify `WIKIJS_API_URL` is correct and accessible
- Check that Wiki.js is running
- Ensure network connectivity

### Authentication Issues

**Error**: "GraphQL Error: Unauthorized"

- Verify `WIKIJS_API_TOKEN` is correct
- Check token hasn't expired
- Ensure token has required permissions

### SSL Certificate Issues

**Error**: "SSL certificate verification failed"

Solutions:

1. Use valid SSL certificate on Wiki.js
2. Provide custom CA bundle: `WIKIJS_CA_BUNDLE=/path/to/cert`
3. Disable verification (testing only): `WIKIJS_SSL_VERIFY=false`

### Build Issues

**Error**: "Cannot find module" or type errors

```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

### Server Not Starting

Check logs for specific errors:

```bash
npm start 2>&1 | tee server.log
```

Common issues:

- Missing `.env` file - copy from `.env.example`
- Invalid environment variables - check Zod validation errors
- Port conflicts - ensure stdio is available

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run `npm run lint` and `npm test`
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Related Projects

- [Model Context Protocol](https://modelcontextprotocol.io)
- [Wiki.js](https://js.wiki/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## Support

For issues and questions:

- Open an issue on GitHub
- Check Wiki.js documentation
- Review MCP protocol documentation
