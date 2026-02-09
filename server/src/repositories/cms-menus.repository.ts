import { eq } from "drizzle-orm";
import { db } from "../db";
import { cmsMenus } from "@shared/schema";
import type { InsertCmsMenu } from "@shared/schema";

export class CmsMenusRepository {
  async findAll() {
    return db.select().from(cmsMenus).orderBy(cmsMenus.name);
  }

  async findById(id: string) {
    const [menu] = await db.select().from(cmsMenus).where(eq(cmsMenus.id, id));
    return menu || undefined;
  }

  async findByLocation(location: string) {
    const [menu] = await db
      .select()
      .from(cmsMenus)
      .where(eq(cmsMenus.location, location));
    return menu || undefined;
  }

  async findActiveByLocation(location: string) {
    const [menu] = await db
      .select()
      .from(cmsMenus)
      .where(eq(cmsMenus.location, location));
    if (!menu || !menu.active) return undefined;
    return menu;
  }

  async create(data: InsertCmsMenu) {
    const [created] = await db.insert(cmsMenus).values(data).returning();
    return created;
  }

  async update(id: string, data: Partial<InsertCmsMenu>) {
    const [updated] = await db
      .update(cmsMenus)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(cmsMenus.id, id))
      .returning();
    return updated || undefined;
  }

  async remove(id: string) {
    const [deleted] = await db
      .delete(cmsMenus)
      .where(eq(cmsMenus.id, id))
      .returning();
    return deleted || undefined;
  }
}

export const cmsMenusRepository = new CmsMenusRepository();
