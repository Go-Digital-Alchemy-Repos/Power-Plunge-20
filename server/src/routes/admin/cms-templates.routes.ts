import { Router, Request, Response } from "express";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const { pageTemplates } = await import("@shared/pageTemplates");
    res.json(
      pageTemplates.map((t: any) => ({
        id: t.id,
        name: t.name,
        description: t.description,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch page templates" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { getTemplateById } = await import("@shared/pageTemplates");
    const template = getTemplateById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch page template" });
  }
});

export default router;
