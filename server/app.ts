import { createServer, Server } from "node:http";
import express, { type Express, type Request, Response, NextFunction } from "express";
import apiRoutes from "./routes/index.js";
import { logConfigurationSummary, checkDatabaseHealth } from "./supabase-config";
import { pool } from "./db";


export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  
  console.log(`${formattedTime} [${source}] ${message}`);
}

export const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Mount API routes
app.use('/api', apiRoutes);

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}


app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

export default async function runApp(
  setup: (app: Express, server: Server) => Promise<void>,
) {
  // Initialize and validate Supabase connection
  try {
    logConfigurationSummary();
    
    const isHealthy = await checkDatabaseHealth(pool);
    if (isHealthy) {
      log("Supabase database connection established", "supabase");
    } else {
      log("WARNING: Database health check failed", "supabase");
    }
  } catch (error) {
    log(`Error initializing Supabase: ${error instanceof Error ? error.message : String(error)}`, "supabase");
  }

  // const server = app.listen(0); // Create server but don't start listening yet

  // Mount API routes
  app.use('/api', apiRoutes);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly run the final setup after setting up all the other routes so
  // the catch-all route doesn't interfere with the other routes
  await setup(app, server);

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
   // const server = app.listen(0); <-- COMMENT OR REMOVE THIS
  // ... later ...
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
}
