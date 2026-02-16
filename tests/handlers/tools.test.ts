/**
 * Tests for tool handlers
 */
import { describe, it, expect } from '@jest/globals';
import { toolDefinitions } from '../../src/handlers/tools.js';

describe('Tool Handlers', () => {
  it('should have all 12 tool definitions', () => {
    const toolNames = Object.keys(toolDefinitions);
    expect(toolNames).toHaveLength(12);
    expect(toolNames).toContain('search_pages');
    expect(toolNames).toContain('list_pages');
    expect(toolNames).toContain('get_page');
    expect(toolNames).toContain('create_page');
    expect(toolNames).toContain('update_page');
    expect(toolNames).toContain('delete_page');
    expect(toolNames).toContain('get_page_tree');
    expect(toolNames).toContain('get_page_tags');
    expect(toolNames).toContain('add_page_tags');
    expect(toolNames).toContain('remove_page_tags');
    expect(toolNames).toContain('search_by_tags');
    expect(toolNames).toContain('list_all_tags');
  });

  it('should have valid schemas for all tools', () => {
    for (const [name, definition] of Object.entries(toolDefinitions)) {
      expect(definition.description).toBeDefined();
      expect(definition.description.length).toBeGreaterThan(0);
      expect(definition.inputSchema).toBeDefined();
    }
  });

  // TODO: Add integration tests with mocked GraphQL client
  // - Test each tool handler with mock data
  // - Test error handling
  // - Test input validation
});
