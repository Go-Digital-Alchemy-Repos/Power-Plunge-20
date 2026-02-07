import { Router, Request, Response } from "express";
import { storage } from "../../../storage";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const sections = category
      ? await storage.getSavedSectionsByCategory(category)
      : await storage.getSavedSections();
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch saved sections" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const section = await storage.getSavedSection(req.params.id);
    if (!section) {
      return res.status(404).json({ message: "Saved section not found" });
    }
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch saved section" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const section = await storage.createSavedSection(req.body);
    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ message: "Failed to create saved section" });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const section = await storage.updateSavedSection(req.params.id, req.body);
    if (!section) {
      return res.status(404).json({ message: "Saved section not found" });
    }
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: "Failed to update saved section" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await storage.deleteSavedSection(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete saved section" });
  }
});

export default router;
