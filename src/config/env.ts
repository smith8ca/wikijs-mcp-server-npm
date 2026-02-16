/**
 * Environment configuration with Zod validation
 */
import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

/**
 * Environment variable schema with validation and defaults
 */
const envSchema = z.object({
  WIKIJS_API_URL: z
    .string()
    .url()
    .default('http://localhost:3000/graphql')
    .describe('Wiki.js GraphQL API endpoint'),

  WIKIJS_API_TOKEN: z
    .string()
    .min(1, 'WIKIJS_API_TOKEN is required')
    .describe('Wiki.js API authentication token'),

  WIKIJS_SSL_VERIFY: z
    .string()
    .transform((val) => val.toLowerCase() !== 'false')
    .default('true')
    .describe('Enable/disable SSL certificate verification'),

  WIKIJS_CA_BUNDLE: z
    .string()
    .optional()
    .describe('Path to custom CA certificate bundle'),
});

/**
 * Validated configuration type
 */
export type Config = z.infer<typeof envSchema>;

/**
 * Parse and validate environment variables
 * Throws an error if required variables are missing or invalid
 */
export const config = envSchema.parse({
  WIKIJS_API_URL: process.env.WIKIJS_API_URL,
  WIKIJS_API_TOKEN: process.env.WIKIJS_API_TOKEN,
  WIKIJS_SSL_VERIFY: process.env.WIKIJS_SSL_VERIFY,
  WIKIJS_CA_BUNDLE: process.env.WIKIJS_CA_BUNDLE,
});
