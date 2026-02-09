import { cmsPostsRepository } from "../repositories/cms-posts.repository";
import type { InsertCmsPost } from "@shared/schema";

export class CmsPostsService {
  async list() {
    return cmsPostsRepository.findAll();
  }

  async getById(id: string) {
    return cmsPostsRepository.findById(id);
  }

  async getBySlug(slug: string) {
    return cmsPostsRepository.findBySlug(slug);
  }

  async listPublished() {
    return cmsPostsRepository.findPublished();
  }

  async getPublishedBySlug(slug: string) {
    return cmsPostsRepository.findPublishedBySlug(slug);
  }

  async create(data: InsertCmsPost) {
    return cmsPostsRepository.create(data);
  }

  async update(id: string, data: Partial<InsertCmsPost>) {
    const existing = await cmsPostsRepository.findById(id);
    if (!existing) return undefined;
    return cmsPostsRepository.update(id, data);
  }

  async publish(id: string) {
    const existing = await cmsPostsRepository.findById(id);
    if (!existing) return undefined;
    return cmsPostsRepository.update(id, {
      status: "published",
      publishedAt: new Date(),
    });
  }

  async unpublish(id: string) {
    const existing = await cmsPostsRepository.findById(id);
    if (!existing) return undefined;
    return cmsPostsRepository.update(id, {
      status: "draft",
      publishedAt: null,
    });
  }

  async remove(id: string) {
    return cmsPostsRepository.remove(id);
  }

  async listTags() {
    return cmsPostsRepository.listTags();
  }

  async listCategories() {
    return cmsPostsRepository.listCategories();
  }

  async checkSlug(slug: string) {
    const existing = await cmsPostsRepository.findBySlug(slug);
    return { available: !existing, slug };
  }
}

export const cmsPostsService = new CmsPostsService();
