import { Request, Response, NextFunction } from 'express';
import { env } from '../config/environment';

export interface HttpError extends Error {
  statusCode?: number;
  status?: number;
}

/**
 * Global error handler — catches all errors from controllers.
 * Never exposes internal stack traces or API keys to clients.
 */
export function errorHandler(
  err: HttpError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? err.status ?? 500;

  // Provide a safe client-facing message
  let clientMessage =
    statusCode < 500
      ? err.message
      : 'An unexpected error occurred. Please try again.';

  if (statusCode === 503) {
    clientMessage =
      err.message ||
      'The AI service is temporarily experiencing high traffic. Please try again in a moment.';
  } else if (statusCode === 429) {
    clientMessage =
      'The AI service rate limit was reached. Please wait a moment and try again.';
  }

  // Safe server-side diagnostic logging — NEVER logs API keys, tokens, or auth headers
  console.error('[API Error Diagnostic]', {
    status: statusCode,
    errorType: err.name || 'Error',
    errorMessage: err.message,
    path: req.path,
    method: req.method,
    aiProvider: env.aiProvider,
    aiModel: env.aiModel,
    timestamp: new Date().toISOString(),
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  });

  res.status(statusCode).json({
    success: false,
    error: clientMessage,
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found.`,
  });
}
