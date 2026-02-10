# CMS Posts Dual-Stack Convergence Plan

**Date:** February 10, 2026
**Status:** Analysis complete, awaiting cleanup decision

## Current State: Two Parallel Stacks

### Stack A — "Feature-Rich" (ACTIVE, in production)

| Layer | File | Key Class/Export |
|-------|------|------------------|
| Routes (admin) | `server/src/routes/admin/cms-posts-v2.routes.ts` | Mounted at `/api/admin/cms` |
| Routes (public) | `server/src/routes/public/blog-v2.routes.ts` | Mounted at `/api/blog` |
| Service | `server/src/services/cms.posts.service.ts` | `postsService` |
| Repository | `server/src/repositories/cms.posts.repo.ts` | `postsRepository` |
| Schemas | `server/src/schemas/cms.posts.schema.ts` | Zod validation schemas |
| DB Tables | `posts`, `postCategories`, `postTags`, `postCategoryMap`, `postTagMap`, `postRevisions`, `postSettings` | Defined in `shared/schema.ts` |

**Consumers:**
- `client/src/pages/admin-cms-posts.tsx` — post list, filtering, bulk actions
- `client/src/pages/admin-cms-post-editor.tsx` — rich editor with categories, tags, revisions, scheduling
- `client/src/pages/admin-cms-post-builder.tsx` — block-based post builder

**Features:** Pagination, filtering, search, categories, tags, revisions, scheduling, publish/unpublish/archive, settings, media.

### Stack B — "Simple" (DEAD CODE, not mounted)

| Layer | File | Key Class/Export |
|-------|------|------------------|
| Routes (admin) | `server/src/routes/admin/cms-posts.routes.ts` | **NOT imported in `server/routes.ts`** |
| Service | `server/src/services/cms-posts.service.ts` | `cmsPostsService` |
| Repository | `server/src/repositories/cms-posts.repository.ts` | `cmsPostsRepository` |
| DB Table | `cmsPosts` → `cms_v2_posts` | Defined in `shared/schema.ts` |

**Consumers:** None. No frontend page imports or calls these routes.

**Features:** Basic CRUD only (list, getById, getBySlug, create, update, delete, published filtering).

### Backward-Compatibility Stub

`server/src/routes/cms.posts.routes.ts` re-exports from `./admin/cms-posts-v2.routes` for legacy import paths.

## Recommendation

**Keep Stack A as the canonical CMS posts system.** It is fully integrated with the admin UI, supports the complete feature set, and is the only stack with active consumers.

**Remove Stack B (dead code):**
1. Delete `server/src/services/cms-posts.service.ts`
2. Delete `server/src/repositories/cms-posts.repository.ts`
3. Delete `server/src/routes/admin/cms-posts.routes.ts`
4. Optionally drop the `cms_v2_posts` table if it contains no production data
5. Remove `cmsPosts`, `insertCmsPostSchema`, `InsertCmsPost`, `CmsPost` from `shared/schema.ts` if table is dropped

**Rename for clarity (optional):**
- `cms-posts-v2.routes.ts` → `cms-posts.routes.ts` (admin)
- `cms.posts.service.ts` → `cms-posts.service.ts`
- `cms.posts.repo.ts` → `cms-posts.repository.ts`
- Update the backward-compatibility stub accordingly

## Risk Assessment

- **Low risk:** Stack B has zero consumers and is not mounted. Removal has no runtime impact.
- **Schema note:** The `cms_v2_posts` table may exist in the production DB. Verify it's empty before dropping.
- **Import note:** Grep for any lingering imports of `cms-posts.service` or `cms-posts.repository` before deletion.
