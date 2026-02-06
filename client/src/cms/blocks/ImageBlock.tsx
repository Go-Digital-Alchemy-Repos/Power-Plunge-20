import { cn } from "@/lib/utils";
import type { BlockRenderProps } from "./types";

export default function ImageBlock({ data, settings }: BlockRenderProps) {
  const src = data?.src || "";
  const alt = data?.alt || "";
  const caption = data?.caption || "";
  const rounded = data?.rounded !== false;
  const linkHref = data?.linkHref || "";
  const aspectRatio = data?.aspectRatio || "";

  if (!src) {
    return (
      <section
        className={cn("max-w-7xl mx-auto px-4 py-12", settings?.className)}
        data-testid="block-image"
      >
        <div className="bg-slate-800 rounded-lg p-8 text-center text-slate-500">
          No image source provided
        </div>
      </section>
    );
  }

  const imgEl = (
    <img
      src={src}
      alt={alt}
      className={cn(
        "shadow-lg w-full",
        rounded && "rounded-lg",
        aspectRatio === "16:9" && "aspect-video object-cover",
        aspectRatio === "4:3" && "aspect-[4/3] object-cover",
        aspectRatio === "1:1" && "aspect-square object-cover"
      )}
    />
  );

  return (
    <section
      className={cn("max-w-7xl mx-auto px-4 py-12", settings?.className)}
      data-testid="block-image"
    >
      <figure className={cn(settings?.alignment === "center" && "flex flex-col items-center")}>
        {linkHref ? (
          <a href={linkHref} className="block">
            {imgEl}
          </a>
        ) : (
          imgEl
        )}
        {caption && (
          <figcaption className="mt-4 text-sm text-slate-400">
            {caption}
          </figcaption>
        )}
      </figure>
    </section>
  );
}
