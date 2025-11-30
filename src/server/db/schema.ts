import { sql } from "drizzle-orm";
import { pgTableCreator, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Use the same database instance for multiple projects.
 * This ensures your tables are prefixed (e.g. finity-erp_organization)
 */
export const createTable = pgTableCreator((name) => `devolve_${name}`);

// --- ORGANIZATION TABLE ---
export const organizations = createTable(
  "organization",
  {
    // 1. Clerk ID (Primary Key)
    id: varchar("id", { length: 255 }).primaryKey(),

    // 2. Organization Name (Added back)
    name: varchar("name", { length: 256 }).notNull(),

    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }
);