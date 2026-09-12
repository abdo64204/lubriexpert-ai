import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateChatRequest = [
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message cannot be empty.')
    .isLength({ max: 4000 })
    .withMessage('Message cannot exceed 4000 characters.'),

  body('language')
    .optional()
    .isIn(['ar', 'en'])
    .withMessage('Language must be "ar" or "en".'),

  body('conversationId')
    .optional()
    .isUUID()
    .withMessage('conversationId must be a valid UUID.'),

  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed.',
        details: errors.array().map((e) => e.msg),
      });
      return;
    }
    next();
  },
];
