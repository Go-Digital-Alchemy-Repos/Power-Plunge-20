import { cmsV2MenusRepository } from "../repositories/cms-v2-menus.repository";
import type { InsertCmsV2Menu } from "@shared/schema";

export class CmsV2MenusService {
  async list() {
    return cmsV2MenusRepository.findAll();
  }

  async getById(id: string) {
    return cmsV2MenusRepository.findById(id);
  }

  async getActiveByLocation(location: string) {
    return cmsV2MenusRepository.findActiveByLocation(location);
  }

  async getByLocation(location: string) {
    return cmsV2MenusRepository.findByLocation(location);
  }

  async create(data: InsertCmsV2Menu) {
    return cmsV2MenusRepository.create(data);
  }

  async update(id: string, data: Partial<InsertCmsV2Menu>) {
    const existing = await cmsV2MenusRepository.findById(id);
    if (!existing) return undefined;
    return cmsV2MenusRepository.update(id, data);
  }

  async remove(id: string) {
    return cmsV2MenusRepository.remove(id);
  }
}

export const cmsV2MenusService = new CmsV2MenusService();
