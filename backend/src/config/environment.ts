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
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  frontendUrl: process.env['FRONTEND_URL'] ?? (process.env['NODE_ENV'] === 'production' ? '*' : 'http://localhost:4200'),
  aiProvider: process.env['AI_PROVIDER'] ?? 'gemini',
  aiApiKey: process.env['AI_API_KEY'] ?? '',
  aiModel: process.env['AI_MODEL'] ?? 'gemini-3.8-flash',
  aiBaseUrl: process.env['AI_BASE_URL'] ?? 'https://generativelanguage.googleapis.com/v1beta/openai/',
};

export function validateEnvironment(): void {
  if (!env.aiApiKey) {
    console.warn(
      '\n⚠️  WARNING: AI_API_KEY is not configured.\n' +
      '   The AI chatbot will NOT work until you add your API key.\n' +
      '   In production, set AI_API_KEY as an environment variable in your deployment platform.\n' +
      '   In local development, add AI_API_KEY to backend/.env and restart the server.\n'
    );
  }
}
