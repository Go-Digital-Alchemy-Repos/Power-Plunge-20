import { eq, desc, and, lte, sql } from "drizzle-orm";
import { db } from "../db";
import { cmsPosts } from "@shared/schema";
import type { InsertCmsPost } from "@shared/schema";

export class CmsPostsRepository {
  async findAll() {
    return db.select().from(cmsPosts).orderBy(desc(cmsPosts.createdAt));
  }

  async findById(id: string) {
    const [post] = await db.select().from(cmsPosts).where(eq(cmsPosts.id, id));
    return post || undefined;
  }

  async findBySlug(slug: string) {
    const [post] = await db.select().from(cmsPosts).where(eq(cmsPosts.slug, slug));
    return post || undefined;
  }

  async findPublished() {
    return db
      .select()
      .from(cmsPosts)
      .where(
        and(
          eq(cmsPosts.status, "published"),
          lte(cmsPosts.publishedAt, new Date())
        )
      )
      .orderBy(desc(cmsPosts.publishedAt));
  }

  async findPublishedBySlug(slug: string) {
    const [post] = await db
      .select()
      .from(cmsPosts)
      .where(
        and(
          eq(cmsPosts.slug, slug),
          eq(cmsPosts.status, "published"),
          lte(cmsPosts.publishedAt, new Date())
        )
      );
    return post || undefined;
  }

  async create(data: InsertCmsPost) {
    const [created] = await db.insert(cmsPosts).values(data).returning();
    return created;
  }

  async update(id: string, data: Partial<InsertCmsPost>) {
    const [updated] = await db
      .update(cmsPosts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(cmsPosts.id, id))
      .returning();
    return updated || undefined;
  }

  async remove(id: string) {
    const [deleted] = await db
      .delete(cmsPosts)
      .where(eq(cmsPosts.id, id))
      .returning();
    return deleted || undefined;
  }

  async listTags() {
    const rows = await db
      .select({ tags: cmsPosts.tags })
      .from(cmsPosts);
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
      .selectDistinct({ category: cmsPosts.category })
      .from(cmsPosts)
      .where(sql`${cmsPosts.category} IS NOT NULL`);
    return rows.map((r) => r.category).filter(Boolean) as string[];
  }
}

export const cmsPostsRepository = new CmsPostsRepository();
