import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { products } from "~/server/db/schema";
import { eq, desc, and } from "drizzle-orm";

export const productRouter = createTRPCRouter({
  // 1. Get All Products
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.products.findMany({
      where: eq(products.orgId, ctx.auth.orgId),
      orderBy: [desc(products.createdAt)],
    });
  }),

  // 2. Create Product
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2),
        sku: z.string().optional(),
        category: z.string().optional(),
        quantity: z.number().min(0),
        price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"), // "10.99"
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(products).values({
        orgId: ctx.auth.orgId,
        name: input.name,
        sku: input.sku,
        category: input.category,
        quantity: input.quantity,
        price: input.price,
      });
    }),

  // 3. Update Product
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2),
        sku: z.string().optional(),
        category: z.string().optional(),
        quantity: z.number().min(0),
        price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(products)
        .set({
          name: input.name,
          sku: input.sku,
          category: input.category,
          quantity: input.quantity,
          price: input.price,
        })
        .where(
          and(eq(products.id, input.id), eq(products.orgId, ctx.auth.orgId)),
        );
    }),

  // 4. Delete Product
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(products)
        .where(
          and(eq(products.id, input.id), eq(products.orgId, ctx.auth.orgId)),
        );
    }),
});
