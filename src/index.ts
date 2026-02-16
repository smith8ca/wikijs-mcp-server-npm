#!/usr/bin/env node
/**
 * Wiki.js MCP Server - Entry point
 * Connects the MCP server to stdio transport for communication with MCP clients
 */
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

/**
 * Main entry point
 * Initializes and runs the MCP server
 */
async function main(): Promise<void> {
  try {
    // Create the MCP server
    const server = createServer();

    // Create stdio transport for MCP protocol communication
    const transport = new StdioServerTransport();

    // Connect server to transport
    await server.connect(transport);

    // Log to stderr (stdout is used for MCP protocol)
    console.error('Wiki.js MCP Server running on stdio');
    console.error('Ready to accept MCP protocol messages');
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
