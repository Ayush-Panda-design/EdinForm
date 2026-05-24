import express from "express";
import { logger } from "@repo/logger";
import cors from "cors";
import helmet from "helmet";
import * as trpcExpress from "@trpc/server/adapters/express";
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";
import { apiReference } from "@scalar/express-api-reference";
import { serverRouter, createContext } from "@repo/trpc/server";
import { env } from "./env";
import {
  submitRateLimit,
  authRateLimit,
  publicApiRateLimit,
} from "./middlewares/rate-limit.middleware";
import { requestLogger } from "./middlewares/request-logger.middleware";
import { csrfMiddleware } from "./middlewares/csrf.middleware";

export const app = express();

// ---------------------------------------------------------------------------
// Security Headers (Helmet)
// ---------------------------------------------------------------------------
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // Needed for Scalar docs
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Allow Scalar docs to load
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------
app.use(
  cors({
    origin:
      env.NODE_ENV === "prod"
        ? [env.APP_URL]
        : "*",
    credentials: true,
  })
);

// ---------------------------------------------------------------------------
// Request body parsing with size limits
// ---------------------------------------------------------------------------
app.use(express.json({ limit: "512kb" }));          // Reduced from 2mb
app.use(express.urlencoded({ extended: true, limit: "512kb" }));

// ---------------------------------------------------------------------------
// Request logging middleware
// ---------------------------------------------------------------------------
app.use(requestLogger);

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------
app.get("/", (_req, res) => res.json({ message: "FormCraft API is running 🚀" }));
app.get("/health", (_req, res) => res.json({ healthy: true, timestamp: new Date().toISOString() }));

// ---------------------------------------------------------------------------
// OpenAPI / Scalar docs
// ---------------------------------------------------------------------------
const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: "FormCraft API",
  version: "1.0.0",
  description: "Production-grade Form Builder SaaS API",
  baseUrl: env.BASE_URL.concat("/api"),
  tags: ["Auth", "Forms", "Responses", "Analytics", "Public", "Templates", "Themes"],
});

app.get("/openapi.json", (_req, res) => res.json(openApiDocument));

app.use(
  "/docs",
  apiReference({
    url: "/openapi.json",
    theme: "purple",
  })
);

logger.info(`Scalar docs: ${env.BASE_URL}/docs`);

// ---------------------------------------------------------------------------
// Rate limiting — applied before tRPC handlers
// ---------------------------------------------------------------------------
app.use("/api/responses.submit", submitRateLimit);
app.use("/trpc/responses.submit", submitRateLimit);

app.use("/api/auth.signIn", authRateLimit);
app.use("/api/auth.signUp", authRateLimit);
app.use("/trpc/auth.signIn", authRateLimit);
app.use("/trpc/auth.signUp", authRateLimit);

app.use("/api/public", publicApiRateLimit);

// ---------------------------------------------------------------------------
// CSRF protection for state-changing mutations (non-GET, non-public routes)
// ---------------------------------------------------------------------------
app.use("/trpc", csrfMiddleware);
app.use("/api", csrfMiddleware);

// ---------------------------------------------------------------------------
// tRPC — OpenAPI REST adapter
// ---------------------------------------------------------------------------
app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: serverRouter,
    createContext,
    onError({ error, path }) {
      logger.error(`[tRPC-OpenAPI] ${path}`, { error: error.message });
    },
  })
);

// ---------------------------------------------------------------------------
// tRPC — native RPC adapter (for tRPC clients)
// ---------------------------------------------------------------------------
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
    onError({ error, path }) {
      logger.error(`[tRPC] ${path}`, { error: error.message });
    },
  })
);

export default app;
