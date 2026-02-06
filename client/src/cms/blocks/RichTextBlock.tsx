import { cn } from "@/lib/utils";
import type { BlockRenderProps } from "./types";

export default function RichTextBlock({ data, settings }: BlockRenderProps) {
  const title = data?.title || "";
  const body = data?.bodyRichText || data?.content || "";
  const align = data?.align || "left";

  return (
    <section
      className={cn(
        "max-w-4xl mx-auto px-4 py-12",
        align === "center" && "text-center",
        align === "right" && "text-right",
        settings?.className
      )}
      data-testid="block-richtext"
    >
      {title && (
        <h2 className="text-3xl font-bold text-white mb-6">{title}</h2>
      )}
      <div
        className="prose prose-invert prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </section>
  );
}
