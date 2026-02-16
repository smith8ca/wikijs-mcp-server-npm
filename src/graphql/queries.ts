/**
 * GraphQL queries for Wiki.js API
 */

/**
 * List all pages with basic metadata
 */
export const LIST_PAGES = `
  query {
    pages {
      list {
        id
        path
        title
        description
        isPublished
        updatedAt
      }
    }
  }
`;

/**
 * Get a single page by path and locale
 */
export const GET_PAGE = `
  query GetPage($path: String!, $locale: String!) {
    pages {
      singleByPath(path: $path, locale: $locale) {
        id
        path
        title
        description
        content
        isPublished
        isPrivate
        locale
        createdAt
        updatedAt
      }
    }
  }
`;

/**
 * Get a single page by ID
 */
export const GET_PAGE_BY_ID = `
  query GetPageById($id: Int!) {
    pages {
      single(id: $id) {
        id
        path
        title
        description
        content
        isPublished
        isPrivate
        locale
        createdAt
        updatedAt
        tags {
          id
          tag
          title
        }
      }
    }
  }
`;

/**
 * Search pages by query string
 */
export const SEARCH_PAGES = `
  query SearchPages($query: String!) {
    pages {
      search(query: $query) {
        results {
          id
          path
          title
          description
        }
        totalHits
      }
    }
  }
`;

/**
 * List all tags
 */
export const LIST_TAGS = `
  query {
    pages {
      tags {
        id
        tag
        title
        createdAt
        updatedAt
      }
    }
  }
`;
