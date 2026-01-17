import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { clients } from "~/server/db/schema";
import { and, desc, eq } from "drizzle-orm";
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
        id: z.string(),
        name: z.string().min(2),
        industry: z.string().min(2).optional(),
        country: z.string().min(2),
        state: z.string().min(2).optional(),
        city: z.string().min(2),
        pincode: z.string().min(2).optional(),
        gst: z
          .string()
          .length(15, "GSTIN must be exactly 15 characters long.")
          .regex(
            /^[0-9]{2}[A-Z]{10}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
            "Invalid GST format",
          )
          .optional(),
        pan: z
          .string()
          .length(10, "PAN must be exactly 10 characters long")
          .regex(
            /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
            "Invalid PAN format (e.g., ABCDE1234F)",
          )
          .optional(),
        type: z.enum(["Individual", "Company"]).optional(),
        status: z.enum(["Active", "Inactive"]).optional(),
        address: z.string().min(2).optional(),
        shipping_address: z.string().min(2).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(clients).values({
        orgId: ctx.auth.orgId,
        ...input,
      });
      return { success: true };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2),
        industry: z.string().min(2).optional(),
        country: z.string().min(2),
        state: z.string().min(2).optional(),
        city: z.string().min(2),
        pincode: z.string().min(2).optional(),
        gst: z
          .string()
          .length(15, "GSTIN must be exactly 15 characters long.")
          .regex(
            /^[0-9]{2}[A-Z]{10}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
            "Invalid GST format",
          )
          .optional(),
        pan: z
          .string()
          .length(10, "PAN must be exactly 10 characters long")
          .regex(
            /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
            "Invalid PAN format (e.g., ABCDE1234F)",
          )
          .optional(),
        type: z.enum(["Individual", "Company"]).optional(),
        status: z.enum(["Active", "Inactive"]).optional(),
        address: z.string().min(2).optional(),
        shipping_address: z.string().min(2).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(clients)
        .set({
          ...input,
        })
        .where(
          and(eq(clients.id, input.id), eq(clients.orgId, ctx.auth.orgId)),
        );
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(clients).where(eq(clients.id, input.id));
    }),
});
