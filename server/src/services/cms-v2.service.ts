import type { CmsV2HealthResponse } from "../schemas/cms-v2.schema";
import { cmsV2Repository } from "../repositories/cms-v2.repository";

export class CmsV2Service {
  getHealth(): CmsV2HealthResponse {
    return { ok: true };
  }

  async listPages() {
    return cmsV2Repository.findAll();
  }

  async getPageById(id: string) {
    return cmsV2Repository.findById(id);
  }

  async getHomePage() {
    return cmsV2Repository.findHome();
  }

  async getShopPage() {
    return cmsV2Repository.findShop();
  }
}

export const cmsV2Service = new CmsV2Service();
