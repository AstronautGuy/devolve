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
    .input(z.object({
      address: z.string().min(1),
      gstId: z.string().optional(),
      industry: z.string().optional(),
      staff: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // A. Save the Profile Data
      // We check if it exists first to decide between insert vs update,
      // or use ON CONFLICT if your driver supports it. For simplicity in Drizzle:
      const existing = await ctx.db.query.companyProfiles.findFirst({
        where: eq(companyProfiles.orgId, ctx.auth.orgId),
      });

      if (existing) {
        await ctx.db.update(companyProfiles)
          .set({
            address: input.address,
            gstId: input.gstId,
            industry: input.industry,
            staff: input.staff
          })
          .where(eq(companyProfiles.orgId, ctx.auth.orgId));
      } else {
        await ctx.db.insert(companyProfiles).values({
          orgId: ctx.auth.orgId,
          address: input.address,
          gstId: input.gstId,
          industry: input.industry,
          staff: input.staff,
        });
      }

      // B. MAGIC: Auto-complete the onboarding task!
      // Find the specific onboarding task and mark it done.
      await ctx.db
        .update(tasks)
        .set({ isCompleted: true })
        .where(
          and(
            eq(tasks.orgId, ctx.auth.orgId),
            eq(tasks.title, "Complete Company Setup") // Matches our Webhook title
          )
        );

      return { success: true };
    }),
});