import type { BlockCategory } from "./types";

export interface CategoryMeta {
  id: BlockCategory;
  label: string;
  description: string;
  order: number;
}

export const BLOCK_CATEGORIES: CategoryMeta[] = [
  { id: "layout", label: "Layout", description: "Page structure and hero sections", order: 1 },
  { id: "content", label: "Content", description: "Text, features, and informational blocks", order: 2 },
  { id: "media", label: "Media", description: "Images, video, and galleries", order: 3 },
  { id: "commerce", label: "Commerce", description: "Products, pricing, and trust signals", order: 4 },
  { id: "social", label: "Social", description: "Testimonials, logos, and social proof", order: 5 },
  { id: "utility", label: "Utility", description: "Dividers, spacers, and layout helpers", order: 6 },
];

export function getCategoryLabel(id: BlockCategory): string {
  return BLOCK_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function getCategoriesOrdered(): CategoryMeta[] {
  return [...BLOCK_CATEGORIES].sort((a, b) => a.order - b.order);
}
