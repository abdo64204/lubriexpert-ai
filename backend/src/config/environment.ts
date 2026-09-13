import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend directory (lubriexpert-ai/backend/.env)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
if (!process.env['AI_API_KEY']) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
  dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
}

export interface EnvironmentConfig {
  port: number;
  nodeEnv: string;
  frontendUrl: string;
  aiProvider: string;
  aiApiKey: string;
  aiModel: string;
  aiBaseUrl: string;
}

const parsedPort = parseInt(process.env['PORT'] ?? '3000', 10);

export const env: EnvironmentConfig = {
  port: isNaN(parsedPort) ? 3000 : parsedPort,
  nodeEnv: (process.env['NODE_ENV'] ?? 'development').trim(),
  frontendUrl: (process.env['FRONTEND_URL'] ?? (process.env['NODE_ENV'] === 'production' ? '*' : 'http://localhost:4200')).trim(),
  aiProvider: (process.env['AI_PROVIDER'] ?? 'gemini').trim().toLowerCase(),
  aiApiKey: (process.env['AI_API_KEY'] ?? '').trim(),
  aiModel: (process.env['AI_MODEL'] ?? 'gemini-flash-lite-latest').trim(),
  aiBaseUrl: (process.env['AI_BASE_URL'] ?? 'https://generativelanguage.googleapis.com/v1beta/openai/').trim(),
};

export function validateEnvironment(): void {
  let endpointHost = 'default';
  try {
    endpointHost = env.aiBaseUrl ? new URL(env.aiBaseUrl).hostname : 'default';
  } catch {
    endpointHost = 'invalid-url';
  }

  // Safe server-side diagnostic logging — NEVER logs real keys or credentials
  console.log('[Environment] Active Configuration:');
  console.log(`  AI_API_KEY configured: ${Boolean(env.aiApiKey && env.aiApiKey.length > 0)}`);
  console.log(`  AI_PROVIDER:          ${env.aiProvider}`);
  console.log(`  AI_MODEL:             ${env.aiModel}`);
  console.log(`  AI_BASE_URL (host):   ${endpointHost}`);
  console.log(`  NODE_ENV:             ${env.nodeEnv}`);

  if (!env.aiApiKey) {
    console.warn(
      '\n⚠️  WARNING: AI_API_KEY is not configured.\n' +
      '   The AI chatbot will NOT work until you add your API key.\n' +
      '   In production, set AI_API_KEY as an environment variable in your deployment platform.\n' +
      '   In local development, add AI_API_KEY to backend/.env and restart the server.\n'
    );
  }
}
