import { Router } from "express";
import { cmsV2Service } from "../../services/cms-v2.service";
import { sectionsService } from "../../services/sections.service";
import { insertPageSchema, insertSavedSectionSchema } from "@shared/schema";

const router = Router();

router.get("/health", (_req, res) => {
  res.json(cmsV2Service.getHealth());
});

router.get("/pages/home", async (_req, res) => {
  const page = await cmsV2Service.getHomePage();
  if (!page) return res.status(404).json({ error: "Home page not found" });
  res.json(page);
});

router.get("/pages/shop", async (_req, res) => {
  const page = await cmsV2Service.getShopPage();
  if (!page) return res.status(404).json({ error: "Shop page not found" });
  res.json(page);
});

router.get("/pages/:id", async (req, res) => {
  const page = await cmsV2Service.getPageById(req.params.id);
  if (!page) return res.status(404).json({ error: "Page not found" });
  res.json(page);
});

router.get("/pages", async (_req, res) => {
  const list = await cmsV2Service.listPages();
  res.json(list);
});

router.post("/pages", async (req, res) => {
  try {
    const parsed = insertPageSchema.parse(req.body);
    const page = await cmsV2Service.createPage(parsed);
    res.status(201).json(page);
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
    res.status(500).json({ error: "Failed to create page" });
  }
});

router.put("/pages/:id", async (req, res) => {
  try {
    const partial = insertPageSchema.partial().parse(req.body);
    const page = await cmsV2Service.updatePage(req.params.id, partial);
    if (!page) return res.status(404).json({ error: "Page not found" });
    res.json(page);
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
    res.status(500).json({ error: "Failed to update page" });
  }
});

router.post("/pages/:id/publish", async (req, res) => {
  const page = await cmsV2Service.publishPage(req.params.id);
  if (!page) return res.status(404).json({ error: "Page not found" });
  res.json(page);
});

router.post("/pages/:id/unpublish", async (req, res) => {
  const page = await cmsV2Service.unpublishPage(req.params.id);
  if (!page) return res.status(404).json({ error: "Page not found" });
  res.json(page);
});

router.post("/pages/:id/set-home", async (req, res) => {
  const page = await cmsV2Service.setHomePage(req.params.id);
  if (!page) return res.status(404).json({ error: "Page not found" });
  res.json(page);
});

router.post("/pages/:id/set-shop", async (req, res) => {
  const page = await cmsV2Service.setShopPage(req.params.id);
  if (!page) return res.status(404).json({ error: "Page not found" });
  res.json(page);
});

router.get("/sections", async (_req, res) => {
  const list = await sectionsService.list();
  res.json(list);
});

router.get("/sections/:id", async (req, res) => {
  const section = await sectionsService.getById(req.params.id);
  if (!section) return res.status(404).json({ error: "Section not found" });
  res.json(section);
});

router.post("/sections", async (req, res) => {
  try {
    const parsed = insertSavedSectionSchema.parse(req.body);
    const section = await sectionsService.create(parsed);
    res.status(201).json(section);
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
    res.status(500).json({ error: "Failed to create section" });
  }
});

router.put("/sections/:id", async (req, res) => {
  try {
    const partial = insertSavedSectionSchema.partial().parse(req.body);
    const section = await sectionsService.update(req.params.id, partial);
    if (!section) return res.status(404).json({ error: "Section not found" });
    res.json(section);
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
    res.status(500).json({ error: "Failed to update section" });
  }
});

router.delete("/sections/:id", async (req, res) => {
  const section = await sectionsService.remove(req.params.id);
  if (!section) return res.status(404).json({ error: "Section not found" });
  res.json({ success: true });
});

export default router;
