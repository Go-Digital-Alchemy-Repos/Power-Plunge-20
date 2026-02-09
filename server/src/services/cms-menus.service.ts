import { cmsMenusRepository } from "../repositories/cms-menus.repository";
import type { InsertCmsMenu } from "@shared/schema";

export class CmsMenusService {
  async list() {
    return cmsMenusRepository.findAll();
  }

  async getById(id: string) {
    return cmsMenusRepository.findById(id);
  }

  async getActiveByLocation(location: string) {
    return cmsMenusRepository.findActiveByLocation(location);
  }

  async getByLocation(location: string) {
    return cmsMenusRepository.findByLocation(location);
  }

  async create(data: InsertCmsMenu) {
    return cmsMenusRepository.create(data);
  }

  async update(id: string, data: Partial<InsertCmsMenu>) {
    const existing = await cmsMenusRepository.findById(id);
    if (!existing) return undefined;
    return cmsMenusRepository.update(id, data);
  }

  async remove(id: string) {
    return cmsMenusRepository.remove(id);
  }
}

export const cmsMenusService = new CmsMenusService();
