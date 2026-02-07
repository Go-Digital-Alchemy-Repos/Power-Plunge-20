import { eq } from "drizzle-orm";
import { db } from "../db";
import { cmsV2Menus } from "@shared/schema";
import type { InsertCmsV2Menu } from "@shared/schema";

export class CmsV2MenusRepository {
  async findAll() {
    return db.select().from(cmsV2Menus).orderBy(cmsV2Menus.name);
  }

  async findById(id: string) {
    const [menu] = await db.select().from(cmsV2Menus).where(eq(cmsV2Menus.id, id));
    return menu || undefined;
  }

  async findByLocation(location: string) {
    const [menu] = await db
      .select()
      .from(cmsV2Menus)
      .where(eq(cmsV2Menus.location, location));
    return menu || undefined;
  }

  async findActiveByLocation(location: string) {
    const [menu] = await db
      .select()
      .from(cmsV2Menus)
      .where(eq(cmsV2Menus.location, location));
    if (!menu || !menu.active) return undefined;
    return menu;
  }

  async create(data: InsertCmsV2Menu) {
    const [created] = await db.insert(cmsV2Menus).values(data).returning();
    return created;
  }

  async update(id: string, data: Partial<InsertCmsV2Menu>) {
    const [updated] = await db
      .update(cmsV2Menus)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(cmsV2Menus.id, id))
      .returning();
    return updated || undefined;
  }

  async remove(id: string) {
    const [deleted] = await db
      .delete(cmsV2Menus)
      .where(eq(cmsV2Menus.id, id))
      .returning();
    return deleted || undefined;
  }
}

export const cmsV2MenusRepository = new CmsV2MenusRepository();
