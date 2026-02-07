import { eq, desc, and, lte, sql } from "drizzle-orm";
import { db } from "../db";
import { cmsV2Posts } from "@shared/schema";
import type { InsertCmsV2Post } from "@shared/schema";

export class CmsV2PostsRepository {
  async findAll() {
    return db.select().from(cmsV2Posts).orderBy(desc(cmsV2Posts.createdAt));
  }

  async findById(id: string) {
    const [post] = await db.select().from(cmsV2Posts).where(eq(cmsV2Posts.id, id));
    return post || undefined;
  }

  async findBySlug(slug: string) {
    const [post] = await db.select().from(cmsV2Posts).where(eq(cmsV2Posts.slug, slug));
    return post || undefined;
  }

  async findPublished() {
    return db
      .select()
      .from(cmsV2Posts)
      .where(
        and(
          eq(cmsV2Posts.status, "published"),
          lte(cmsV2Posts.publishedAt, new Date())
        )
      )
      .orderBy(desc(cmsV2Posts.publishedAt));
  }

  async findPublishedBySlug(slug: string) {
    const [post] = await db
      .select()
      .from(cmsV2Posts)
      .where(
        and(
          eq(cmsV2Posts.slug, slug),
          eq(cmsV2Posts.status, "published"),
          lte(cmsV2Posts.publishedAt, new Date())
        )
      );
    return post || undefined;
  }

  async create(data: InsertCmsV2Post) {
    const [created] = await db.insert(cmsV2Posts).values(data).returning();
    return created;
  }

  async update(id: string, data: Partial<InsertCmsV2Post>) {
    const [updated] = await db
      .update(cmsV2Posts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(cmsV2Posts.id, id))
      .returning();
    return updated || undefined;
  }

  async remove(id: string) {
    const [deleted] = await db
      .delete(cmsV2Posts)
      .where(eq(cmsV2Posts.id, id))
      .returning();
    return deleted || undefined;
  }

  async listTags() {
    const rows = await db
      .select({ tags: cmsV2Posts.tags })
      .from(cmsV2Posts);
    const tagSet = new Set<string>();
    for (const row of rows) {
      for (const tag of row.tags) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort();
  }

  async listCategories() {
    const rows = await db
      .selectDistinct({ category: cmsV2Posts.category })
      .from(cmsV2Posts)
      .where(sql`${cmsV2Posts.category} IS NOT NULL`);
    return rows.map((r) => r.category).filter(Boolean) as string[];
  }
}

export const cmsV2PostsRepository = new CmsV2PostsRepository();
