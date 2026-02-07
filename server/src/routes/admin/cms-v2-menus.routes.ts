import { Router } from "express";
import { cmsV2MenusService } from "../../services/cms-v2-menus.service";
import { insertCmsV2MenuSchema } from "@shared/schema";
import { isCmsV2Enabled } from "../../config/env";

const router = Router();

router.use((_req, res, next) => {
  if (!isCmsV2Enabled()) {
    return res.status(403).json({ error: "CMS v2 is not enabled" });
  }
  next();
});

router.get("/", async (_req, res) => {
  const menus = await cmsV2MenusService.list();
  res.json(menus);
});

router.get("/:id", async (req, res) => {
  const menu = await cmsV2MenusService.getById(req.params.id);
  if (!menu) return res.status(404).json({ error: "Menu not found" });
  res.json(menu);
});

router.post("/", async (req, res) => {
  try {
    const parsed = insertCmsV2MenuSchema.parse(req.body);
    const menu = await cmsV2MenusService.create(parsed);
    res.status(201).json(menu);
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
    console.error("[CMS-V2-MENUS] Create error:", err);
    res.status(500).json({ error: "Failed to create menu" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const partial = insertCmsV2MenuSchema.partial().parse(req.body);
    const menu = await cmsV2MenusService.update(req.params.id, partial);
    if (!menu) return res.status(404).json({ error: "Menu not found" });
    res.json(menu);
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
    console.error("[CMS-V2-MENUS] Update error:", err);
    res.status(500).json({ error: "Failed to update menu" });
  }
});

router.delete("/:id", async (req, res) => {
  const menu = await cmsV2MenusService.remove(req.params.id);
  if (!menu) return res.status(404).json({ error: "Menu not found" });
  res.json({ success: true });
});

export default router;
