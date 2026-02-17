# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Comprehensive CONTRIBUTING.md with contribution guidelines
  - Development environment setup for TypeScript/Node.js
  - Code style guidelines and ESLint best practices
  - Testing guidelines with Jest examples
  - Pull request process and templates
  - Community guidelines and code of conduct

## [1.0.0] - 2026-02-16

### Added

- **Complete TypeScript/Node.js MCP Server** for Wiki.js
  - Built with TypeScript, Node.js 18+, and MCP SDK
  - Full type safety with strict TypeScript configuration
  - ES2022 module support with ESM imports/exports

- **12 MCP Tools** for comprehensive Wiki.js interaction:
  - `search_pages` - Search pages by keyword with full-text search
  - `list_pages` - List all pages with complete metadata
  - `get_page` - Retrieve full page content by path
  - `create_page` - Create new markdown pages with customization
  - `update_page` - Update existing pages (title, content, description)
  - `delete_page` - Delete pages by ID
  - `get_page_tree` - Get hierarchical page structure
  - `get_page_tags` - Retrieve tags for specific pages
  - `add_page_tags` - Add multiple tags to pages
  - `remove_page_tags` - Remove tags from pages
  - `search_by_tags` - Find pages by tag criteria
  - `list_all_tags` - List all tags used in the wiki

- **MCP Resources** for AI assistant integration:
  - Exposes all Wiki.js pages as browsable MCP resources
  - URI format: `wikijs://page/{path}`
  - Enables direct page access for AI assistants

- **GraphQL Client Integration**:
  - Robust GraphQL client with Axios
  - Complete query definitions for all read operations
  - Complete mutation definitions for all write operations
  - Comprehensive error handling and validation

- **Input Validation** with Zod:
  - Runtime type validation for all tool inputs
  - Automatic schema generation from Zod definitions
  - Clear error messages for invalid inputs

- **Environment Configuration**:
  - `.env.example` template with all configuration options
  - Environment variable validation with Zod
  - Support for custom SSL/TLS certificates
  - SSL verification toggle for development

- **Docker Support**:
  - Dockerfile with multi-stage build for optimized images
  - docker-compose.yml for easy deployment
  - .dockerignore for efficient builds
  - Environment variable configuration in containers

- **TypeScript Project Structure**:
  - Modular architecture with clear separation of concerns:
    - `src/config/` - Environment configuration
    - `src/graphql/` - GraphQL client, queries, mutations
    - `src/handlers/` - Tool and resource handlers
    - `src/types/` - TypeScript type definitions
    - `src/utils/` - Utility functions and formatters
  - Organized handler structure for maintainability
  - Comprehensive type definitions for Wiki.js entities

- **Testing Infrastructure**:
  - Jest testing framework with TypeScript support
  - Test structure for all major components:
    - `tests/graphql/` - GraphQL client tests
    - `tests/handlers/` - Tool and resource handler tests
    - `tests/integration/` - End-to-end integration tests
  - Watch mode and coverage reporting
  - ES modules support in Jest configuration

- **Development Tools**:
  - ESLint configuration for code quality
  - TypeScript strict mode configuration
  - Auto-reload development mode with tsx
  - Source maps for debugging
  - Declaration files generation

- **Documentation**:
  - Comprehensive README.md with:
    - Complete installation instructions (local and Docker)
    - Configuration guide with environment variables
    - Tool reference with examples for all 12 tools
    - Integration guides for Claude Desktop, Continue, and Cline
    - Troubleshooting section for common issues
  - Inline JSDoc comments for all public APIs
  - Type documentation in TypeScript interfaces

- **Build Scripts**:
  - `build` - TypeScript compilation to JavaScript
  - `dev` - Development mode with auto-reload
  - `start` - Production server execution
  - `test` - Run Jest test suite
  - `test:watch` - Watch mode for tests
  - `test:coverage` - Generate coverage reports
  - `lint` - ESLint code checking
  - `lint:fix` - Auto-fix linting issues
  - `type-check` - Type checking without compilation
  - `clean` - Remove build artifacts

- **Dependencies**:
  - `@modelcontextprotocol/sdk` ^1.0.4 - MCP protocol implementation
  - `axios` ^1.7.9 - HTTP client for GraphQL requests
  - `dotenv` ^16.4.7 - Environment variable management
  - `zod` ^3.24.1 - Runtime type validation

- **Development Dependencies**:
  - TypeScript 5.7.2 with strict configuration
  - Jest 29.7.0 with ts-jest for testing
  - ESLint 9.18.0 with TypeScript plugin
  - tsx 4.19.2 for development server
  - Complete type definitions for Node.js and Jest

- **MCP Client Configuration Examples**:
  - Claude Desktop configuration (Windows and macOS)
  - VS Code with Continue extension setup
  - VS Code with Cline extension setup
  - Docker-based client configuration

- **Project Infrastructure**:
  - MIT License
  - .gitignore with Node.js and TypeScript patterns
  - Node.js 18+ engine requirement
  - NPM as package manager

### Technical Details

- **Architecture**: Event-driven MCP server using stdio transport
- **Type Safety**: Full TypeScript coverage with strict mode
- **Error Handling**: Comprehensive error handling with descriptive messages
- **Input Validation**: Zod schemas for runtime validation
- **Code Quality**: ESLint with TypeScript-specific rules
- **Testing**: Jest with ES modules support
- **Build Process**: TypeScript compiler with source maps and declarations
- **Module System**: ES2022 modules with Node.js resolution

---

## Version History Summary

- **[1.0.0]** - 2026-02-16 - Initial release with full TypeScript MCP server implementation

## Notes

### Versioning Strategy

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality in a backward compatible manner
- **PATCH** version for backward compatible bug fixes

### Migration from Python Version

This TypeScript implementation provides feature parity with the Python version while adding:

- Stronger type safety with TypeScript
- Better IDE integration and autocomplete
- Native Node.js ecosystem integration
- Improved error handling with Zod validation

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

### Changelog Maintenance

- All notable changes are documented in this file
- Changes are grouped by type: Added, Changed, Deprecated, Removed, Fixed, Security
- Each version includes a release date in YYYY-MM-DD format
- Unreleased changes are tracked at the top of the file

### Upgrade Guides

#### From Python Version to TypeScript Version

If migrating from the Python `wikijs-mcp-server`:

1. **Dependencies**: Install Node.js 18+ and npm (vs Python 3.8+)
2. **Configuration**: Same environment variables (WIKIJS_API_URL, WIKIJS_API_TOKEN)
3. **MCP Client Config**: Change command from `python -m wikijs_mcp_server.wikijs_mcp_server` to `node /path/to/dist/index.js`
4. **Tools**: All 12 tools have identical names and parameters
5. **Resources**: Same URI format (`wikijs://page/{path}`)
6. **Docker**: Similar docker-compose setup with Node.js base image

## Future Roadmap

Potential features for future releases:

- **Additional Tools**:
  - Page history and versioning tools
  - User and group management tools
  - Comment management capabilities
  - Asset and upload management

- **Enhanced Features**:
  - Caching layer for improved performance
  - Batch operations for multiple pages
  - Page move and rename operations
  - Advanced search with filters

- **Developer Experience**:
  - Additional integration examples
  - Performance benchmarks
  - Enhanced error reporting
  - Debugging utilities

- **Testing & Quality**:
  - Increased test coverage (target: 90%+)
  - E2E testing with real Wiki.js instance
  - Performance testing suite
  - CI/CD pipeline integration

[Unreleased]: https://github.com/your-org/wikijs-mcp-server-npm/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/your-org/wikijs-mcp-server-npm/releases/tag/v1.0.0
