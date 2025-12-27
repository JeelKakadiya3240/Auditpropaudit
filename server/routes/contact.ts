import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';

const router = Router();

// Submit contact form
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    throw new AppError('All fields are required', 400);
  }

  const contactSubmission = await storage.createContactMessage({
    name,
    email,
    subject,
    message,
  });

  res.status(201).json({
    success: true,
    data: { contactSubmission },
  });
}));

// Get contact submissions (admin only)
router.get('/', authenticate, asyncHandler(async (req: Request, res: Response) => {
  if (req.session.role !== 'admin') {
    throw new AppError('Admin access required', 403);
  }

  // For now, return empty array as contact submissions listing needs to be implemented
  const submissions: any[] = [];

  res.json({
    success: true,
    data: { submissions },
  });
}));

// Get contact submission by ID (admin only)
router.get('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  if (req.session.role !== 'admin') {
    throw new AppError('Admin access required', 403);
  }

  // For now, return not found as contact submission retrieval needs to be implemented
  throw new AppError('Contact submission not found', 404);
}));

// Update contact submission status (admin only)
router.patch('/:id/status', authenticate, asyncHandler(async (req: Request, res: Response) => {
  if (req.session.role !== 'admin') {
    throw new AppError('Admin access required', 403);
  }

  const { status } = req.body;

  if (!['pending', 'in-progress', 'resolved'].includes(status)) {
    throw new AppError('Invalid status', 400);
  }

  // For now, return not found as contact submission status update needs to be implemented
  throw new AppError('Contact submission not found', 404);
}));

export { router as contactRoutes };