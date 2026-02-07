import { useLocation } from "wouter";

interface TaxonomyItem {
  id: string;
  name: string;
  slug: string;
}

interface PostTaxonomyProps {
  categories?: TaxonomyItem[];
  tags?: TaxonomyItem[];
  linkable?: boolean;
}

export default function PostTaxonomy({ categories, tags, linkable = true }: PostTaxonomyProps) {
  const [, navigate] = useLocation();
  const hasCategories = categories && categories.length > 0;
  const hasTags = tags && tags.length > 0;

  if (!hasCategories && !hasTags) return null;

  return (
    <div className="flex flex-wrap gap-2" data-testid="post-taxonomy">
      {hasCategories &&
        categories.map((cat) => (
          <span
            key={`cat-${cat.id}`}
            className={`text-xs font-medium px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-400 ${linkable ? "cursor-pointer hover:bg-cyan-500/25 transition-colors" : ""}`}
            onClick={linkable ? () => navigate(`/blog?category=${cat.slug}`) : undefined}
            data-testid={`taxonomy-category-${cat.slug}`}
          >
            {cat.name}
          </span>
        ))}
      {hasTags &&
        tags.map((tag) => (
          <span
            key={`tag-${tag.id}`}
            className={`text-xs font-medium px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 ${linkable ? "cursor-pointer hover:bg-slate-600 transition-colors" : ""}`}
            onClick={linkable ? () => navigate(`/blog?tag=${tag.slug}`) : undefined}
            data-testid={`taxonomy-tag-${tag.slug}`}
          >
            #{tag.name}
          </span>
        ))}
    </div>
  );
}
