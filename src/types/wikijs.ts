/**
 * Wiki.js API Type Definitions
 * These types represent the structure of data returned from Wiki.js GraphQL API
 */

/**
 * Represents a Wiki.js page
 */
export interface WikiJsPage {
  id: number;
  path: string;
  title: string;
  description?: string;
  content?: string;
  isPublished?: boolean;
  isPrivate?: boolean;
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: WikiJsTag[];
}

/**
 * Represents a Wiki.js tag
 */
export interface WikiJsTag {
  id: number;
  tag: string;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Search result from Wiki.js
 */
export interface WikiJsSearchResult {
  results: WikiJsPage[];
  totalHits: number;
}

/**
 * Standard response result from Wiki.js mutations
 */
export interface WikiJsResponseResult {
  succeeded: boolean;
  errorCode?: number;
  slug?: string;
  message?: string;
}

/**
 * Response from creating a page
 */
export interface CreatePageResponse {
  pages: {
    create: {
      responseResult: WikiJsResponseResult;
      page?: WikiJsPage;
    };
  };
}

/**
 * Response from updating a page
 */
export interface UpdatePageResponse {
  pages: {
    update: {
      responseResult: WikiJsResponseResult;
      page?: WikiJsPage;
    };
  };
}

/**
 * Response from deleting a page
 */
export interface DeletePageResponse {
  pages: {
    delete: {
      responseResult: WikiJsResponseResult;
    };
  };
}

/**
 * Response from listing pages
 */
export interface ListPagesResponse {
  pages: {
    list: WikiJsPage[];
  };
}

/**
 * Response from getting a single page by path
 */
export interface GetPageByPathResponse {
  pages: {
    singleByPath?: WikiJsPage;
  };
}

/**
 * Response from getting a single page by ID
 */
export interface GetPageByIdResponse {
  pages: {
    single?: WikiJsPage;
  };
}

/**
 * Response from searching pages
 */
export interface SearchPagesResponse {
  pages: {
    search: WikiJsSearchResult;
  };
}

/**
 * Response from listing tags
 */
export interface ListTagsResponse {
  pages: {
    tags: WikiJsTag[];
  };
}

/**
 * Page tree node for hierarchical display
 */
export interface PageTreeNode {
  path: string;
  title?: string;
  isPage: boolean;
  children: PageTreeNode[];
}
