import { eq } from "drizzle-orm";
import { db } from "../../db";
import { pages } from "@shared/schema";

export class CmsV2Repository {
  async findAll() {
    return db.select().from(pages).orderBy(pages.navOrder);
  }

  async findById(id: string) {
    const [page] = await db.select().from(pages).where(eq(pages.id, id));
    return page || undefined;
  }

  async findHome() {
    const [page] = await db.select().from(pages).where(eq(pages.isHome, true));
    return page || undefined;
  }

  async findShop() {
    const [page] = await db.select().from(pages).where(eq(pages.isShop, true));
    return page || undefined;
  }
}

export const cmsV2Repository = new CmsV2Repository();
