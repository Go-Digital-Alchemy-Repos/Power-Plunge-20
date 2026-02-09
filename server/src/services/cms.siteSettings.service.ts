import { sitePresetsRepo } from "../repositories/cms.sitePresets.repo";
import { z } from "zod";
import {
  navPresetSchema,
  footerPresetSchema,
  seoDefaultsSchema,
  globalCtaDefaultsSchema,
} from "../schemas/cms.sitePresets.schema";

const updateSiteSettingsSchema = z.object({
  activeThemeId: z.string().min(1).optional(),
  activePresetId: z.string().nullable().optional(),
  navPreset: navPresetSchema.nullable().optional(),
  footerPreset: footerPresetSchema.nullable().optional(),
  seoDefaults: seoDefaultsSchema.nullable().optional(),
  globalCtaDefaults: globalCtaDefaultsSchema.nullable().optional(),
});

class CmsSiteSettingsService {
  async get() {
    return sitePresetsRepo.getCmsSettings();
  }

  async update(body: unknown, adminEmail?: string) {
    const parsed = updateSiteSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return { error: "Invalid site settings data", details: parsed.error.flatten() };
    }

    const updated = await sitePresetsRepo.updateCmsSettings(parsed.data);

    await sitePresetsRepo.logAudit(
      adminEmail || "system",
      "site_settings.updated",
      "main",
      { fields: Object.keys(parsed.data) },
    );

    return { settings: updated };
  }
}

export const cmsSiteSettingsService = new CmsSiteSettingsService();
