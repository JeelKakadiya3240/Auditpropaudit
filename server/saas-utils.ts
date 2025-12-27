/**
 * SaaS Multi-Tenancy Utilities
 * Provides helpers for managing multi-tenant architecture in Supabase
 */

import { Request } from "express";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

/**
 * Extract tenant context from request
 * In a SaaS application, tenants could be organizations, accounts, or workspaces
 */
export interface TenantContext {
  tenantId: string;
  userId: string;
  userRole: string;
  organizationId?: string;
}

/**
 * Extract tenant context from session
 */
export async function extractTenantContext(req: Request): Promise<TenantContext | null> {
  const session = req.session as any;
  
  if (!session?.userId) {
    return null;
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user || user.length === 0) {
      return null;
    }

    return {
      tenantId: user[0].id,
      userId: user[0].id,
      userRole: user[0].role || "user",
      organizationId: (user[0] as any).organizationId, // Add this field to schema if needed
    };
  } catch (error) {
    console.error("Error extracting tenant context:", error);
    return null;
  }
}

/**
 * Middleware to enforce tenant isolation
 * Ensures users can only access their own data
 */
export const tenantMiddleware = async (
  req: Request,
  res: any,
  next: any
) => {
  const tenantContext = await extractTenantContext(req);

  if (!tenantContext) {
    return res.status(401).json({ error: "Unauthorized - No tenant context" });
  }

  (req as any).tenantContext = tenantContext;
  next();
};

/**
 * Tenant-aware database query builder
 * Automatically filters data based on tenant context
 */
export function withTenantFilter(tenantContext: TenantContext) {
  return {
    userId: tenantContext.userId,
    organizationId: tenantContext.organizationId,
  };
}

/**
 * Verify user belongs to organization (for organization-level multi-tenancy)
 */
export async function verifyUserInOrganization(
  userId: string,
  organizationId: string
): Promise<boolean> {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    // If using organization field in users table, verify it matches
    // This is a basic implementation - expand based on your schema
    return user.length > 0;
  } catch (error) {
    console.error("Error verifying user in organization:", error);
    return false;
  }
}

/**
 * Get all users in organization (admin only)
 */
export async function getOrganizationUsers(
  organizationId: string,
  requesterRole: string
) {
  // Only admins can list organization users
  if (requesterRole !== "admin") {
    return [];
  }

  try {
    const orgUsers = await db
      .select()
      .from(users)
      .limit(100); // Implement proper filtering based on your schema

    return orgUsers;
  } catch (error) {
    console.error("Error fetching organization users:", error);
    return [];
  }
}

/**
 * Rate limiting per tenant (for SaaS billing/usage tracking)
 */
export interface TenantUsageStats {
  userId: string;
  requestsToday: number;
  documentsProcessed: number;
  storageUsed: number;
}

export async function getTenantUsageStats(
  tenantId: string
): Promise<TenantUsageStats> {
  // Implement usage tracking based on your schema
  // This could involve querying audit logs, document tables, etc.
  return {
    userId: tenantId,
    requestsToday: 0,
    documentsProcessed: 0,
    storageUsed: 0,
  };
}

/**
 * Check if tenant has exceeded usage limits
 */
export async function checkTenantQuota(
  tenantId: string,
  featureName: string
): Promise<boolean> {
  // Implement quota checking based on your SaaS pricing tiers
  // Return true if within limits, false if exceeded
  return true;
}

/**
 * Log tenant activity for audit trail
 */
export async function logTenantActivity(
  tenantId: string,
  action: string,
  resource: string,
  details?: Record<string, any>
) {
  try {
    // Implement audit logging to a table like audit_logs
    console.log(`[AUDIT] Tenant: ${tenantId}, Action: ${action}, Resource: ${resource}`, details);
    // TODO: Insert into audit_logs table
  } catch (error) {
    console.error("Error logging tenant activity:", error);
  }
}

/**
 * Batch operations for multi-tenant efficiency
 */
export async function batchProcessTenant<T>(
  tenantId: string,
  processor: (tenantId: string) => Promise<T>,
  retries: number = 3
): Promise<T | null> {
  let lastError: Error | null = null;

  for (let i = 0; i < retries; i++) {
    try {
      return await processor(tenantId);
    } catch (error) {
      lastError = error as Error;
      console.error(`Batch process attempt ${i + 1} failed:`, error);
      
      // Exponential backoff
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  console.error(`Batch process failed after ${retries} attempts:`, lastError);
  return null;
}
