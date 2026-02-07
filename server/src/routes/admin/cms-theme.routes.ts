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

router.patch("/", async (req: Request, res: Response) => {
  try {
    const theme = await storage.updateThemeSettings(req.body);
    res.json(theme);
  } catch (error) {
    res.status(500).json({ message: "Failed to update theme settings" });
  }
});

export default router;
