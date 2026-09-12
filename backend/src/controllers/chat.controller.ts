import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service';
import { conversationService } from '../services/conversation.service';
import { ChatRequest } from '../models/types';

/**
 * POST /api/chat — Main chat endpoint.
 *
 * Flow:
 *   1. Validate AI is configured
 *   2. Get or create conversation context
 *   3. Add user message to history
 *   4. Send to AIService (which prepends system prompt)
 *   5. Save AI response to history
 *   6. Return response to frontend
 */
export async function handleChat(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { message, conversationId, language = 'en' } = req.body as ChatRequest;

    // Fail early and clearly if API key is not configured
    if (!aiService.isConfigured()) {
      res.status(503).json({
        success: false,
        error:
          'The AI service is not configured. Please set AI_API_KEY in the backend .env file and restart the server.',
        configurationRequired: true,
      });
      return;
    }

    // Get existing conversation or create a new one
    const conversation = conversationService.getOrCreateConversation(
      conversationId,
      language
    );

    // Record user message in conversation history
    conversationService.addMessage(conversation.id, {
      role: 'user',
      content: message,
    });

    // Build history to send to AI (all messages except the one we just added)
    const history = conversation.messages.slice(0, -1);

    // Generate AI response
    const aiResponse = await aiService.generateResponse(message, history);

    // Record AI response in conversation history
    conversationService.addMessage(conversation.id, {
      role: 'assistant',
      content: aiResponse.content,
    });

    res.json({
      success: true,
      message: {
        role: 'assistant',
        content: aiResponse.content,
      },
      conversationId: conversation.id,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/conversations/:conversationId — Remove a conversation from memory.
 */
export async function deleteConversation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const conversationId = String(req.params['conversationId'] ?? '');
    const deleted = conversationService.deleteConversation(conversationId);
    res.json({ success: true, deleted });
  } catch (error) {
    next(error);
  }
}
