import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';
import * as auth from '../middleware/auth'; // Import existing auth functions
import { sendVerificationEmail, sendPasswordResetEmail, sendOTPEmail } from '../email';
import { sendOTPSMS } from '../sms';
import {
  registerUserSchema,
  loginUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  requestOTPSchema,
  verifyOTPSchema
} from '@shared/schema';

const router = Router();

// Register new user
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  
  const data = registerUserSchema.parse(req.body);
  
  const existingUser = await auth.getUserByEmail(data.email);
  if (existingUser) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const user = await auth.createUser({
    email: data.email,
    password: data.password,
    fullName: data.fullName,
    phoneNumber: data.phoneNumber,
  });
  console.log("user",user);
  

  const token = await auth.createEmailVerificationToken(user.id);
  console.log("token",token);
  
  await sendVerificationEmail(user.email!, token);

  res.json({
    success: true,
    message: "Registration successful. Please check your email to verify your account.",
    userId: user.id
  });
}));

// Login with email/password
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const data = loginUserSchema.parse(req.body);

  const user = await auth.getUserByEmail(data.email);
  if (!user || !user.hashedPassword) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const isValid = await auth.verifyPassword(data.password, user.hashedPassword);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  if (!user.emailVerified) {
    return res.status(403).json({
      error: "Please verify your email before logging in",
      requiresVerification: true
    });
  }

  if (user.status !== "active") {
    return res.status(403).json({ error: "Your account has been suspended" });
  }

  await auth.updateLastLogin(user.id);

  req.session.userId = user.id;
  req.session.email = user.email!;
  req.session.role = user.role;

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
    }
  });
}));

// Verify email
router.post('/verify-email', asyncHandler(async (req: Request, res: Response) => {
  const data = verifyEmailSchema.parse(req.body);

  const result = await auth.verifyEmailToken(data.token);
  if (!result.success) {
    return res.status(400).json({ error: result.error || "Invalid or expired verification token" });
  }

  // Get the user details
  const user = await auth.getUserById(result.userId!);
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  res.json({
    success: true,
    message: "Email verified successfully",
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    }
  });
}));

// Forgot password
router.post('/forgot-password', asyncHandler(async (req: Request, res: Response) => {
  const data = forgotPasswordSchema.parse(req.body);

  const user = await auth.getUserByEmail(data.email);
  if (!user) {
    // Don't reveal if email exists or not for security
    return res.json({
      success: true,
      message: "If an account with this email exists, a password reset link has been sent."
    });
  }

  const token = await auth.createPasswordResetToken(user.id);
  await sendPasswordResetEmail(user.email!, token);

  res.json({
    success: true,
    message: "If an account with this email exists, a password reset link has been sent."
  });
}));

// Reset password
router.post('/reset-password', asyncHandler(async (req: Request, res: Response) => {
  const data = resetPasswordSchema.parse(req.body);

  const result = await auth.resetPasswordWithToken(data.token, data.password);
  if (!result.success) {
    return res.status(400).json({ error: result.error || "Invalid or expired reset token" });
  }

  res.json({
    success: true,
    message: "Password reset successfully"
  });
}));

// Request OTP
router.post('/otp/request', asyncHandler(async (req: Request, res: Response) => {
  const { phoneNumber, channel = 'sms' } = req.body;

  if (!phoneNumber) {
    throw new AppError('Phone number is required', 400);
  }

  const challenge = await auth.createOTPChallenge(phoneNumber, channel as 'sms' | 'email');

  if (channel === 'email') {
    await sendOTPEmail(phoneNumber, challenge.otp);
  } else {
    await sendOTPSMS(phoneNumber, challenge.otp);
  }

  res.json({
    success: true,
    message: `OTP sent to ${channel}`,
    challengeId: challenge.challengeId
  });
}));

// Verify OTP
router.post('/otp/verify', asyncHandler(async (req: Request, res: Response) => {
  const data = verifyOTPSchema.parse(req.body);

  const verified = await auth.verifyOTP(data.phoneNumber, data.code);
  if (!verified.success) {
    return res.status(400).json({ error: verified.error || "Invalid or expired OTP" });
  }

  res.json({
    success: true,
    message: "OTP verified successfully",
    userId: verified.userId
  });
}));

// Get current user
router.get('/me', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
      fullName: users.fullName,
      phoneNumber: users.phoneNumber,
      role: users.role,
      emailVerified: users.emailVerified,
      phoneVerified: users.phoneVerified,
      status: users.status,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, req.session.userId!))
    .limit(1);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: { user },
  });
}));

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

export { router as authRoutes };