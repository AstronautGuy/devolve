import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { eq } from "drizzle-orm";
import { settings } from "~/server/db/schema";

export const settingsRouter = createTRPCRouter({

  get: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.settings.findFirst({
      where: eq(settings.orgId, ctx.auth.orgId),
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        nextQuotationNumber: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // A. Save the Profile Data
      const existing = await ctx.db.query.companyProfiles.findFirst({
        where: eq(settings.orgId, ctx.auth.orgId),
      });

      if (existing) {
        await ctx.db
          .update(settings)
          .set({
            nextQuotationNumber: input.nextQuotationNumber,
          })
          .where(eq(settings.orgId, ctx.auth.orgId));
      } else {
        await ctx.db.insert(settings).values({
          orgId: ctx.auth.orgId,
          nextQuotationNumber: input.nextQuotationNumber,
        });
        }
      }),
});