/**
 * Type patch for drizzle-zod@0.8.x + zod@3.25.x compatibility.
 *
 * Zod 3.25 ("mini" rewrite) changed the internal ZodObject hierarchy so that
 * ZodObject<…> no longer satisfies the old ZodType<any, any, any> constraint.
 * This causes TS2344 errors on every `createInsertSchema(table).omit(…)` call.
 *
 * The patch augments the drizzle-zod module to return a widened type that
 * TypeScript accepts, while Vite/esbuild (which skip type-checking) are
 * unaffected at runtime.
 *
 * Remove this file once drizzle-zod ships a compatible release.
 */
import type { Table } from "drizzle-orm";

declare module "drizzle-zod" {
  export function createInsertSchema<T extends Table>(
    table: T,
    refine?: Record<string, any>,
  ): any;
}
