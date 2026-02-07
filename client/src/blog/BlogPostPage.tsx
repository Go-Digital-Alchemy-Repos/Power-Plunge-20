import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageRenderer from "@/components/PageRenderer";
import SeoHead from "@/components/SeoHead";
import PostMeta from "./components/PostMeta";
import PostTaxonomy from "./components/PostTaxonomy";
import PostCard from "./components/PostCard";

interface TaxonomyItem {
  id: string;
  name: string;
  slug: string;
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  contentJson: { version: number; blocks: any[] } | null;
  publishedAt: string | null;
  coverImageId: string | null;
  ogImageId: string | null;
  readingTimeMinutes: number | null;
  featured: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  allowIndex: boolean;
  allowFollow: boolean;
  categories: TaxonomyItem[];
  tags: TaxonomyItem[];
}

interface PostListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  coverImageId: string | null;
  readingTimeMinutes: number | null;
  featured: boolean;
  categories: TaxonomyItem[];
  tags: TaxonomyItem[];
}

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: [`/api/blog/posts/${params.slug}`],
    queryFn: async () => {
      const res = await fetch(`/api/blog/posts/${params.slug}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("NOT_FOUND");
        throw new Error("Failed to fetch post");
      }
      return res.json();
    },
    enabled: !!params.slug,
  });

  const { data: relatedResult } = useQuery<{ data: PostListItem[] }>({
    queryKey: ["/api/blog/posts", "related", post?.categories?.[0]?.slug, post?.tags?.[0]?.slug, post?.id],
    queryFn: async () => {
      const catSlug = post?.categories?.[0]?.slug;
      const tagSlug = post?.tags?.[0]?.slug;
      const qs = new URLSearchParams({ pageSize: "4" });
      if (catSlug) qs.set("category", catSlug);
      else if (tagSlug) qs.set("tag", tagSlug);
      const res = await fetch(`/api/blog/posts?${qs.toString()}`);
      if (!res.ok) return { data: [] };
      return res.json();
    },
    enabled: !!post,
  });

  const relatedPosts = (relatedResult?.data || []).filter((p) => p.id !== post?.id).slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !post) {
    const isNotFound = error?.message === "NOT_FOUND";
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4" data-testid="text-post-not-found">
          {isNotFound ? "Post Not Found" : "Something went wrong"}
        </h1>
        <p className="text-slate-400 mb-8">
          {isNotFound ? "This post may have been removed or is not yet published." : "Unable to load this post."}
        </p>
        <Button onClick={() => navigate("/blog")} className="bg-cyan-500 hover:bg-cyan-600" data-testid="button-back-to-blog">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
        </Button>
      </div>
    );
  }

  const robotsDirectives: string[] = [];
  if (!post.allowIndex) robotsDirectives.push("noindex");
  if (!post.allowFollow) robotsDirectives.push("nofollow");
  const robotsMeta = robotsDirectives.length > 0 ? robotsDirectives.join(", ") : null;

  const ogImage = post.ogImageId ? `/api/object-storage/${post.ogImageId}` : post.coverImageId ? `/api/object-storage/${post.coverImageId}` : null;
  const hasBlocks = post.contentJson?.blocks && post.contentJson.blocks.length > 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <SeoHead
        pageTitle={`${post.metaTitle || post.title} | Power Plunge`}
        metaTitle={post.metaTitle || post.title}
        metaDescription={post.metaDescription || post.excerpt || undefined}
        canonicalUrl={post.canonicalUrl || undefined}
        robots={robotsMeta}
        ogTitle={post.metaTitle || post.title}
        ogDescription={post.metaDescription || post.excerpt || undefined}
        ogImage={ogImage}
        twitterCard="summary_large_image"
        twitterTitle={post.metaTitle || post.title}
        twitterDescription={post.metaDescription || post.excerpt || undefined}
        twitterImage={ogImage}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          image: ogImage,
        }}
      />

      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/blog")} className="text-slate-300 hover:text-white" data-testid="button-back-to-blog">
            <ArrowLeft className="w-4 h-4 mr-2" /> Blog
          </Button>
          <span className="text-sm text-slate-500 hidden md:block truncate max-w-md">{post.title}</span>
          <div className="w-20" />
        </div>
      </header>

      <article className="container mx-auto px-4 py-8 max-w-4xl" data-testid="blog-post-article">
        {post.coverImageId && (
          <div className="aspect-video rounded-xl overflow-hidden mb-8 bg-slate-800" data-testid="blog-post-cover">
            <img
              src={`/api/object-storage/${post.coverImageId}`}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="mb-6">
          <PostTaxonomy categories={post.categories} tags={post.tags} />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight" data-testid="blog-post-title">
          {post.title}
        </h1>

        <div className="mb-8">
          <PostMeta publishedAt={post.publishedAt} readingTimeMinutes={post.readingTimeMinutes} />
        </div>

        {post.excerpt && !hasBlocks && (
          <p className="text-lg text-slate-300 border-l-4 border-cyan-500 pl-4 mb-8 italic" data-testid="blog-post-excerpt">
            {post.excerpt}
          </p>
        )}

        <div data-testid="blog-post-content">
          {hasBlocks ? (
            <PageRenderer contentJson={post.contentJson} legacyContent={post.body} />
          ) : post.body ? (
            <div
              className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-slate-300 prose-a:text-cyan-400 prose-strong:text-white prose-li:text-slate-300"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p>This post has no content yet.</p>
            </div>
          )}
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="container mx-auto px-4 py-12 max-w-6xl border-t border-slate-800" data-testid="related-posts">
          <h2 className="text-2xl font-bold text-white mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rp) => (
              <PostCard
                key={rp.id}
                slug={rp.slug}
                title={rp.title}
                excerpt={rp.excerpt}
                publishedAt={rp.publishedAt}
                readingTimeMinutes={rp.readingTimeMinutes}
                coverImageId={rp.coverImageId}
                categories={rp.categories}
                tags={rp.tags}
                featured={rp.featured}
              />
            ))}
          </div>
        </section>
      )}

      <footer className="bg-slate-800 border-t border-slate-700 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <p>&copy; 2026 Power Plunge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
