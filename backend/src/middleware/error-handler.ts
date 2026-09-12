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
  const clientMessage =
    statusCode < 500
      ? err.message
      : 'An unexpected error occurred. Please try again.';

  // Log full details server-side only
  console.error('[Error]', {
    status: statusCode,
    message: err.message,
    path: req.path,
    method: req.method,
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
