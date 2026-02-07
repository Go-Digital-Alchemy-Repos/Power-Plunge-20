import { Router, Request, Response } from "express";
import { z } from "zod";
import { storage } from "../../../storage";
import { validateContentJson, validatePageType } from "@shared/schema";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const pages = await storage.getPages();
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pages" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const page = await storage.getPage(req.params.id);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch page" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const contentJsonValidation = validateContentJson(req.body.contentJson);
    if (!contentJsonValidation.valid) {
      return res.status(400).json({
        message: "Invalid contentJson structure",
        error: contentJsonValidation.error,
      });
    }
    const pageTypeValidation = validatePageType(req.body.pageType);
    if (!pageTypeValidation.valid) {
      return res.status(400).json({
        message: "Invalid pageType",
        error: pageTypeValidation.error,
      });
    }
    const page = await storage.createPage(req.body);
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: "Failed to create page" });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    if (req.body.contentJson !== undefined) {
      const contentJsonValidation = validateContentJson(req.body.contentJson);
      if (!contentJsonValidation.valid) {
        return res.status(400).json({
          message: "Invalid contentJson structure",
          error: contentJsonValidation.error,
        });
      }
    }
    if (req.body.pageType !== undefined) {
      const pageTypeValidation = validatePageType(req.body.pageType);
      if (!pageTypeValidation.valid) {
        return res.status(400).json({
          message: "Invalid pageType",
          error: pageTypeValidation.error,
        });
      }
    }
    const page = await storage.updatePage(req.params.id, req.body);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.json(page);
  } catch (error) {
    console.error("[Pages] Failed to update page:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Failed to update page", error: errorMessage });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await storage.deletePage(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete page" });
  }
});

router.post("/:id/set-home", async (req: Request, res: Response) => {
  try {
    const page = await storage.setHomePage(req.params.id);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: "Failed to set home page" });
  }
});

router.post("/:id/set-shop", async (req: Request, res: Response) => {
  try {
    const page = await storage.setShopPage(req.params.id);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: "Failed to set shop page" });
  }
});

