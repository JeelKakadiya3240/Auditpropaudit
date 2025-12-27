# Architecture: Neon → Supabase Transition

## Before: Neon Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client (React)                        │
│                   (TypeScript/Vite)                      │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP
┌────────────────────▼────────────────────────────────────┐
│              Express Server (Node.js)                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Routes & Controllers                            │  │
│  │  - Auth (Passport)                               │  │
│  │  - API Endpoints                                 │  │
│  └─────────────────┬────────────────────────────────┘  │
│                    │                                    │
│  ┌─────────────────▼────────────────────────────────┐  │
│  │  Drizzle ORM                                     │  │
│  │  (Schema: TypeScript)                            │  │
│  └─────────────────┬────────────────────────────────┘  │
│                    │                                    │
│  ┌─────────────────▼────────────────────────────────┐  │
│  │  @neondatabase/serverless                       │  │
│  │  (WebSocket Pool)                               │  │
│  └─────────────────┬────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │ WebSocket
┌────────────────────▼────────────────────────────────────┐
│            Neon PostgreSQL (Serverless)                 │
│  - Auto-scaling                                         │
│  - WebSocket connections                               │
└─────────────────────────────────────────────────────────┘
```

---

## After: Supabase Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client (React)                        │
│                   (TypeScript/Vite)                      │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP
┌────────────────────▼────────────────────────────────────┐
│              Express Server (Node.js)                    │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │  Middleware & Utils                           │    │
│  │  - Supabase Config Validation                 │    │
│  │  - Tenant Context Extraction                  │    │
│  │  - Health Checks                              │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │  Routes & Controllers                         │    │
│  │  - Auth (Passport)                            │    │
│  │  - API Endpoints                              │    │
│  │  - Tenant-aware operations                    │    │
│  └─────────────────┬─────────────────────────────┘    │
│                    │                                   │
│  ┌─────────────────▼─────────────────────────────┐    │
│  │  Drizzle ORM                                  │    │
│  │  (Schema: TypeScript)                         │    │
│  │  - Same schema, compatible!                   │    │
│  └─────────────────┬─────────────────────────────┘    │
│                    │                                   │
│  ┌─────────────────▼─────────────────────────────┐    │
│  │  pg (PostgreSQL Client)                       │    │
│  │  (Standard TCP Pool)                          │    │
│  │  ✨ NEW: With Supabase pooling                │    │
│  └─────────────────┬─────────────────────────────┘    │
└────────────────────┬────────────────────────────────────┘
                     │ TCP (SSL)
┌────────────────────▼────────────────────────────────────┐
│              Supabase PostgreSQL                         │
│  ┌────────────────────────────────────────────────┐    │
│  │  Database                                      │    │
│  │  - All tables and schemas                      │    │
│  │  - RLS policies (optional)                     │    │
│  └────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────┐    │
│  │  Additional Services (Optional)                │    │
│  │  - Auth (Supabase Auth)                        │    │
│  │  - Storage (File uploads)                      │    │
│  │  - Real-time (Subscriptions)                   │    │
│  │  - Vector (pgvector extension)                │    │
│  └────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────┐    │
│  │  Infrastructure                               │    │
│  │  - Connection pooling                         │    │
│  │  - Automated backups                          │    │
│  │  - Monitoring & logs                          │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## SaaS Multi-Tenant Layer

```
┌─────────────────────────────────────────────────────────┐
│         Express Server with SaaS Features               │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  HTTP Request Handler                           │   │
│  │  (Express Middleware)                           │   │
│  └────────────────┬────────────────────────────────┘   │
│                   │                                     │
│  ┌────────────────▼────────────────────────────────┐   │
│  │  tenantMiddleware                               │   │
│  │  - Extract tenant from session                  │   │
│  │  - Validate tenant context                      │   │
│  │  - Attach to request object                     │   │
│  └────────────────┬────────────────────────────────┘   │
│                   │                                     │
│  ┌────────────────▼────────────────────────────────┐   │
│  │  Route Handler with Tenant Context              │   │
│  │  - User/Organization ID available               │   │
│  │  - Role-based access control                    │   │
│  │  - Usage tracking                               │   │
│  │  - Audit logging                                │   │
│  └────────────────┬────────────────────────────────┘   │
│                   │                                     │
│  ┌────────────────▼────────────────────────────────┐   │
│  │  Tenant-Filtered Database Query                 │   │
│  │  - SELECT * FROM users WHERE id = tenant_id    │   │
│  │  - All queries isolated by tenant              │   │
│  │  - Optional RLS for extra security             │   │
│  └────────────────┬────────────────────────────────┘   │
│                   │                                     │
│  ┌────────────────▼────────────────────────────────┐   │
│  │  Supabase PostgreSQL                            │   │
│  │  - Tenant-isolated data returned                │   │
│  └────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Data Flow: Request to Database

```
1. Client Request
   ├─ HTTP POST /api/documents
   └─ Session Cookie

2. Express Receives Request
   ├─ Parse middleware
   ├─ Session middleware (Express Session)
   └─ Extract user from session

3. Tenant Middleware (NEW)
   ├─ Call extractTenantContext(req)
   ├─ Query users table for context
   ├─ Attach req.tenantContext
   └─ Continue to route

4. Route Handler
   ├─ Use req.tenantContext
   ├─ Example: user_id = tenantContext.userId
   ├─ Build query with tenant filter
   └─ Execute via Drizzle ORM

5. Drizzle ORM Query
   ├─ SELECT documents WHERE user_id = 'abc-123'
   └─ Execute via pg client

6. PostgreSQL Connection
   ├─ TCP connection via pooling
   ├─ SSL encrypted
   ├─ Execute query
   └─ Return results

7. Response to Client
   ├─ Format as JSON
   ├─ Log audit trail
   └─ Send to client
```

