import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { insertUserPropertySchema } from '@shared/schema';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get user's properties
router.get('/', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const properties = await storage.getUserProperties(req.session.userId!);

  res.json({
    success: true,
    data: { properties },
  });
}));

// Add new property
router.post('/', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const validated = insertUserPropertySchema.parse(req.body);

  // Check credits (if applicable)
  // const credits = await storage.getUserCredits(req.session.userId!);
  // if (credits.available < credits.creditsPerProperty) {
  //   throw new AppError('Insufficient credits', 400);
  // }

  const property = await storage.addUserProperty(validated);

  res.status(201).json({
    success: true,
    data: { property },
  });
}));

// Get property by ID
router.get('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const properties = await storage.getUserProperties(req.session.userId!);
  const property = properties.find(p => p.id === req.params.id);

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  res.json({
    success: true,
    data: { property },
  });
}));

// Update property
router.put('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const properties = await storage.getUserProperties(req.session.userId!);
  const property = properties.find(p => p.id === req.params.id);

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  // For now, we'll only allow updating status via the available method
  // TODO: Implement full property update
  if (req.body.status) {
    const updatedProperty = await storage.updateUserPropertyStatus(req.params.id, req.body.status);
    res.json({
      success: true,
      data: { property: updatedProperty },
    });
  } else {
    throw new AppError('Only status updates are currently supported', 400);
  }
}));
  


// Delete property
router.delete('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const properties = await storage.getUserProperties(req.session.userId!);
  const property = properties.find(p => p.id === req.params.id);

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  // TODO: Implement property deletion
  throw new AppError('Property deletion is not yet implemented', 501);
}));

// Get encumbrance certificate
router.get('/:id/ec', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const properties = await storage.getUserProperties(req.session.userId!);
  const property = properties.find(p => p.id === req.params.id);

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  const ec = await storage.getEncumbranceCertificate(req.params.id);

  res.json({
    success: true,
    data: { encumbranceCertificate: ec },
  });
}));

// Get title verification
router.get('/:id/title', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const properties = await storage.getUserProperties(req.session.userId!);
  const property = properties.find(p => p.id === req.params.id);

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  const titleVerification = await storage.getTitleVerification(req.params.id);

  res.json({
    success: true,
    data: { titleVerification },
  });
}));

// Get fraud score
router.get('/:id/fraud', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const properties = await storage.getUserProperties(req.session.userId!);
  const property = properties.find(p => p.id === req.params.id);

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  const fraudScore = await storage.getFraudScore(req.params.id);

  res.json({
    success: true,
    data: { fraudScore },
  });
}));

// Get land record
router.get('/:id/land', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const properties = await storage.getUserProperties(req.session.userId!);
  const property = properties.find(p => p.id === req.params.id);

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  const landRecord = await storage.getLandRecord(req.params.id);

  res.json({
    success: true,
    data: { landRecord },
  });
}));

export { router as propertyRoutes };