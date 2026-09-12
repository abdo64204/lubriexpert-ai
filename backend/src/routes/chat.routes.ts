import { Router } from 'express';
import { handleChat, deleteConversation } from '../controllers/chat.controller';
import { validateChatRequest } from '../middleware/validation';
import { chatRateLimit } from '../middleware/rate-limiter';

const router = Router();

// POST /api/chat
router.post('/chat', chatRateLimit, validateChatRequest, handleChat);

// DELETE /api/conversations/:conversationId
router.delete('/conversations/:conversationId', deleteConversation);

export default router;
