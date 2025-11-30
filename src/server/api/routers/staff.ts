import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { staff } from "~/server/db/schema";
import { eq, desc, and } from "drizzle-orm";

export const staffRouter = createTRPCRouter({

  // 1. Get All Staff for current Org
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.staff.findMany({
      where: eq(staff.orgId, ctx.auth.orgId),
      orderBy: [desc(staff.createdAt)],
    });
  }),

  // 2. Add New Staff
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(2),
      email: z.string().email(),
      role: z.enum(["Admin", "Manager", "Employee"]),
      phone: z.string().optional(),
      status: z.enum(["Active", "Inactive", "On Leave", "Terminated"]).default("Active"),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(staff).values({
        orgId: ctx.auth.orgId,
        name: input.name,
        email: input.email,
        role: input.role,
        phone: input.phone,
        status: input.status,
      });

      return { success: true };
    }),

  // 3. Update Staff (NEW)
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(2),
      email: z.string().email(),
      role: z.enum(["Admin", "Manager", "Employee"]),
      phone: z.string().optional(),
      status: z.enum(["Active", "Inactive", "On Leave", "Terminated"]),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(staff)
        .set({
          name: input.name,
          email: input.email,
          role: input.role,
          phone: input.phone,
          status: input.status,
        })
        .where(
          and(
            eq(staff.id, input.id),
            eq(staff.orgId, ctx.auth.orgId) // Security check
          )
        );
    }),

  // 4. Delete Staff
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(staff).where(eq(staff.id, input.id));
    }),
});