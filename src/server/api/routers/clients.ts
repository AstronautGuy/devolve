import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { clients } from "~/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export const clientsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.clients.findMany({
      where: eq(clients.orgId, ctx.auth.orgId),
      orderBy: [desc(clients.createdAt)],
      });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2),
      })
    )
})