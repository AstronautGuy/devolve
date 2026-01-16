import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { tasks } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";

export const tasksRouter = createTRPCRouter({
  // 1. Get the most recent pending task for this Org
  getPending: protectedProcedure.query(async ({ ctx }) => {
    // We use 'findFirst' to just get one alert at a time
    const task = await ctx.db.query.tasks.findFirst({
      where: and(
        eq(tasks.orgId, ctx.auth.orgId), // Security: Locked to current Org
        eq(tasks.isCompleted, false), // Logic: Only incomplete tasks
      ),
      orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
    });

    // FIX: Drizzle returns 'undefined' if not found, but tRPC needs 'null'
    return task ?? null;
  }),

  // 2. Mark a task as complete
  complete: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(tasks)
        .set({ isCompleted: true })
        .where(
          and(
            eq(tasks.id, input.taskId),
            eq(tasks.orgId, ctx.auth.orgId), // Double Security: Ensure they own it
          ),
        );
    }),
});
