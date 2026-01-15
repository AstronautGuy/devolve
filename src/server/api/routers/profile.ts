import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { companyProfiles, tasks } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export const profileRouter = createTRPCRouter({
  // 1. Get Profile
  get: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.companyProfiles.findFirst({
      where: eq(companyProfiles.orgId, ctx.auth.orgId),
    });
  }),

  // 2. Update Profile (Upsert)
  update: protectedProcedure
    .input(
      z.object({
        address: z.string().min(3, "Address is too short"),
        gstId: z.string().optional(),
        industry: z.string().optional(),
        staff: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // A. Save the Profile Data
      const existing = await ctx.db.query.companyProfiles.findFirst({
        where: eq(companyProfiles.orgId, ctx.auth.orgId),
      });

      if (existing) {
        await ctx.db
          .update(companyProfiles)
          .set({
            address: input.address,
            gstId: input.gstId, // Drizzle maps this to 'tax_id' column
            industry: input.industry,
            staff: input.staff,
            isOnboarded: true,
          })
          .where(eq(companyProfiles.orgId, ctx.auth.orgId));
      } else {
        await ctx.db.insert(companyProfiles).values({
          orgId: ctx.auth.orgId,
          address: input.address,
          gstId: input.gstId,
          industry: input.industry,
          staff: input.staff,
          isOnboarded: true,
        });
      }

      // B. Auto-complete the onboarding task
      await ctx.db
        .update(tasks)
        .set({ isCompleted: true })
        .where(
          and(
            eq(tasks.orgId, ctx.auth.orgId),
            eq(tasks.title, "Action Required: Complete Setup"), // Matches Webhook Title
          ),
        );

      return { success: true };
    }),
});
