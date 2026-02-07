import { AlertTriangle } from "lucide-react";
import { Section, Container } from "@/cms/layout";
import { FadeIn } from "@/cms/motion";
import { Heading, Text } from "@/cms/typography";
import type { BlockRenderProps } from "./types";

interface ExplainerSection {
  heading: string;
  body: string;
  citationLabel?: string;
  citationUrl?: string;
}

export default function ScienceExplainerBlock({ data, settings }: BlockRenderProps) {
  const title = data?.title || "";
  const sections: ExplainerSection[] = data?.sections || [];
  const disclaimerText = data?.disclaimerText || "";

  return (
    <Section className={settings?.className} data-testid="block-scienceexplainer">
      <Container>
        <FadeIn>
          {title && (
            <Heading level={2} align="center" className="mb-12">
              {title}
            </Heading>
          )}

          <div className="flex flex-col gap-8">
            {sections.map((section, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "var(--pp-surface, #111827)",
                  borderRadius: "var(--pp-card-radius, 0.75rem)",
                  border: "1px solid color-mix(in srgb, var(--pp-primary, #67e8f9) 10%, transparent)",
                  padding: "1.5rem",
                }}
                data-testid={`science-section-${idx}`}
              >
                <Heading level={3} className="mb-3">{section.heading}</Heading>
                <Text muted className="leading-relaxed">{section.body}</Text>
                {section.citationLabel && (
                  <a
                    href={section.citationUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-xs underline"
                    style={{ color: "var(--pp-primary, #67e8f9)", opacity: 0.8 }}
                    data-testid={`citation-link-${idx}`}
                  >
                    {section.citationLabel}
                  </a>
                )}
              </div>
            ))}
          </div>

          {disclaimerText && (
            <div
              className="flex items-start gap-3 mt-10"
              style={{
                backgroundColor: "var(--pp-surface, #111827)",
                borderRadius: "var(--pp-card-radius, 0.75rem)",
                border: "1px dashed color-mix(in srgb, var(--pp-primary, #67e8f9) 15%, transparent)",
                padding: "1rem 1.25rem",
              }}
              data-testid="disclaimer-box"
            >
              <AlertTriangle
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                style={{ color: "var(--pp-text-muted, #9ca3af)" }}
              />
              <Text
                size="sm"
                muted
                className="!mb-0 leading-relaxed"
              >
                {disclaimerText}
              </Text>
            </div>
          )}
        </FadeIn>
      </Container>
    </Section>
  );
}