router.get("/:id/export", async (req: Request, res: Response) => {
  try {
    const page = await storage.getPage(req.params.id);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    const exportData = {
      exportVersion: 1,
      exportedAt: new Date().toISOString(),
      page: {
        title: page.title,
        slug: page.slug,
        content: page.content,
        contentJson: page.contentJson,
        pageType: page.pageType,
        template: page.template,
        isHome: page.isHome,
        isShop: page.isShop,
        featuredImage: page.featuredImage,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        metaKeywords: page.metaKeywords,
        canonicalUrl: page.canonicalUrl,
        ogTitle: page.ogTitle,
        ogDescription: page.ogDescription,
        ogImage: page.ogImage,
        twitterCard: page.twitterCard,
        twitterTitle: page.twitterTitle,
        twitterDescription: page.twitterDescription,
        twitterImage: page.twitterImage,
        robots: page.robots,
        status: page.status,
        showInNav: page.showInNav,
        navOrder: page.navOrder,
      },
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="page-${page.slug}-${Date.now()}.json"`
    );
    res.json(exportData);
  } catch (error) {
    console.error("Export page error:", error);
    res.status(500).json({ message: "Failed to export page" });
  }
});

const importPageSchema = z.object({
  exportData: z.object({
    exportVersion: z.number().optional(),
    exportedAt: z.string().optional(),
    page: z.object({
      title: z.string().min(1, "Page title is required"),
      slug: z.string().min(1, "Page slug is required"),
      content: z.string().nullable().optional(),
      contentJson: z.any().nullable().optional(),
      pageType: z.string().nullable().optional(),
      template: z.string().nullable().optional(),
      isHome: z.boolean().optional(),
      isShop: z.boolean().optional(),
      featuredImage: z.string().nullable().optional(),
      metaTitle: z.string().nullable().optional(),
      metaDescription: z.string().nullable().optional(),
      metaKeywords: z.string().nullable().optional(),
      canonicalUrl: z.string().nullable().optional(),
      ogTitle: z.string().nullable().optional(),
      ogDescription: z.string().nullable().optional(),
      ogImage: z.string().nullable().optional(),
      twitterCard: z.string().nullable().optional(),
      twitterTitle: z.string().nullable().optional(),
      twitterDescription: z.string().nullable().optional(),
      twitterImage: z.string().nullable().optional(),
      robots: z.string().nullable().optional(),
      status: z.string().optional(),
      showInNav: z.boolean().optional(),
      navOrder: z.number().optional(),
    }),
  }),
  mode: z.enum(["create", "update"]),
});

router.post("/import", async (req: Request, res: Response) => {
  try {
    const parseResult = importPageSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: "Invalid import data format",
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const { exportData, mode } = parseResult.data;
    const pageData = exportData.page;

    const normalizeSlug = (s: string) =>
      s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    const normalizedSlug = normalizeSlug(pageData.slug);

    const existingPage = await storage.getPageBySlug(normalizedSlug);

    if (mode === "create" || !existingPage) {
      let slug = normalizedSlug;
      if (existingPage) {
        slug = `${normalizedSlug}-${Date.now()}`;
      }

      const newPage = await storage.createPage({
        title: pageData.title,
        slug,
        content: pageData.content || null,
        contentJson: pageData.contentJson || null,
        pageType: pageData.pageType || "page",
        template: pageData.template || null,
        isHome: false,
        isShop: false,
        featuredImage: pageData.featuredImage || null,
        metaTitle: pageData.metaTitle || null,
        metaDescription: pageData.metaDescription || null,
        metaKeywords: pageData.metaKeywords || null,
        canonicalUrl: pageData.canonicalUrl || null,
        ogTitle: pageData.ogTitle || null,
        ogDescription: pageData.ogDescription || null,
        ogImage: pageData.ogImage || null,
        twitterCard: pageData.twitterCard || null,
        twitterTitle: pageData.twitterTitle || null,
        twitterDescription: pageData.twitterDescription || null,
        twitterImage: pageData.twitterImage || null,
        robots: pageData.robots || null,
        status: "draft",
        showInNav: pageData.showInNav || false,
        navOrder: pageData.navOrder || 0,
      });

      res.json({
        message: "Page imported successfully",
        page: newPage,
        action: "created",
      });
    } else if (mode === "update" && existingPage) {
      const updatedPage = await storage.updatePage(existingPage.id, {
        title: pageData.title,
        content: pageData.content || null,
        contentJson: pageData.contentJson || null,
        pageType: pageData.pageType || existingPage.pageType,
        template: pageData.template || existingPage.template,
        featuredImage: pageData.featuredImage || null,
        metaTitle: pageData.metaTitle || null,
        metaDescription: pageData.metaDescription || null,
        metaKeywords: pageData.metaKeywords || null,
        canonicalUrl: pageData.canonicalUrl || null,
        ogTitle: pageData.ogTitle || null,
        ogDescription: pageData.ogDescription || null,
        ogImage: pageData.ogImage || null,
        twitterCard: pageData.twitterCard || null,
        twitterTitle: pageData.twitterTitle || null,
        twitterDescription: pageData.twitterDescription || null,
        twitterImage: pageData.twitterImage || null,
        robots: pageData.robots || null,
        showInNav: pageData.showInNav ?? existingPage.showInNav,
        navOrder: pageData.navOrder ?? existingPage.navOrder,
      });

      res.json({
        message: "Page updated successfully",
        page: updatedPage,
        action: "updated",
      });
    } else {
      res.status(400).json({ message: "Invalid import mode" });
    }
  } catch (error) {
    console.error("Import page error:", error);
    res.status(500).json({ message: "Failed to import page" });
  }
});

router.post("/generate-seo", async (req: Request, res: Response) => {
  try {
    const { openaiService } = await import(
      "../../integrations/openai/OpenAIService"
    );

    const isConfigured = await openaiService.isConfigured();
    if (!isConfigured) {
      return res.status(400).json({
        message:
          "OpenAI is not configured. Please add your API key in Settings > Integrations.",
      });
    }

    const { title, content, pageType } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Page title is required" });
    }

    const seoData = await openaiService.generatePageSeoRecommendations(
      title,
      content || "",
      pageType || "page"
    );

    if (!seoData) {
      return res
        .status(500)
        .json({ message: "Failed to generate SEO recommendations" });
    }

    res.json(seoData);
  } catch (error) {
    console.error("SEO generation error:", error);
    res.status(500).json({ message: "Failed to generate SEO metadata" });
  }
});

export default router;
