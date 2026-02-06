import { cn } from "@/lib/utils";
import type { BlockRenderProps } from "./types";

const gridColsMap: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

const spacingMap: Record<string, string> = {
  tight: "gap-2",
  normal: "gap-4",
  loose: "gap-8",
};

export default function ImageGridBlock({ data, settings }: BlockRenderProps) {
  const items = data?.items || data?.images || [];
  const columns = data?.columns || 3;
  const spacing = data?.spacing || "normal";

  return (
    <section
      className={cn("max-w-7xl mx-auto px-4 py-12", settings?.className)}
      data-testid="block-imagegrid"
    >
      <div
        className={cn(
          "grid grid-cols-2",
          gridColsMap[columns] || "md:grid-cols-3",
          spacingMap[spacing] || "gap-4"
        )}
      >
        {items.map(
          (
            img: { src: string; alt?: string; caption?: string; linkHref?: string },
            idx: number
          ) => {
            const imgEl = (
              <img
                src={img.src}
                alt={img.alt || ""}
                className="rounded-lg shadow-lg w-full h-48 object-cover"
              />
            );
            return (
              <figure key={idx}>
                {img.linkHref ? (
                  <a href={img.linkHref} className="block">
                    {imgEl}
                  </a>
                ) : (
                  imgEl
                )}
                {img.caption && (
                  <figcaption className="mt-2 text-sm text-slate-400 text-center">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            );
          }
        )}
      </div>
    </section>
  );
}
