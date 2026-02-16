/**
 * MCP server setup and configuration
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { toolDefinitions, toolHandlers } from './handlers/tools.js';
import { listResources, readResource } from './handlers/resources.js';

/**
 * Create and configure the MCP server
 */
export function createServer(): Server {
  const server = new Server(
    {
      name: 'wikijs-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  /**
   * Handler: List available tools
   * Returns all 12 Wiki.js tools with their schemas
   */
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools = Object.entries(toolDefinitions).map(([name, definition]) => {
      // Convert Zod schema to JSON Schema for MCP
      const zodShape = definition.inputSchema.shape || {};
      const properties: Record<string, any> = {};
      const required: string[] = [];

      // Build JSON Schema from Zod schema
      for (const [key, value] of Object.entries(zodShape)) {
        const zodField = value as any;

        // Extract description if available
        const description = zodField._def?.description || '';

        // Determine type
        let type = 'string';
        let items;

        if (zodField._def?.typeName === 'ZodString') {
          type = 'string';
        } else if (zodField._def?.typeName === 'ZodNumber') {
          type = 'number';
        } else if (zodField._def?.typeName === 'ZodBoolean') {
          type = 'boolean';
        } else if (zodField._def?.typeName === 'ZodArray') {
          type = 'array';
          items = { type: 'string' };
        } else if (zodField._def?.typeName === 'ZodDefault') {
          // For default values, get the inner type
          const innerType = zodField._def.innerType;
          if (innerType._def?.typeName === 'ZodString') {
            type = 'string';
          } else if (innerType._def?.typeName === 'ZodBoolean') {
            type = 'boolean';
          }
        } else if (zodField._def?.typeName === 'ZodOptional') {
          // For optional fields, get the inner type
          const innerType = zodField._def.innerType;
          if (innerType._def?.typeName === 'ZodString') {
            type = 'string';
          } else if (innerType._def?.typeName === 'ZodNumber') {
            type = 'number';
          } else if (innerType._def?.typeName === 'ZodBoolean') {
            type = 'boolean';
          }
        }

        properties[key] = {
          type,
          description,
          ...(items && { items }),
        };

        // Check if field is required (not optional and not default)
        if (
          zodField._def?.typeName !== 'ZodOptional' &&
          zodField._def?.typeName !== 'ZodDefault'
        ) {
          required.push(key);
        }
      }

      return {
        name,
        description: definition.description,
        inputSchema: {
          type: 'object',
          properties,
          ...(required.length > 0 && { required }),
        },
      };
    });

    return { tools };
  });

  /**
   * Handler: Call a tool
   * Routes to the appropriate tool handler
   */
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    // Get the handler for this tool
    const handler = toolHandlers[name as keyof typeof toolHandlers];

    if (!handler) {
      throw new Error(`Unknown tool: ${name}`);
    }

    try {
      // Validate arguments against schema
      const definition = toolDefinitions[name as keyof typeof toolDefinitions];
      const validatedArgs = definition.inputSchema.parse(args || {});

      // Call the handler
      const result = await handler(validatedArgs as any);

      return {
        content: [
          {
            type: 'text',
            text: result,
          },
        ],
      };
    } catch (error) {
      // Return error as text content
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error}`,
          },
        ],
        isError: true,
      };
    }
  });

  /**
   * Handler: List resources
   * Returns all Wiki.js pages as MCP resources
   */
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    try {
      const resources = await listResources();
      return { resources };
    } catch (error) {
      throw new Error(`Failed to list resources: ${error}`);
    }
  });

  /**
   * Handler: Read resource
   * Fetches and returns page content
   */
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    try {
      const content = await readResource(uri);

      return {
        contents: [
          {
            uri,
            mimeType: 'text/plain',
            text: content,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to read resource: ${error}`);
    }
  });

  return server;
}
