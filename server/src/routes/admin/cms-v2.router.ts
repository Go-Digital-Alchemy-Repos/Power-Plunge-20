import { Router } from "express";
import { cmsV2Service } from "../../services/cms-v2.service";

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

export default router;
