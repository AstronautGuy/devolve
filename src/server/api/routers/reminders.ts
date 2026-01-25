import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { reminders } from "~/server/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

export const remindersRouter = createTRPCRouter({
  // 1. GET ALL: Fetch reminders for the logged-in user's Organization
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.reminders.findMany({
      where: eq(reminders.orgId, ctx.auth.orgId),
      // Order by date (soonest first) or created_at
      orderBy: [desc(reminders.start_date)],
    });
  }),

  // 2. CREATE: Add a new reminder
  create: protectedProcedure
    .input(
      z.object({
        // 'id' is omitted here because your schema has .defaultRandom()
        client_name: z.string().min(1, "Client name is required"),
        client_email: z.string().email("Invalid email address"),
        phone: z.string().optional(),
        product_name: z.string().min(1, "Product name is required"),

        // Use z.date() if your frontend sends Date objects, or z.coerce.date() if strings
        date: z.date({ required_error: "Reminder date is required" }),
        startDate: z.date().optional(),
        endDate: z.date().optional(),

        // Status is optional on create (defaults to 'pending' in DB)
        status: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(reminders).values({
        orgId: ctx.auth.orgId,
        ...input,
      });
      return { success: true };
    }),

  // 3. UPDATE: Modify an existing reminder
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(), // ID is required for updates
        client_name: z.string().min(1).optional(),
        client_email: z.string().email().optional(),
        phone: z.string().optional(),
        product_name: z.string().min(1).optional(),
        date: z.date().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        status: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      await ctx.db
        .update(reminders)
        .set(updateData)
        .where(
          and(
            eq(reminders.id, id),
            eq(reminders.orgId, ctx.auth.orgId), // Security: Ensure they own the reminder
          ),
        );

      return { success: true };
    }),

  // 4. DELETE: Remove a reminder
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(reminders).where(
        and(
          eq(reminders.id, input.id),
          eq(reminders.orgId, ctx.auth.orgId), // Security check
        ),
      );

      return { success: true };
    }),
});