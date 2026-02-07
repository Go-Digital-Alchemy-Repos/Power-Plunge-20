import type { CmsV2HealthResponse } from "../schemas/cms-v2.schema";
import type { InsertPage } from "@shared/schema";
import { cmsV2Repository } from "../repositories/cms-v2.repository";

export class CmsV2Service {
  getHealth(): CmsV2HealthResponse {
    return { ok: true };
  }

  async listPages() {
    return cmsV2Repository.findAll();
  }

  async getPageById(id: string) {
    return cmsV2Repository.findById(id);
  }

  async getHomePage() {
    return cmsV2Repository.findHome();
  }

  async getShopPage() {
    return cmsV2Repository.findShop();
  }

  async checkSlug(slug: string) {
    const existing = await cmsV2Repository.findBySlug(slug);
    return { available: !existing, slug };
  }

  async createPage(data: InsertPage) {
    return cmsV2Repository.create(data);
  }

  async updatePage(id: string, data: Partial<InsertPage>) {
    const existing = await cmsV2Repository.findById(id);
    if (!existing) return undefined;
    return cmsV2Repository.update(id, data);
  }

  async publishPage(id: string) {
    const existing = await cmsV2Repository.findById(id);
    if (!existing) return undefined;
    return cmsV2Repository.update(id, { status: "published" });
  }

  async unpublishPage(id: string) {
    const existing = await cmsV2Repository.findById(id);
    if (!existing) return undefined;
    return cmsV2Repository.update(id, { status: "draft" });
  }

  async setHomePage(id: string) {
    const existing = await cmsV2Repository.findById(id);
    if (!existing) return undefined;
    return cmsV2Repository.setHome(id);
  }

  async setShopPage(id: string) {
    const existing = await cmsV2Repository.findById(id);
    if (!existing) return undefined;
    return cmsV2Repository.setShop(id);
  }
}

export const cmsV2Service = new CmsV2Service();
