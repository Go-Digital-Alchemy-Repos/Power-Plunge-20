import { useLocation } from "wouter";
import PostMeta from "./PostMeta";
import PostTaxonomy from "./PostTaxonomy";

interface TaxonomyItem {
  id: string;
  name: string;
  slug: string;
}

interface PostCardProps {
  slug: string;
  title: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  readingTimeMinutes?: number | null;
  coverImageUrl?: string | null;
  categories?: TaxonomyItem[];
  tags?: TaxonomyItem[];
  featured?: boolean;
}

export default function PostCard({
  slug,
  title,
  excerpt,
  publishedAt,
  readingTimeMinutes,
  coverImageUrl,
  categories,
  tags,
  featured,
}: PostCardProps) {
  const [, navigate] = useLocation();

  return (
    <article
      className={`group bg-card/60 border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer flex flex-col ${featured ? "border-primary/30" : "border-border"}`}
      onClick={() => navigate(`/blog/${slug}`)}
      data-testid={`post-card-${slug}`}
    >
      {coverImageUrl ? (
        <div className="aspect-video bg-muted overflow-hidden" data-testid={`post-card-image-${slug}`}>
          <img
            src={coverImageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-card flex items-center justify-center">
          <span className="text-4xl text-primary/20 font-bold">PP</span>
        </div>
      )}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <PostTaxonomy categories={categories} tags={tags} linkable={false} />
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2" data-testid={`post-card-title-${slug}`}>
          {title}
        </h3>
        {excerpt && (
          <p className="text-muted-foreground text-sm line-clamp-3 flex-1" data-testid={`post-card-excerpt-${slug}`}>
            {excerpt}
          </p>
        )}
        <PostMeta publishedAt={publishedAt} readingTimeMinutes={readingTimeMinutes} compact />
      </div>
    </article>
  );
}
