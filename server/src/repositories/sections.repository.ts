import { eq } from "drizzle-orm";
import { db } from "../../db";
import { savedSections } from "@shared/schema";
import type { InsertSavedSection } from "@shared/schema";

export class SectionsRepository {
  async findAll() {
    return db.select().from(savedSections).orderBy(savedSections.name);
  }

  async findById(id: string) {
    const [section] = await db.select().from(savedSections).where(eq(savedSections.id, id));
    return section || undefined;
  }

  async create(data: InsertSavedSection) {
    const [created] = await db.insert(savedSections).values(data).returning();
    return created;
  }

  async update(id: string, data: Partial<InsertSavedSection>) {
    const [updated] = await db
      .update(savedSections)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(savedSections.id, id))
      .returning();
    return updated || undefined;
  }

  async remove(id: string) {
    const [deleted] = await db
      .delete(savedSections)
      .where(eq(savedSections.id, id))
      .returning();
    return deleted || undefined;
  }
}

export const sectionsRepository = new SectionsRepository();
