import { Router } from "express";
import { cmsPostsService } from "../../services/cms-posts.service";
import { cmsMenusService } from "../../services/cms-menus.service";

const router = Router();

router.get("/posts", async (_req, res) => {
  const posts = await cmsPostsService.listPublished();
  res.json(posts);
});

router.get("/posts/:slug", async (req, res) => {
  const post = await cmsPostsService.getPublishedBySlug(req.params.slug);
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

router.get("/tags", async (_req, res) => {
  const tags = await cmsPostsService.listTags();
  res.json(tags);
});

router.get("/categories", async (_req, res) => {
  const categories = await cmsPostsService.listCategories();
  res.json(categories);
});

export default router;

export const publicMenuRoutes = Router();

publicMenuRoutes.get("/:location", async (req, res) => {
  const menu = await cmsMenusService.getActiveByLocation(req.params.location);
  res.json(menu || null);
});
