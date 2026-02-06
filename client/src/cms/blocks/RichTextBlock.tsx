import { cn } from "@/lib/utils";
import { Section, Container } from "@/cms/layout";
import { Heading } from "@/cms/typography";
import type { BlockRenderProps } from "./types";

export default function RichTextBlock({ data, settings }: BlockRenderProps) {
  const title = data?.title || "";
  const body = data?.bodyRichText || data?.content || "";
  const align = data?.align || "left";

  return (
    <Section className={settings?.className} data-testid="block-richtext">
      <Container width="default">
        <div
          className={cn(
            align === "center" && "text-center",
            align === "right" && "text-right"
          )}
        >
          {title && (
            <Heading level={2} className="mb-6">{title}</Heading>
          )}
          <div
            className="prose prose-invert prose-lg max-w-none"
            style={{
              fontFamily: "var(--pp-font-family, 'Inter', sans-serif)",
              lineHeight: "var(--pp-line-height, 1.5)",
            }}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </div>
      </Container>
    </Section>
  );
}
