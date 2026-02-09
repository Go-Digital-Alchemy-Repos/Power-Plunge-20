#!/usr/bin/env npx tsx
/**
 * Blog / Posts Smoke Tests
 *
 * Exercises the CMS Posts system via direct service calls:
 *   - Admin: list, create, publish, unpublish, delete
 *   - Public: list published only, get by slug
 *
 * Run:  npx tsx scripts/smoke/blogSmoke.ts
 */

import { db } from "../../server/db";
import { cmsPosts } from "../../shared/schema";
import { eq } from "drizzle-orm";
import { cmsPostsService } from "../../server/src/services/cms-posts.service";

let pass = 0;
let fail = 0;
const created: string[] = [];

function assert(label: string, ok: boolean, detail?: string) {
  if (ok) {
    pass++;
    console.log(`  PASS  ${label}`);
  } else {
    fail++;
    console.log(`  FAIL  ${label}${detail ? " — " + detail : ""}`);
  }
}

async function cleanup() {
  for (const id of created) {
    try {
      await db.delete(cmsPosts).where(eq(cmsPosts.id, id));
    } catch {}
  }
}

async function main() {
  console.log("=== Blog / Posts Smoke Tests ===\n");

  // ── Admin: list posts ──
  console.log("[Admin] List posts");
  const initialList = await cmsPostsService.list();
  assert("list() returns array", Array.isArray(initialList));

  // ── Admin: create a draft post ──
  console.log("\n[Admin] Create draft post");
  const slug = `smoke-test-post-${Date.now()}`;
  let postId: string | null = null;
  try {
    const post = await cmsPostsService.create({
      title: "Smoke Test Post",
      slug,
      body: "<p>Hello from smoke test</p>",
      excerpt: "Smoke excerpt",
      tags: ["smoke", "test"],
      category: "testing",
      status: "draft",
    });
    postId = post.id;
    created.push(post.id);
    assert("create() returns post with id", !!post.id);
    assert("create() status is draft", post.status === "draft");
    assert("create() slug matches", post.slug === slug);
    assert("create() tags preserved", Array.isArray(post.tags) && post.tags.length === 2);
  } catch (err: any) {
    assert("create() succeeded", false, err.message);
  }

  // ── Public: list published (should NOT include our draft) ──
  console.log("\n[Public] List published posts (draft should be hidden)");
  const pubListBefore = await cmsPostsService.listPublished();
  assert("listPublished() returns array", Array.isArray(pubListBefore));
  const draftInPublic = pubListBefore.find((p: any) => p.slug === slug);
  assert("draft post NOT in published list", !draftInPublic);

  // ── Public: get draft by slug (should fail) ──
  console.log("\n[Public] Get draft by slug (should return null)");
  const pubDraft = await cmsPostsService.getPublishedBySlug(slug);
  assert("draft not accessible via getPublishedBySlug()", pubDraft === null || pubDraft === undefined);

  if (!postId) {
    console.log("\nSkipping publish/unpublish tests (create failed)\n");
    await cleanup();
    console.log(`\n=== Results: ${pass} passed, ${fail} failed ===`);
    process.exit(fail > 0 ? 1 : 0);
  }

  // ── Admin: publish the post ──
  console.log("\n[Admin] Publish post");
  try {
    const published = await cmsPostsService.publish(postId);
    assert("publish() returns post", !!published);
    assert("publish() status is published", published?.status === "published");
    assert("publish() sets publishedAt", !!published?.publishedAt);
  } catch (err: any) {
    assert("publish() succeeded", false, err.message);
  }

  // ── Public: now should appear in published list ──
  console.log("\n[Public] Published post now visible");
  const pubListAfter = await cmsPostsService.listPublished();
  const pubPost = pubListAfter.find((p: any) => p.slug === slug);
  assert("published post appears in listPublished()", !!pubPost);

  // ── Public: get by slug ──
  console.log("\n[Public] Get published post by slug");
  const bySlug = await cmsPostsService.getPublishedBySlug(slug);
  assert("getPublishedBySlug() returns post", !!bySlug);
  assert("getPublishedBySlug() title matches", bySlug?.title === "Smoke Test Post");

  // ── Admin: unpublish ──
  console.log("\n[Admin] Unpublish post");
  try {
    const unpub = await cmsPostsService.unpublish(postId);
    assert("unpublish() returns post", !!unpub);
    assert("unpublish() status is draft", unpub?.status === "draft");
  } catch (err: any) {
    assert("unpublish() succeeded", false, err.message);
  }

  // ── Public: unpublished no longer visible ──
  console.log("\n[Public] Unpublished post hidden again");
  const pubAfterUnpub = await cmsPostsService.getPublishedBySlug(slug);
  assert("unpublished post not accessible", pubAfterUnpub === null || pubAfterUnpub === undefined);

  // ── Admin: delete ──
  console.log("\n[Admin] Delete post");
  try {
    const deleted = await cmsPostsService.remove(postId);
    assert("remove() returns deleted post", !!deleted);
    created.splice(created.indexOf(postId), 1);
  } catch (err: any) {
    assert("remove() succeeded", false, err.message);
  }

  // ── Verify deletion ──
  const afterDelete = await cmsPostsService.getById(postId);
  assert("deleted post no longer exists", !afterDelete);

  // ── Cleanup ──
  await cleanup();

  console.log(`\n=== Results: ${pass} passed, ${fail} failed ===`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch(async (err) => {
  console.error("Blog smoke test error:", err);
  await cleanup();
  process.exit(1);
});
