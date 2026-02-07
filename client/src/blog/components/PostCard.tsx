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
  coverImageId?: string | null;
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
  coverImageId,
  categories,
  tags,
  featured,
}: PostCardProps) {
  const [, navigate] = useLocation();

  return (
    <article
      className={`group bg-slate-800/60 border rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 cursor-pointer flex flex-col ${featured ? "border-cyan-500/30" : "border-slate-700/50"}`}
      onClick={() => navigate(`/blog/${slug}`)}
      data-testid={`post-card-${slug}`}
    >
      {coverImageId && (
        <div className="aspect-video bg-slate-700 overflow-hidden" data-testid={`post-card-image-${slug}`}>
          <img
            src={`/api/object-storage/${coverImageId}`}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      )}
      {!coverImageId && (
        <div className="aspect-video bg-gradient-to-br from-cyan-900/30 to-slate-800 flex items-center justify-center">
          <span className="text-4xl text-cyan-500/20 font-bold">PP</span>
        </div>
      )}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <PostTaxonomy categories={categories} tags={tags} linkable={false} />
        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-2" data-testid={`post-card-title-${slug}`}>
          {title}
        </h3>
        {excerpt && (
          <p className="text-slate-400 text-sm line-clamp-3 flex-1" data-testid={`post-card-excerpt-${slug}`}>
            {excerpt}
          </p>
        )}
        <PostMeta publishedAt={publishedAt} readingTimeMinutes={readingTimeMinutes} compact />
      </div>
    </article>
  );
}
