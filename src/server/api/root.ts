import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { tasksRouter } from "~/server/api/routers/tasks";
import { profileRouter } from "~/server/api/routers/profile";
import { staffRouter } from "~/server/api/routers/staff";
import { productsRouter } from "~/server/api/routers/products";
import { settingsRouter } from "~/server/api/routers/settings";
import { quotationsRouter } from "~/server/api/routers/quotations";
import { clientsRouter } from "~/server/api/routers/clients";
import { remindersRouter } from "~/server/api/routers/reminders";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tasks: tasksRouter,
  profile: profileRouter,
  staff: staffRouter,
  products: productsRouter,
  settings: settingsRouter,
  quotations: quotationsRouter,
  clients: clientsRouter,
  reminders: remindersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
