import { sitePresetsRepo } from "../repositories/cmsV2.sitePresets.repo";
import { insertSitePresetSchema } from "../schemas/cmsV2.sitePresets.schema";
import type { SitePresetDb } from "@shared/schema";

class SitePresetsService {
  async list(): Promise<SitePresetDb[]> {
    return sitePresetsRepo.findAll();
  }

  async getById(id: string): Promise<SitePresetDb | undefined> {
    return sitePresetsRepo.findById(id);
  }

  async create(body: unknown): Promise<{ preset?: SitePresetDb; error?: string; details?: unknown }> {
    const parsed = insertSitePresetSchema.safeParse(body);
    if (!parsed.success) {
      return { error: "Invalid site preset data", details: parsed.error.flatten() };
    }
    const { name, description, tags, previewImage, ...configFields } = parsed.data;
    const preset = await sitePresetsRepo.create({
      name,
      description,
      tags,
      previewImage,
      config: configFields,
    });
    return { preset };
  }

  async update(id: string, body: unknown): Promise<{ preset?: SitePresetDb; error?: string; details?: unknown }> {
    const parsed = insertSitePresetSchema.safeParse(body);
    if (!parsed.success) {
      return { error: "Invalid site preset data", details: parsed.error.flatten() };
    }
    const { name, description, tags, previewImage, ...configFields } = parsed.data;
    const preset = await sitePresetsRepo.update(id, {
      name,
      description,
      tags,
      previewImage,
      config: configFields,
    });
    if (!preset) return { error: "Site preset not found" };
    return { preset };
  }

  async remove(id: string): Promise<{ success: boolean; error?: string }> {
    const deleted = await sitePresetsRepo.remove(id);
    if (!deleted) return { success: false, error: "Site preset not found" };
    return { success: true };
  }
}

export const sitePresetsService = new SitePresetsService();
