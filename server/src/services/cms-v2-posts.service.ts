import { cmsV2PostsRepository } from "../repositories/cms-v2-posts.repository";
import type { InsertCmsV2Post } from "@shared/schema";

export class CmsV2PostsService {
  async list() {
    return cmsV2PostsRepository.findAll();
  }

  async getById(id: string) {
    return cmsV2PostsRepository.findById(id);
  }

  async getBySlug(slug: string) {
    return cmsV2PostsRepository.findBySlug(slug);
  }

  async listPublished() {
    return cmsV2PostsRepository.findPublished();
  }

  async getPublishedBySlug(slug: string) {
    return cmsV2PostsRepository.findPublishedBySlug(slug);
  }

  async create(data: InsertCmsV2Post) {
    return cmsV2PostsRepository.create(data);
  }

  async update(id: string, data: Partial<InsertCmsV2Post>) {
    const existing = await cmsV2PostsRepository.findById(id);
    if (!existing) return undefined;
    return cmsV2PostsRepository.update(id, data);
  }

  async publish(id: string) {
    const existing = await cmsV2PostsRepository.findById(id);
    if (!existing) return undefined;
    return cmsV2PostsRepository.update(id, {
      status: "published",
      publishedAt: new Date(),
    });
  }

  async unpublish(id: string) {
    const existing = await cmsV2PostsRepository.findById(id);
    if (!existing) return undefined;
    return cmsV2PostsRepository.update(id, {
      status: "draft",
      publishedAt: null,
    });
  }

  async remove(id: string) {
    return cmsV2PostsRepository.remove(id);
  }

  async listTags() {
    return cmsV2PostsRepository.listTags();
  }

  async listCategories() {
    return cmsV2PostsRepository.listCategories();
  }

  async checkSlug(slug: string) {
    const existing = await cmsV2PostsRepository.findBySlug(slug);
    return { available: !existing, slug };
  }
}

export const cmsV2PostsService = new CmsV2PostsService();
