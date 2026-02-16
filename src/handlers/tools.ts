/**
 * MCP tool handlers for Wiki.js operations
 * Implements all 12 tools from the Python version
 */
import { z } from 'zod';
import { graphqlClient } from '../graphql/client.js';
import * as queries from '../graphql/queries.js';
import * as mutations from '../graphql/mutations.js';
import {
  formatPageResult,
  formatPageListResult,
  formatSearchResults,
  formatTagsResult,
  buildPageTree,
  formatPageTree,
  formatResponseResult,
} from '../utils/formatters.js';
import type {
  ListPagesResponse,
  GetPageByPathResponse,
  GetPageByIdResponse,
  SearchPagesResponse,
  ListTagsResponse,
  CreatePageResponse,
  UpdatePageResponse,
  DeletePageResponse,
  WikiJsTag,
} from '../types/index.js';

/**
 * Tool definitions with Zod schemas for input validation
 */
export const toolDefinitions = {
  search_pages: {
    description: 'Search for pages in Wiki.js by keyword or phrase',
    inputSchema: z.object({
      query: z.string().describe('The search query text'),
    }),
  },

  list_pages: {
    description: 'List all pages in the Wiki.js instance with metadata',
    inputSchema: z.object({}),
  },

  get_page: {
    description: 'Get the full content of a Wiki.js page by its path',
    inputSchema: z.object({
      path: z.string().describe('The path of the page (e.g., "home" or "docs/api")'),
      locale: z.string().default('en').describe('The locale of the page'),
    }),
  },

  create_page: {
    description: 'Create a new page in Wiki.js',
    inputSchema: z.object({
      path: z.string().describe('The path for the new page'),
      title: z.string().describe('The title of the page'),
      content: z.string().describe('The markdown content of the page'),
      description: z.string().default('').describe('Optional page description'),
      locale: z.string().default('en').describe('The locale of the page'),
      isPublished: z.boolean().default(true).describe('Whether to publish the page'),
    }),
  },

  update_page: {
    description: 'Update an existing Wiki.js page',
    inputSchema: z.object({
      page_id: z.number().int().describe('The ID of the page to update'),
      title: z.string().optional().describe('New title for the page'),
      content: z.string().optional().describe('New content for the page'),
      description: z.string().optional().describe('New description for the page'),
      isPublished: z.boolean().optional().describe('New publication status'),
    }),
  },

  delete_page: {
    description: 'Delete a page from Wiki.js',
    inputSchema: z.object({
      page_id: z.number().int().describe('The ID of the page to delete'),
    }),
  },

  get_page_tree: {
    description: 'Get a hierarchical tree view of all pages in Wiki.js',
    inputSchema: z.object({
      parent: z.string().default('').describe('Optional parent path to filter by'),
      locale: z.string().default('en').describe('The locale to filter by'),
    }),
  },

  get_page_tags: {
    description: 'Get all tags associated with a specific page',
    inputSchema: z.object({
      page_id: z.number().int().describe('The ID of the page'),
    }),
  },

  add_page_tags: {
    description: 'Add tags to a Wiki.js page',
    inputSchema: z.object({
      page_id: z.number().int().describe('The ID of the page'),
      tags: z.array(z.string()).describe('Array of tag names to add'),
    }),
  },

  remove_page_tags: {
    description: 'Remove tags from a Wiki.js page',
    inputSchema: z.object({
      page_id: z.number().int().describe('The ID of the page'),
      tags: z.array(z.string()).describe('Array of tag names to remove'),
    }),
  },

  search_by_tags: {
    description: 'Find pages that have specific tags',
    inputSchema: z.object({
      tags: z.array(z.string()).describe('Array of tag names to search for'),
      locale: z.string().default('en').describe('The locale to filter by'),
    }),
  },

  list_all_tags: {
    description: 'List all tags used across the Wiki.js instance',
    inputSchema: z.object({}),
  },
} as const;

/**
 * Tool handlers - async functions that implement each tool
 */
