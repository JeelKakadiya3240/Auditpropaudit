# Quick Reference: Neon → Supabase Migration

## 🚀 Quick Start (5 minutes)

```bash
# 1. Get your Supabase connection string
# Visit: https://supabase.com/dashboard → Select Project → Settings → Database
# Copy: Connection String (Session mode)

# 2. Create .env file
cp .env.example .env

# 3. Edit .env - Add your DATABASE_URL
# DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_ID]-pooler.supabase.co:5432/postgres?schema=public&sslmode=require

# 4. Install dependencies
npm install

# 5. Initialize database
npm run db:push

# 6. Start development
npm run dev
```

---

## 📋 Files Changed

| File | Change | Type |
|------|--------|------|
| `package.json` | Removed `@neondatabase/serverless`, added `pg`, `@supabase/supabase-js` | Modified |
| `server/db.ts` | Switched from Neon pool to standard PostgreSQL pool | Modified |
| `drizzle.config.ts` | Updated for Supabase PostgreSQL | Modified |
| `server/app.ts` | Added Supabase initialization & health check | Modified |
| `.env.example` | Template with Supabase environment variables | **NEW** |
| `server/saas-utils.ts` | Multi-tenant utilities (SaaS architecture) | **NEW** |
| `server/supabase-config.ts` | Configuration and validation helpers | **NEW** |
| `SUPABASE_SETUP.md` | Quick start & setup guide | **NEW** |
| `SUPABASE_MIGRATION_GUIDE.md` | Detailed migration reference | **NEW** |
| `MIGRATION_SUMMARY.md` | This summary document | **NEW** |
| `setup-supabase.sh` | Automated setup script | **NEW** |

---

## 🔑 Connection String Format

```
postgresql://postgres:[PASSWORD]@db.[PROJECT_ID]-pooler.supabase.co:5432/postgres?schema=public&sslmode=require
```

**Parameters:**
- `postgres` - Default user
- `[PASSWORD]` - Get from Supabase Dashboard
- `[PROJECT_ID]` - Your Supabase project ID
- `-pooler` - Use connection pooling (recommended)
- `?schema=public` - Schema name
- `?sslmode=require` - Force SSL

---

## 📦 What's New

### SaaS Multi-Tenant Support (`server/saas-utils.ts`)
```typescript
// Extract tenant from session
const tenantContext = await extractTenantContext(req);

// Use in middleware
app.use(tenantMiddleware);

// Track usage
const stats = await getTenantUsageStats(tenantId);

// Check quotas
const inLimit = await checkTenantQuota(tenantId, 'documents');
```

### Configuration Helpers (`server/supabase-config.ts`)
```typescript
// Get Supabase config
const config = getSupabaseConfig();

// Validate connection
const result = await validateSupabaseConnection();

// Health check
const healthy = await checkDatabaseHealth(pool);

// Log summary
logConfigurationSummary();
```

---

## ⚙️ Environment Variables

### Required
```bash
DATABASE_URL=postgresql://...@db.[PROJECT_ID]-pooler.supabase.co:5432/postgres?schema=public&sslmode=require
```

### Recommended
```bash
SUPABASE_PROJECT_ID=your_project_id
SESSION_SECRET=your_secure_random_string
NODE_ENV=development
```

### Optional
```bash
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 🧪 Testing

```bash
# Verify dependencies
npm install

# Push schema to database
npm run db:push

# Start development server
npm run dev

# Look for this in console:
# [timestamp] [supabase] Supabase database connection established
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `DATABASE_URL must be set` | Add to `.env` from Supabase Dashboard |
| `SSL certificate problem` | Connection string has `?sslmode=require` |
| `Connection refused` | Check hostname: `db.[PROJECT_ID]-pooler.supabase.co` |
| `Authentication failed` | Verify password in connection string |
| `Too many connections` | Use pooling endpoint (with `-pooler`) |

---

## 🔗 Get Connection String

### Step-by-step
1. Go to https://supabase.com/dashboard
2. Click your project
3. Click **Settings** (bottom left)
4. Click **Database**
5. Scroll to **Connection Pooling**
6. Select **Session** mode
7. Copy entire connection string
8. Paste into `.env` as `DATABASE_URL`

### Or use direct PostgreSQL
1. Same path: Settings → Database
2. Copy "Connection string" under "Connection info"
3. Use format: `postgresql://postgres:password@db.xxx.supabase.co:5432/postgres?sslmode=require`

---

## 📚 Documentation

- **Setup Guide:** `SUPABASE_SETUP.md` (start here)
- **Detailed Migration:** `SUPABASE_MIGRATION_GUIDE.md` (reference)
- **This Summary:** `MIGRATION_SUMMARY.md` (overview)

---

## 🎯 Next Steps

1. Create Supabase project (https://supabase.com)
2. Get connection string from Dashboard
3. Update `.env` with `DATABASE_URL`
4. Run `npm install`
5. Run `npm run db:push`
6. Run `npm run dev`
7. Check logs for connection message
8. Test API endpoints

---

## ✅ After Migration

- ✅ All existing code works unchanged
- ✅ Database queries are compatible
- ✅ Authentication functions properly
- ✅ Sessions work as before
- ✅ New SaaS utilities available
- ✅ Better PostgreSQL features available
- ✅ Real-time subscriptions possible
- ✅ Row-level security available

---

## 💡 Pro Tips

1. **Use Connection Pooling** - Already configured in pooling endpoint
2. **Enable RLS** - Use Supabase's Row-Level Security for security
3. **Set Up Backups** - Configured automatically, test restore
4. **Monitor Queries** - Use Supabase Dashboard → Logs
5. **Use Extensions** - 40+ PostgreSQL extensions available
6. **Implement Audit Trail** - Use `logTenantActivity()` helper

---

## 🆘 Help

**Issue with connection?**
1. Verify `DATABASE_URL` in `.env`
2. Check connection string format
3. Confirm Supabase project is active
4. Test with: `psql "$DATABASE_URL"`

**Need full documentation?**
- See `SUPABASE_MIGRATION_GUIDE.md`

**Setting up SaaS features?**
- See `server/saas-utils.ts` for examples

---

**Status:** ✅ Ready to develop  
**Last updated:** December 2025
