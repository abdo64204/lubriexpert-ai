import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { env } from './config/environment';
import { generalRateLimit } from './middleware/rate-limiter';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import chatRoutes from './routes/chat.routes';
import healthRoutes from './routes/health.routes';

export function createApp(): express.Application {
  const app = express();

  // Trust reverse proxy headers (Cloudflare, Nginx, Render, Railway, Heroku, AWS ALB)
  app.set('trust proxy', 1);

  // Parse allowed CORS origins from FRONTEND_URL
  const parseAllowedOrigins = (): string[] | '*' => {
    if (!env.frontendUrl || env.frontendUrl.trim() === '*' || (env.nodeEnv !== 'production' && !process.env['FRONTEND_URL'])) {
      return '*';
    }
    return env.frontendUrl
      .split(',')
      .map((u) => u.trim().replace(/\/+$/, ''))
      .filter(Boolean);
  };

  const allowedOrigins = parseAllowedOrigins();

  // Security headers with CSP configured for Angular & Google Fonts
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", ...(Array.isArray(allowedOrigins) ? allowedOrigins : [])],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS — only allow requests from the configured frontend URL(s)
  app.use(
    cors({
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (curl, mobile apps, server-to-server, same-origin)
        if (!origin) return callback(null, true);

        if (allowedOrigins === '*') return callback(null, true);

        const normalized = origin.replace(/\/+$/, '');
        if (allowedOrigins.includes(normalized)) {
          return callback(null, true);
        }

        // Always allow localhost in non-production environments
        if (env.nodeEnv !== 'production' && normalized.includes('localhost')) {
          return callback(null, true);
        }

        return callback(null, false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body parsing with strict size limits to prevent abuse
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // General rate limiting for all routes
  app.use(generalRateLimit);

  // API routes — mounted on both '/api' and '/' for seamless compatibility with standalone and Vercel serverless rewrites
  app.use('/api', chatRoutes);
  app.use('/api', healthRoutes);
  app.use('/', chatRoutes);
  app.use('/', healthRoutes);

  // Serve static Angular frontend if built (single-service deployment option)
  const candidateFrontendPaths = [
    path.resolve(__dirname, '../../frontend/dist/frontend/browser'),
    path.resolve(__dirname, '../../../frontend/dist/frontend/browser'),
    path.resolve(process.cwd(), '../frontend/dist/frontend/browser'),
    path.resolve(process.cwd(), 'frontend/dist/frontend/browser'),
    path.resolve(process.cwd(), 'public'),
  ];

  const staticPath = candidateFrontendPaths.find((p) =>
    fs.existsSync(path.join(p, 'index.html'))
  );

  if (staticPath) {
    app.use(express.static(staticPath));

    // Handle 404 for unmatched /api routes
    app.all('/api/*', notFoundHandler);

    // Serve index.html for all other non-API routes (Angular client-side routing)
    app.get('*', (_req: express.Request, res: express.Response) => {
      res.sendFile(path.join(staticPath, 'index.html'));
    });
  } else {
    // 404 handler for API-only deployments
    app.use(notFoundHandler);
  }

  // Global error handler (must be last middleware)
  app.use(errorHandler);

  return app;
}

export default createApp;
