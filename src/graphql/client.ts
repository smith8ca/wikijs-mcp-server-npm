/**
 * GraphQL HTTP client for Wiki.js API
 */
import axios, { AxiosInstance } from 'axios';
import https from 'https';
import fs from 'fs';
import { config } from '../config/env.js';

/**
 * GraphQL error from Wiki.js API
 */
export class GraphQLError extends Error {
  constructor(
    message: string,
    public errors: any[]
  ) {
    super(message);
    this.name = 'GraphQLError';
  }
}

/**
 * Wiki.js GraphQL client with SSL configuration support
 */
export class WikiJsGraphQLClient {
  private client: AxiosInstance;

  constructor() {
    const httpsAgent = this.createHttpsAgent();

    this.client = axios.create({
      baseURL: config.WIKIJS_API_URL,
      headers: {
        Authorization: `Bearer ${config.WIKIJS_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      httpsAgent,
      timeout: 30000, // 30 second timeout
    });
  }

  /**
   * Create HTTPS agent with appropriate SSL configuration
   */
  private createHttpsAgent(): https.Agent | undefined {
    // If not HTTPS, don't create agent
    if (!config.WIKIJS_API_URL.startsWith('https://')) {
      return undefined;
    }

    // Disable SSL verification (for testing only)
    if (!config.WIKIJS_SSL_VERIFY) {
      console.warn(
        'WARNING: SSL verification is disabled. This should only be used for testing.'
      );
      return new https.Agent({
        rejectUnauthorized: false,
      });
    }

    // Use custom CA bundle if provided
    if (config.WIKIJS_CA_BUNDLE) {
      try {
        const ca = fs.readFileSync(config.WIKIJS_CA_BUNDLE, 'utf-8');
        return new https.Agent({ ca });
      } catch (error) {
        throw new Error(
          `Failed to read CA bundle from ${config.WIKIJS_CA_BUNDLE}: ${error}`
        );
      }
    }

    // Default: standard certificate validation
    return undefined;
  }

  /**
   * Execute a GraphQL query or mutation
   * @param query GraphQL query string
   * @param variables Optional query variables
   * @returns Typed response data
   */
  async query<T = any>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    try {
      const response = await this.client.post('', {
        query,
        variables,
      });

      // Check for GraphQL errors
      if (response.data.errors) {
        throw new GraphQLError(
          `GraphQL Error: ${JSON.stringify(response.data.errors)}`,
          response.data.errors
        );
      }

      // Return the data field from the response
      return response.data.data as T;
    } catch (error) {
      // Re-throw GraphQL errors
      if (error instanceof GraphQLError) {
        throw error;
      }

      // Wrap axios errors
      if (axios.isAxiosError(error)) {
        throw new Error(
          `HTTP Error: ${error.message}${
            error.response?.status ? ` (Status: ${error.response.status})` : ''
          }`
        );
      }

      // Re-throw other errors
      throw error;
    }
  }
}

/**
 * Singleton GraphQL client instance
 */
export const graphqlClient = new WikiJsGraphQLClient();
