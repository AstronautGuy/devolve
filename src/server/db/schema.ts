  import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  timestamp,
  varchar,
  uuid,
  text,
  boolean,
  integer,
  decimal,
} from "drizzle-orm/pg-core";
/**
 * Use the same database instance for multiple projects.
 * This ensures your tables are prefixed (e.g. finity-erp_organization)
 */
export const createTable = pgTableCreator((name) => `devolve_${name}`);

// --- ORGANIZATION TABLE ---
export const organizations = createTable("organization", {
  // 1. Clerk ID (Primary Key)
  id: varchar("id", { length: 255 }).primaryKey(),

  // 2. Organization Name (Added back)
  name: varchar("name", { length: 256 }).notNull(),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const tasks = createTable(
  "task",
  {
    // Unique ID using UUID
    id: uuid("id").defaultRandom().primaryKey(),

    // The Link to Clerk: Stores "org_2aT..." string
    orgId: varchar("org_id", { length: 255 }).notNull(),

    // Task Details
    title: varchar("title", { length: 256 }).notNull(),
    description: text("description"),
    link: varchar("link", { length: 256 }), // e.g., "/dashboard/settings"

    // Status
    isCompleted: boolean("is_completed").default(false).notNull(),

    // Timestamps
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").$onUpdate(() => new Date()),
  },
  (table) => ({
    // Create an index on orgId for fast dashboard loading
    orgIdx: index("task_org_idx").on(table.orgId),
  }),
);

export const companyProfiles = createTable(
  "company_profile",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orgId: varchar("org_id", { length: 255 }).notNull(), // Link to Clerk

    // Business Details
    address: text("address"),
    gstId: varchar("tax_id", { length: 50 }),
    industry: varchar("industry", { length: 100 }),
    staff: varchar("staff", { length: 100 }),

    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").$onUpdate(() => new Date()),
  },
  (table) => ({
    orgIdx: index("profile_org_idx").on(table.orgId),
  }),
);

export const staff = createTable(
  "staff",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orgId: varchar("org_id", { length: 255 }).notNull(),

    // Basic Info
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    role: varchar("role", { length: 50 }).default("Employee").notNull(), // Admin, Manager, Employee

    // HR Details
    phone: varchar("phone", { length: 20 }),
    status: varchar("status", { length: 20 }).default("Active"), // Active, On Leave, Terminated

    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").$onUpdate(() => new Date()),
  },
  (table) => ({
    orgIdx: index("staff_org_idx").on(table.orgId),
    emailIdx: index("staff_email_idx").on(table.email),
  }),
);

export const products = createTable(
  "product",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orgId: varchar("org_id", { length: 255 }).notNull(),

    name: varchar("name", { length: 256 }).notNull(),
    sku: varchar("sku", { length: 100 }), // Stock Keeping Unit
    category: varchar("category", { length: 100 }),

    // Inventory Data
    quantity: integer("quantity").default(0).notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).default("0.00").notNull(),

    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updatedAt").$onUpdate(() => new Date()),
  },
  (table) => ({
    orgIdx: index("product_org_idx").on(table.orgId),
  })
);