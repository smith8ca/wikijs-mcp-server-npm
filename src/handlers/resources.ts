/**
 * MCP resource handlers for exposing Wiki.js pages as resources
 */
import type { Resource } from '@modelcontextprotocol/sdk/types.js';
import { graphqlClient } from '../graphql/client.js';
import { LIST_PAGES, GET_PAGE } from '../graphql/queries.js';
import type { ListPagesResponse, GetPageByPathResponse } from '../types/index.js';

/**
 * List all Wiki.js pages as MCP resources
 * Resources are exposed with URIs like wikijs://page/{path}
 */
export async function listResources(): Promise<Resource[]> {
  try {
    const data = await graphqlClient.query<ListPagesResponse>(LIST_PAGES);
    const pages = data.pages.list;

    return pages.map((page) => ({
      uri: `wikijs://page/${page.path}`,
      name: page.title,
      mimeType: 'text/plain',
      description: page.description || `Wiki.js page: ${page.title}`,
    }));
  } catch (error) {
    throw new Error(`Failed to list resources: ${error}`);
  }
}

/**
 * Read a Wiki.js page by its resource URI
 * @param uri Resource URI in format wikijs://page/{path}
 * @returns Page content as text
 */
export async function readResource(uri: string): Promise<string> {
  // Parse the URI to extract the page path
  const match = uri.match(/^wikijs:\/\/page\/(.+)$/);

  if (!match) {
    throw new Error(`Invalid Wiki.js resource URI: ${uri}`);
  }

  const path = match[1];

  try {
    const data = await graphqlClient.query<GetPageByPathResponse>(GET_PAGE, {
      path,
      locale: 'en',
    });

    const page = data.pages.singleByPath;

    if (!page) {
      throw new Error(`Page not found: ${path}`);
    }

    return page.content || '';
  } catch (error) {
    throw new Error(`Failed to read resource ${uri}: ${error}`);
  }
}
