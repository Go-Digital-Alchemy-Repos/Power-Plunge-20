import { sectionsRepository } from "../repositories/sections.repository";
import type { InsertSavedSection } from "@shared/schema";

export class SectionsService {
  async list() {
    return sectionsRepository.findAll();
  }

  async getById(id: string) {
    return sectionsRepository.findById(id);
  }

  async create(data: InsertSavedSection) {
    return sectionsRepository.create(data);
  }

  async update(id: string, data: Partial<InsertSavedSection>) {
    const existing = await sectionsRepository.findById(id);
    if (!existing) return undefined;
    return sectionsRepository.update(id, data);
  }

  async remove(id: string) {
    const existing = await sectionsRepository.findById(id);
    if (!existing) return undefined;
    return sectionsRepository.remove(id);
  }
}

export const sectionsService = new SectionsService();
