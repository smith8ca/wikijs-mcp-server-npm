/**
 * GraphQL mutations for Wiki.js API
 */

/**
 * Create a new page
 */
export const CREATE_PAGE = `
  mutation CreatePage(
    $content: String!
    $description: String!
    $editor: String!
    $isPublished: Boolean!
    $isPrivate: Boolean!
    $locale: String!
    $path: String!
    $tags: [String]!
    $title: String!
  ) {
    pages {
      create(
        content: $content
        description: $description
        editor: $editor
        isPublished: $isPublished
        isPrivate: $isPrivate
        locale: $locale
        path: $path
        tags: $tags
        title: $title
      ) {
        responseResult {
          succeeded
          errorCode
          slug
          message
        }
        page {
          id
          path
          title
          description
          content
          isPublished
          locale
          createdAt
          updatedAt
        }
      }
    }
  }
`;

/**
 * Update an existing page
 */
export const UPDATE_PAGE = `
  mutation UpdatePage(
    $id: Int!
    $content: String!
    $description: String!
    $editor: String!
    $isPublished: Boolean!
    $isPrivate: Boolean!
    $locale: String!
    $path: String!
    $tags: [String]!
    $title: String!
  ) {
    pages {
      update(
        id: $id
        content: $content
        description: $description
        editor: $editor
        isPublished: $isPublished
        isPrivate: $isPrivate
        locale: $locale
        path: $path
        tags: $tags
        title: $title
      ) {
        responseResult {
          succeeded
          errorCode
          slug
          message
        }
        page {
          id
          path
          title
          description
          content
          isPublished
          locale
          updatedAt
        }
      }
    }
  }
`;

/**
 * Delete a page by ID
 */
export const DELETE_PAGE = `
  mutation DeletePage($id: Int!) {
    pages {
      delete(id: $id) {
        responseResult {
          succeeded
          errorCode
          slug
          message
        }
      }
    }
  }
`;
