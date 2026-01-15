import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { quotations, settings } from "~/server/db/schema";
import { eq, and, desc } from "drizzle-orm"; // Import 'and' for security
import { generateNextId } from "~/lib/utils";

export const quotationRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.quotations.findMany({
      where: eq(quotations.orgId, ctx.auth.orgId),
      orderBy: [desc(quotations.createdAt)],
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        quotationNumber: z.string().min(2),
        quotationTitle: z.string().min(2),
        quotationDate: z.date(),
        quotationDueDate: z.date(),
        quotationFrom: z.string().min(2),
        quotationTo: z.string().min(2),
        quotationStatus: z
          .enum(["Draft", "Sent", "Approved", "Rejected"])
          .default("Draft"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(quotations).values({
        orgId: ctx.auth.orgId,
        quotationNumber: input.quotationNumber,
        quotationTitle: input.quotationTitle,
        quotationDate: input.quotationDate,
        quotationDueDate: input.quotationDueDate,
        quotationFrom: input.quotationFrom,
        quotationTo: input.quotationTo,
        quotationStatus: input.quotationStatus,
      });

      return { success: true };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        quotationNumber: z.string().min(2),
        quotationTitle: z.string().min(2),
        quotationDate: z.date(),
        quotationDueDate: z.date(),
        quotationFrom: z.string().min(2),
        quotationTo: z.string().min(2),
        quotationStatus: z
          .enum(["Draft", "Sent", "Approved", "Rejected"])
          .default("Draft"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
      .update(quotations)
        .set({
          quotationNumber: input.quotationNumber,
          quotationTitle: input.quotationTitle,
          quotationDate: input.quotationDate,
          quotationDueDate: input.quotationDueDate,
          quotationFrom: input.quotationFrom,
          quotationTo: input.quotationTo,
          quotationStatus: input.quotationStatus,
        })
        .where(
        and(
          eq(quotations.id, input.id),
          eq(quotations.orgId, ctx.auth.orgId),
        ),
      );
    }),

  delete: protectedProcedure
    .input(z.object({id:z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(quotations).where(eq(quotations.id, input.id));
    })
});