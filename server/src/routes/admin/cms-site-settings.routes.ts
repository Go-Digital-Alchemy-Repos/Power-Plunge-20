import { Router } from "express";
import { cmsSiteSettingsService } from "../../services/cms.siteSettings.service";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const settings = await cmsSiteSettingsService.get();
    res.json(settings);
  } catch {
    res.status(500).json({ error: "Failed to fetch site settings" });
  }
});

router.put("/", async (req, res) => {
  try {
    const adminEmail = (req as any).adminUser?.email || "unknown";
    const result = await cmsSiteSettingsService.update(req.body, adminEmail);
    if ("error" in result && result.error) {
      const status = result.error.includes("not found") ? 404 : 400;
      return res.status(status).json({ error: result.error, details: (result as any).details });
    }
    res.json(result.settings);
  } catch {
    res.status(500).json({ error: "Failed to update site settings" });
  }
});

export default router;