---

## Configuration & Initialization

```
Application Startup
│
├─ Load Environment Variables
│  └─ DATABASE_URL from .env
│
├─ supabase-config.ts
│  ├─ validateSupabaseConnection()
│  ├─ parseProjectFromUrl()
│  └─ logConfigurationSummary()
│
├─ server/db.ts
│  ├─ Create Pool from DATABASE_URL
│  ├─ Configure SSL
│  └─ Export for use
│
├─ server/app.ts
│  ├─ Initialize Supabase config logging
│  ├─ Check database health
│  └─ Log startup summary
│
├─ Express Routes
│  ├─ Register session store
│  ├─ Register API routes
│  └─ Attach tenant middleware
│
└─ Server Listening
   └─ Ready for requests
```

---

## Tenant Isolation Strategies

### Current: User-Level Isolation
```
Tenant = User
├─ Filter all queries by user_id
├─ Simplest to implement
├─ Suitable for B2C apps
└─ Query: SELECT * FROM data WHERE user_id = ?
```

### Future: Organization-Level Isolation
```
Tenant = Organization
├─ Multiple users per organization
├─ Filter by organization_id
├─ Suitable for B2B apps
└─ Query: SELECT * FROM data WHERE org_id = ?
```

### Advanced: Multi-Tenant with RLS
```
Tenant = Row-Level Security Policies
├─ Database-level enforcement
├─ More secure than app-level
├─ Highest complexity
└─ Policy: CREATE POLICY "tenant_isolation" ...
```

---

## Component Responsibilities

| Component | Responsibility | Location |
|-----------|-----------------|----------|
| **Pool** | PostgreSQL connections | `server/db.ts` |
| **Drizzle ORM** | Query building & execution | `shared/schema.ts` |
| **Express** | HTTP routing & middleware | `server/routes.ts` |
| **saas-utils** | Tenant isolation logic | `server/saas-utils.ts` |
| **supabase-config** | Configuration validation | `server/supabase-config.ts` |
| **Session Store** | User session persistence | `server/routes.ts` |
| **Auth** | Login/logout logic | `server/auth.ts` |

---

## Environment Configuration Flow

```
.env file
│
├─ DATABASE_URL
│  ├─ Parse by supabase-config.ts
│  ├─ Validate connection string
│  ├─ Create Pool instance
│  └─ Pass to Drizzle ORM
│
├─ SUPABASE_PROJECT_ID
│  └─ Used for logging/dashboard URL
│
├─ SESSION_SECRET
│  └─ Passed to Express Session
│
└─ NODE_ENV
   └─ Determines pool size & SSL settings
```

---

## Error Handling & Monitoring

```
Request Flow with Error Handling
│
├─ Database Connection Error
│  ├─ Caught by health check
│  ├─ Logged at startup
│  └─ Warning in console
│
├─ Tenant Not Found
│  ├─ Caught in tenantMiddleware
│  ├─ Return 401 Unauthorized
│  └─ Logged for audit
│
├─ Query Execution Error
│  ├─ Caught in route handler
│  ├─ Return 500 error
│  └─ Log details
│
└─ Success
   ├─ Log API call (method, path, time)
   ├─ Return 200 + data
   └─ Continue
```

---

## Feature Availability

### Inherited from PostgreSQL
- ✅ ACID transactions
- ✅ Complex queries
- ✅ Indexes
- ✅ Triggers
- ✅ Views
- ✅ Full-text search
- ✅ JSON/JSONB

### New with Supabase
- ✨ Real-time subscriptions
- ✨ Row-Level Security
- ✨ Vector search (pgvector)
- ✨ Authentication service
- ✨ File storage
- ✨ REST API
- ✨ GraphQL API

### SaaS Layer Adds
- 📊 Usage tracking
- 🔒 Tenant isolation middleware
- 💰 Quota enforcement
- 📋 Audit logging
- 🔄 Batch processing
- 📈 Monitoring helpers

---

## Scaling Considerations

### Current Setup
- Single Express instance
- Connection pooling (5-20 connections)
- Single Supabase project
- Suitable for: 1-100 concurrent users

### For Growth
- Add multiple Express instances (load balancer)
- Use Supabase connection pooling
- Implement caching layer (Redis)
- Separate read replicas (if needed)
- Archive old data
- Suitable for: 100-10,000 concurrent users

### Enterprise Scale
- Multiple application servers
- Database replication
- Sharding by tenant
- Dedicated RLS policies
- Advanced monitoring
- Suitable for: 10,000+ concurrent users

---

## Security Layers

```
┌─────────────────────────────────────────────┐
│         Application Layer                   │
│  - Express middleware                       │
│  - Route authentication                     │
│  - Tenant isolation (saas-utils)            │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│         Connection Layer                    │
│  - SSL/TLS encryption                       │
│  - Connection pooling                       │
│  - Session store encryption                 │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│         Database Layer                      │
│  - Row-Level Security (optional RLS)        │
│  - User permissions                         │
│  - Column-level access (with RLS)           │
└─────────────────────────────────────────────┘
```

---

## Performance Profile

### Neon (Before)
```
Connection: WebSocket (low latency)
Pool: Serverless (auto-scaling)
Cold Start: 1-2 seconds
Query Time: 10-50ms
Connections: Up to 100+
```

### Supabase (After)
```
Connection: TCP + Connection Pooling
Pool: Configurable (5-20 in pool)
Warm Start: <100ms
Query Time: 10-50ms (same as Neon)
Connections: Limited by pool size
Improvement: Better for web servers
```

---

This architecture supports:
- ✅ Rapid development
- ✅ Easy scaling
- ✅ Multi-tenant SaaS model
- ✅ Secure data isolation
- ✅ Audit compliance
- ✅ Future growth
