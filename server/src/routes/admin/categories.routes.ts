import { Router, Request, Response } from "express";
import { storage } from "../../../storage";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const categories = await storage.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const category = await storage.createCategory(req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to create category" });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const category = await storage.updateCategory(req.params.id, req.body);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to update category" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await storage.deleteCategory(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category" });
  }
});

export default router;
