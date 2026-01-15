import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { taskRouter } from "~/server/api/routers/task";
import { profileRouter } from "~/server/api/routers/profile";
import { staffRouter } from "~/server/api/routers/staff";
import { productRouter } from "~/server/api/routers/product";
import { settingRouter } from "~/server/api/routers/setting";
import { quotationRouter } from "~/server/api/routers/quotation";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  task: taskRouter,
  profile: profileRouter,
  staff: staffRouter,
  product: productRouter,
  setting: settingRouter,
  quotation: quotationRouter
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
