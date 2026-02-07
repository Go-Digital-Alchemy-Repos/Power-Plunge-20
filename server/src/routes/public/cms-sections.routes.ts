import { Router, Request, Response } from "express";

const router = Router();

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { sectionsService } = await import(
      "../../services/sections.service"
    );
    const section = await sectionsService.getById(req.params.id);
    if (!section)
      return res.status(404).json({ error: "Section not found" });
    res.json({ id: section.id, name: section.name, blocks: section.blocks });
  } catch {
    res.status(500).json({ error: "Failed to fetch section" });
  }
});

export default router;
