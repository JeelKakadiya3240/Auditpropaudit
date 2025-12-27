import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { users, updateUserSchema } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Get all users (admin only)
router.get('/', authenticate, authorize(['admin']), asyncHandler(async (req: Request, res: Response) => {
  const allUsers = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      fullName: users.fullName,
      phoneNumber: users.phoneNumber,
      role: users.role,
      emailVerified: users.emailVerified,
      phoneVerified: users.phoneVerified,
      status: users.status,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
    })
    .from(users);

  res.json({
    success: true,
    data: { users: allUsers },
  });
}));

// Get user by ID
router.get('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;

  // Users can only view their own profile unless they're admin
  if (req.session.userId !== userId && req.session.role !== 'admin') {
    throw new AppError('Not authorized to view this user', 403);
  }

  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      fullName: users.fullName,
      phoneNumber: users.phoneNumber,
      role: users.role,
      emailVerified: users.emailVerified,
      phoneVerified: users.phoneVerified,
      status: users.status,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: { user },
  });
}));

// Update user
router.put('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const data = updateUserSchema.parse(req.body);

  // Users can only update their own profile unless they're admin
  if (req.session.userId !== userId && req.session.role !== 'admin') {
    throw new AppError('Not authorized to update this user', 403);
  }

  const [updatedUser] = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
      fullName: users.fullName,
      phoneNumber: users.phoneNumber,
      role: users.role,
      updatedAt: users.updatedAt,
    });

  if (!updatedUser) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: { user: updatedUser },
  });
}));

// Delete user (admin only)
router.delete('/:id', authenticate, authorize(['admin']), asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;

  // Prevent admin from deleting themselves
  if (req.session.userId === userId) {
    throw new AppError('Cannot delete your own account', 400);
  }

  const [deletedUser] = await db
    .delete(users)
    .where(eq(users.id, userId))
    .returning({ id: users.id, email: users.email });

  if (!deletedUser) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: { user: deletedUser },
  });
}));

export { router as userRoutes };