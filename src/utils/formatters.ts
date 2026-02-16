/**
 * Response formatting utilities for MCP tool outputs
 */
import type {
  WikiJsPage,
  WikiJsTag,
  PageTreeNode,
} from '../types/index.js';

/**
 * Format a single page result for display
 */
export function formatPageResult(page: WikiJsPage): string {
  const lines = [
    `# ${page.title}`,
    '',
    `**Path:** ${page.path}`,
    `**ID:** ${page.id}`,
  ];

  if (page.description) {
    lines.push(`**Description:** ${page.description}`);
  }

  if (page.locale) {
    lines.push(`**Locale:** ${page.locale}`);
  }

  if (page.isPublished !== undefined) {
    lines.push(`**Published:** ${page.isPublished ? 'Yes' : 'No'}`);
  }

  if (page.createdAt) {
    lines.push(`**Created:** ${page.createdAt}`);
  }

  if (page.updatedAt) {
    lines.push(`**Updated:** ${page.updatedAt}`);
  }

  if (page.content) {
    lines.push('', '## Content', '', page.content);
  }

  return lines.join('\n');
}

/**
 * Format page list results for display
 */
export function formatPageListResult(pages: WikiJsPage[]): string {
  if (pages.length === 0) {
    return 'No pages found.';
  }

  const lines = [`Found ${pages.length} page(s):`, ''];

  for (const page of pages) {
    lines.push(`### ${page.title}`);
    lines.push(`- **Path:** ${page.path}`);
    lines.push(`- **ID:** ${page.id}`);

    if (page.description) {
      lines.push(`- **Description:** ${page.description}`);
    }

    if (page.isPublished !== undefined) {
      lines.push(`- **Published:** ${page.isPublished ? 'Yes' : 'No'}`);
    }

    if (page.updatedAt) {
      lines.push(`- **Updated:** ${page.updatedAt}`);
    }

    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Format search results for display
 */
export function formatSearchResults(
  results: WikiJsPage[],
  totalHits: number
): string {
  if (results.length === 0) {
    return 'No results found.';
  }

  const lines = [`Found ${totalHits} result(s):`, ''];

  for (const page of results) {
    lines.push(`### ${page.title}`);
    lines.push(`- **Path:** ${page.path}`);
    lines.push(`- **ID:** ${page.id}`);

    if (page.description) {
      lines.push(`- **Description:** ${page.description}`);
    }

    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Format tags result for display
 */
export function formatTagsResult(tags: WikiJsTag[]): string {
  if (tags.length === 0) {
    return 'No tags found.';
  }

  const lines = [`Found ${tags.length} tag(s):`, ''];

  for (const tag of tags) {
    lines.push(`- **${tag.title || tag.tag}** (ID: ${tag.id})`);

    if (tag.createdAt) {
      lines.push(`  - Created: ${tag.createdAt}`);
    }

    if (tag.updatedAt) {
      lines.push(`  - Updated: ${tag.updatedAt}`);
    }
  }

  return lines.join('\n');
}

/**
 * Build a hierarchical page tree from a flat list of pages
 */
export function buildPageTree(
  pages: WikiJsPage[],
  parentPath: string = ''
): PageTreeNode[] {
  const tree: PageTreeNode[] = [];
  const pathMap = new Map<string, PageTreeNode>();

  // Sort pages by path for consistent ordering
  const sortedPages = [...pages].sort((a, b) => a.path.localeCompare(b.path));

  // Build the tree structure
  for (const page of sortedPages) {
    const parts = page.path.split('/').filter((p) => p.length > 0);
    let currentPath = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const previousPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      // Skip if this path doesn't match the parent filter
      if (parentPath && !currentPath.startsWith(parentPath)) {
        continue;
      }

      // Check if this node already exists
      if (!pathMap.has(currentPath)) {
        const isPage = i === parts.length - 1;
        const node: PageTreeNode = {
          path: currentPath,
          title: isPage ? page.title : part,
          isPage,
          children: [],
        };

        pathMap.set(currentPath, node);

        // Add to parent's children or root
        if (previousPath && pathMap.has(previousPath)) {
          pathMap.get(previousPath)!.children.push(node);
        } else if (!previousPath) {
          tree.push(node);
        }
      }
    }
  }

  return tree;
}

/**
 * Format page tree for display with indentation
 */
export function formatPageTree(
  tree: PageTreeNode[],
  indent: number = 0
): string {
  const lines: string[] = [];
  const prefix = '  '.repeat(indent);

  for (const node of tree) {
    const icon = node.isPage ? '📄' : '📁';
    const title = node.title || node.path.split('/').pop() || node.path;
    lines.push(`${prefix}${icon} ${title}`);

    if (node.children.length > 0) {
      lines.push(formatPageTree(node.children, indent + 1));
    }
  }

  return lines.join('\n');
}

/**
 * Format a response result (success/error) from mutations
 */
export function formatResponseResult(
  succeeded: boolean,
  message?: string,
  errorCode?: number
): string {
  if (succeeded) {
    return `✓ Success${message ? `: ${message}` : ''}`;
  } else {
    return `✗ Failed${errorCode ? ` (Error ${errorCode})` : ''}${
      message ? `: ${message}` : ''
    }`;
  }
}
