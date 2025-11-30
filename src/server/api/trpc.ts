import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { auth } from "@clerk/nextjs/server"; // <--- 1. Switch to 'auth' helper

import { db } from "~/server/db";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {

  // 2. Get the Auth Session using the new async auth() helper
  // This automatically uses the underlying Next.js headers/cookies context
  const session = await auth();

  return {
    db,
    auth: session, // <--- 3. Add Auth to Context
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

/**
 * Public (unauthenticated) procedure
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * 4. PROTECTED PROCEDURE (The Gatekeeper)
 * * This middleware ensures the user is logged in AND has an Organization selected.
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.auth.userId || !ctx.auth.orgId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      // Infers the `auth` as non-nullable
      auth: {
        ...ctx.auth,
        userId: ctx.auth.userId,
        orgId: ctx.auth.orgId, // <--- Guarantees orgId exists
      },
    },
  });
});

// Export this so your routers can use it
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(enforceUserIsAuthed);