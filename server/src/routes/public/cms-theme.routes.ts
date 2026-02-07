import { Router, Request, Response } from "express";
import { storage } from "../../../storage";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const theme = await storage.getThemeSettings();
    res.json(theme || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch theme settings" });
  }
});

router.get("/active", async (_req: Request, res: Response) => {
  try {
    const { themePresets } = await import("@shared/themePresets");
    const { siteSettings } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const { db } = await import("../../db");
    const [settings] = await db
      .select({ activeThemeId: siteSettings.activeThemeId })
      .from(siteSettings)
      .where(eq(siteSettings.id, "main"));
    const activeId = settings?.activeThemeId || "arctic-default";
    const preset =
      themePresets.find((t: any) => t.id === activeId) || themePresets[0];
    res.json(preset);
  } catch {
    const { themePresets } = await import("@shared/themePresets");
    res.json(themePresets[0]);
  }
});

export default router;