export const toolHandlers = {
  /**
   * Search for pages by keyword
   */
  async search_pages(
    args: z.infer<typeof toolDefinitions.search_pages.inputSchema>
  ): Promise<string> {
    try {
      const data = await graphqlClient.query<SearchPagesResponse>(
        queries.SEARCH_PAGES,
        { query: args.query }
      );

      const { results, totalHits } = data.pages.search;
      return formatSearchResults(results, totalHits);
    } catch (error) {
      return `Error searching pages: ${error}`;
    }
  },

  /**
   * List all pages
   */
  async list_pages(
    _args: z.infer<typeof toolDefinitions.list_pages.inputSchema>
  ): Promise<string> {
    try {
      const data = await graphqlClient.query<ListPagesResponse>(queries.LIST_PAGES);
      return formatPageListResult(data.pages.list);
    } catch (error) {
      return `Error listing pages: ${error}`;
    }
  },

  /**
   * Get a single page by path
   */
  async get_page(
    args: z.infer<typeof toolDefinitions.get_page.inputSchema>
  ): Promise<string> {
    try {
      const data = await graphqlClient.query<GetPageByPathResponse>(
        queries.GET_PAGE,
        args
      );

      const page = data.pages.singleByPath;

      if (!page) {
        return `Page not found: ${args.path}`;
      }

      return formatPageResult(page);
    } catch (error) {
      return `Error getting page: ${error}`;
    }
  },

  /**
   * Create a new page
   */
  async create_page(
    args: z.infer<typeof toolDefinitions.create_page.inputSchema>
  ): Promise<string> {
    try {
      const variables = {
        path: args.path,
        title: args.title,
        content: args.content,
        description: args.description,
        locale: args.locale,
        isPublished: args.isPublished,
        isPrivate: false,
        editor: 'markdown',
        tags: [],
      };

      const data = await graphqlClient.query<CreatePageResponse>(
        mutations.CREATE_PAGE,
        variables
      );

      const { responseResult, page } = data.pages.create;

      let result = formatResponseResult(
        responseResult.succeeded,
        responseResult.message,
        responseResult.errorCode
      );

      if (page) {
        result += `\n\nCreated page:\n${formatPageResult(page)}`;
      }

      return result;
    } catch (error) {
      return `Error creating page: ${error}`;
    }
  },

  /**
   * Update an existing page
   */
  async update_page(
    args: z.infer<typeof toolDefinitions.update_page.inputSchema>
  ): Promise<string> {
    try {
      // First, fetch the current page to get all fields
      const currentData = await graphqlClient.query<GetPageByIdResponse>(
        queries.GET_PAGE_BY_ID,
        { id: args.page_id }
      );

      const currentPage = currentData.pages.single;

      if (!currentPage) {
        return `Page not found with ID: ${args.page_id}`;
      }

      // Merge current values with updates
      const variables = {
        id: args.page_id,
        title: args.title ?? currentPage.title,
        content: args.content ?? currentPage.content ?? '',
        description: args.description ?? currentPage.description ?? '',
        locale: currentPage.locale ?? 'en',
        path: currentPage.path,
        isPublished: args.isPublished ?? currentPage.isPublished ?? true,
        isPrivate: currentPage.isPrivate ?? false,
        editor: 'markdown',
        tags: currentPage.tags?.map((t) => t.tag) ?? [],
      };

      const data = await graphqlClient.query<UpdatePageResponse>(
        mutations.UPDATE_PAGE,
        variables
      );

      const { responseResult, page } = data.pages.update;

      let result = formatResponseResult(
        responseResult.succeeded,
        responseResult.message,
        responseResult.errorCode
      );

      if (page) {
        result += `\n\nUpdated page:\n${formatPageResult(page)}`;
      }

      return result;
    } catch (error) {
      return `Error updating page: ${error}`;
    }
  },

  /**
   * Delete a page
   */
  async delete_page(
    args: z.infer<typeof toolDefinitions.delete_page.inputSchema>
  ): Promise<string> {
    try {
      const data = await graphqlClient.query<DeletePageResponse>(
        mutations.DELETE_PAGE,
        { id: args.page_id }
      );

      const { responseResult } = data.pages.delete;

      return formatResponseResult(
        responseResult.succeeded,
        responseResult.message,
        responseResult.errorCode
      );
    } catch (error) {
      return `Error deleting page: ${error}`;
    }
  },

  /**
   * Get hierarchical page tree
   */
  async get_page_tree(
    args: z.infer<typeof toolDefinitions.get_page_tree.inputSchema>
  ): Promise<string> {
    try {
      const data = await graphqlClient.query<ListPagesResponse>(queries.LIST_PAGES);
      const pages = data.pages.list;

      // Filter by locale if specified
      const filteredPages =
        args.locale === 'en'
          ? pages
          : pages.filter((p) => p.locale === args.locale);

      // Build tree
      const tree = buildPageTree(filteredPages, args.parent);

      // Format tree for display
      const formatted = formatPageTree(tree);

      return `Page Tree:\n\n${formatted}`;
    } catch (error) {
      return `Error getting page tree: ${error}`;
    }
  },

  /**
   * Get tags for a specific page
   */
  async get_page_tags(
    args: z.infer<typeof toolDefinitions.get_page_tags.inputSchema>
  ): Promise<string> {
    try {
      const data = await graphqlClient.query<GetPageByIdResponse>(
        queries.GET_PAGE_BY_ID,
        { id: args.page_id }
      );

      const page = data.pages.single;

      if (!page) {
        return `Page not found with ID: ${args.page_id}`;
      }

      const tags = page.tags || [];

      return `Tags for page "${page.title}" (${page.path}):\n\n${formatTagsResult(tags)}`;
    } catch (error) {
      return `Error getting page tags: ${error}`;
    }
  },

  /**
   * Add tags to a page
   */
  async add_page_tags(
    args: z.infer<typeof toolDefinitions.add_page_tags.inputSchema>
  ): Promise<string> {
    try {
      // First, fetch the current page
      const currentData = await graphqlClient.query<GetPageByIdResponse>(
        queries.GET_PAGE_BY_ID,
        { id: args.page_id }
      );

      const currentPage = currentData.pages.single;

      if (!currentPage) {
        return `Page not found with ID: ${args.page_id}`;
      }

      // Get existing tags and merge with new ones (remove duplicates)
      const existingTags = currentPage.tags?.map((t) => t.tag) ?? [];
      const allTags = Array.from(new Set([...existingTags, ...args.tags]));

      // Update the page with merged tags
      const variables = {
        id: args.page_id,
        title: currentPage.title,
        content: currentPage.content ?? '',
        description: currentPage.description ?? '',
        locale: currentPage.locale ?? 'en',
        path: currentPage.path,
        isPublished: currentPage.isPublished ?? true,
        isPrivate: currentPage.isPrivate ?? false,
        editor: 'markdown',
        tags: allTags,
      };

      const data = await graphqlClient.query<UpdatePageResponse>(
        mutations.UPDATE_PAGE,
        variables
      );

      const { responseResult } = data.pages.update;

      let result = formatResponseResult(
        responseResult.succeeded,
        `Added ${args.tags.length} tag(s)`,
        responseResult.errorCode
      );

      result += `\n\nNew tags: ${allTags.join(', ')}`;

      return result;
    } catch (error) {
      return `Error adding tags: ${error}`;
    }
  },

  /**
   * Remove tags from a page
   */
  async remove_page_tags(
    args: z.infer<typeof toolDefinitions.remove_page_tags.inputSchema>
  ): Promise<string> {
    try {
      // First, fetch the current page
      const currentData = await graphqlClient.query<GetPageByIdResponse>(
        queries.GET_PAGE_BY_ID,
        { id: args.page_id }
      );

      const currentPage = currentData.pages.single;

      if (!currentPage) {
        return `Page not found with ID: ${args.page_id}`;
      }

      // Get existing tags and remove specified ones
      const existingTags = currentPage.tags?.map((t) => t.tag) ?? [];
      const remainingTags = existingTags.filter((t) => !args.tags.includes(t));

      // Update the page with remaining tags
      const variables = {
        id: args.page_id,
        title: currentPage.title,
        content: currentPage.content ?? '',
        description: currentPage.description ?? '',
        locale: currentPage.locale ?? 'en',
        path: currentPage.path,
        isPublished: currentPage.isPublished ?? true,
        isPrivate: currentPage.isPrivate ?? false,
        editor: 'markdown',
        tags: remainingTags,
      };

      const data = await graphqlClient.query<UpdatePageResponse>(
        mutations.UPDATE_PAGE,
        variables
      );

      const { responseResult } = data.pages.update;

      let result = formatResponseResult(
        responseResult.succeeded,
        `Removed ${args.tags.length} tag(s)`,
        responseResult.errorCode
      );

      result += `\n\nRemaining tags: ${remainingTags.length > 0 ? remainingTags.join(', ') : 'None'}`;

      return result;
    } catch (error) {
      return `Error removing tags: ${error}`;
    }
  },

  /**
   * Search for pages by tags
   */
  async search_by_tags(
    args: z.infer<typeof toolDefinitions.search_by_tags.inputSchema>
  ): Promise<string> {
    try {
      // Get all pages
      const data = await graphqlClient.query<ListPagesResponse>(queries.LIST_PAGES);
      const pages = data.pages.list;

      // For each page, fetch its tags and check if it matches
      const matchingPages = [];

      for (const page of pages) {
        const pageData = await graphqlClient.query<GetPageByIdResponse>(
          queries.GET_PAGE_BY_ID,
          { id: page.id }
        );

        const fullPage = pageData.pages.single;

        if (!fullPage) continue;

        const pageTags = fullPage.tags?.map((t) => t.tag) ?? [];

        // Check if page has any of the requested tags
        const hasMatchingTag = args.tags.some((tag) => pageTags.includes(tag));

        if (hasMatchingTag) {
          matchingPages.push({
            ...fullPage,
            tags: fullPage.tags,
          });
        }
      }

      if (matchingPages.length === 0) {
        return `No pages found with tags: ${args.tags.join(', ')}`;
      }

      const lines = [
        `Found ${matchingPages.length} page(s) with tags [${args.tags.join(', ')}]:`,
        '',
      ];

      for (const page of matchingPages) {
        lines.push(`### ${page.title}`);
        lines.push(`- **Path:** ${page.path}`);
        lines.push(`- **ID:** ${page.id}`);

        if (page.description) {
          lines.push(`- **Description:** ${page.description}`);
        }

        if (page.tags && page.tags.length > 0) {
          const tagList = page.tags.map((t: WikiJsTag) => t.tag).join(', ');
          lines.push(`- **Tags:** ${tagList}`);
        }

        lines.push('');
      }

      return lines.join('\n');
    } catch (error) {
      return `Error searching by tags: ${error}`;
    }
  },

  /**
   * List all tags in the wiki
   */
  async list_all_tags(
    _args: z.infer<typeof toolDefinitions.list_all_tags.inputSchema>
  ): Promise<string> {
    try {
      const data = await graphqlClient.query<ListTagsResponse>(queries.LIST_TAGS);
      const tags = data.pages.tags;

      return formatTagsResult(tags);
    } catch (error) {
      return `Error listing tags: ${error}`;
    }
  },
} as const;
