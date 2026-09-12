import { Router, Request, Response } from 'express';
import { aiService } from '../services/ai.service';
import { env } from '../config/environment';

const router = Router();

// GET /api/health — Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
    ai: {
      provider: aiService.getProviderName(),
      model: env.aiModel,
      configured: aiService.isConfigured(),
    },
  });
});

export default router;
