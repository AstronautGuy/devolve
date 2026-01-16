import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { quotations, settings } from "~/server/db/schema";
import { eq, and, desc } from "drizzle-orm"; // Import 'and' for security
import { generateNextId } from "~/lib/utils";

export const quotationsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.quotations.findMany({
      where: eq(quotations.orgId, ctx.auth.orgId),
      orderBy: [desc(quotations.createdAt)],
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        number: z.string().min(2),
        title: z.string().min(2),
        subTitle: z.string().min(2),
        date: z.date().optional(),
        dueDate: z.date().optional(),
        from: z.string().min(2),
        to: z.string().min(2),
        status: z
          .enum(["Draft", "Sent", "Approved", "Rejected"])
          .default("Draft"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(quotations).values({
        orgId: ctx.auth.orgId,
        number: input.number,
        title: input.title,
        subTitle: input.subTitle,
        date: input.date,
        dueDate: input.dueDate,
        from: input.from,
        to: input.to,
        status: input.status,
      });

      return { success: true };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        number: z.string().min(2),
        title: z.string().min(2),
        subTitle: z.string().min(2).optional(),
        date: z.date().optional(),
        dueDate: z.date().optional(),
        from: z.string().min(2),
        to: z.string().min(2),
        status: z
          .enum(["Draft", "Sent", "Approved", "Rejected"])
          .default("Draft"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(quotations)
        .set({
          number: input.number,
          title: input.title,
          subTitle: input.subTitle,
          date: input.date,
          dueDate: input.dueDate,
          from: input.from,
          to: input.to,
          status: input.status,
        })
        .where(
          and(
            eq(quotations.id, input.id),
            eq(quotations.orgId, ctx.auth.orgId),
          ),
        );
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(quotations)
        .where(
          and(
            eq(quotations.id, input.id),
            eq(quotations.orgId, ctx.auth.orgId),
          ),
        );
    }),
});
