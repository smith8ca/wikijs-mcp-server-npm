/**
 * Jest global setup — runs before each test file's modules are loaded.
 * Sets required environment variables so modules that validate config at
 * import time (src/config/env.ts) do not throw in unit/integration tests.
 */
process.env.WIKIJS_API_URL ??= 'http://localhost:3000/graphql';
process.env.WIKIJS_API_TOKEN ??= 'test-token';
