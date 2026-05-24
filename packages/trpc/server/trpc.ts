import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";
import { createContext } from "./context";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          // Surface our domain error codes to clients
          domainCode: error.message,
        },
      };
    },
  });

export const router = tRPCContext.router;

/** Public procedure — no auth required */
export const publicProcedure = tRPCContext.procedure;

/** Protected procedure — requires valid session token */
export const protectedProcedure = tRPCContext.procedure.use(
  tRPCContext.middleware(({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be signed in to perform this action.",
      });
    }
    return next({ ctx: { ...ctx, user: ctx.user } });
  })
);

/** Admin procedure — requires role === 'admin' */
export const adminProcedure = protectedProcedure.use(
  tRPCContext.middleware(({ ctx, next }) => {
    if (ctx.user!.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Admin access required.",
      });
    }
    return next({ ctx });
  })
);
