import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Section, Container } from "@/cms/layout";
import { FadeIn } from "@/cms/motion";
import { Heading, Text } from "@/cms/typography";
import type { BlockRenderProps } from "./types";

export default function SafetyChecklistBlock({ data, settings }: BlockRenderProps) {
  const title = data?.title || "";
  const items: { text: string; required?: boolean }[] = data?.items || [];
  const disclaimerText = data?.disclaimerText || "";

  return (
    <Section className={settings?.className} data-testid="block-safetychecklist">
      <Container>
        <FadeIn>
          {title && (
            <Heading level={2} align="center" className="mb-12">
              {title}
            </Heading>
          )}
          <div className="flex flex-col gap-3 max-w-2xl mx-auto">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3"
                style={{
                  backgroundColor: "var(--pp-surface, #111827)",
                  borderRadius: "var(--pp-card-radius, 0.75rem)",
                  border: "1px solid color-mix(in srgb, var(--pp-primary, #67e8f9) 10%, transparent)",
                  padding: "1rem 1.25rem",
                }}
                data-testid={`checklist-item-${idx}`}
              >
                <CheckCircle2
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{
                    color: item.required
                      ? "var(--pp-primary, #67e8f9)"
                      : "var(--pp-text-muted, #9ca3af)",
                  }}
                />
                <Text
                  className="!mb-0"
                  style={{
                    color: item.required
                      ? "var(--pp-text, #f9fafb)"
                      : "var(--pp-text-muted, #9ca3af)",
                  }}
                >
                  {item.text}
                </Text>
              </div>
            ))}
          </div>

          {disclaimerText && (
            <div
              className="mt-10 max-w-2xl mx-auto flex items-start gap-3"
              style={{
                backgroundColor: "var(--pp-surface, #111827)",
                borderRadius: "var(--pp-card-radius, 0.75rem)",
                border: "1px dashed color-mix(in srgb, var(--pp-primary, #67e8f9) 20%, transparent)",
                padding: "1rem 1.25rem",
              }}
              data-testid="checklist-disclaimer"
            >
              <AlertTriangle
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                style={{ color: "var(--pp-text-muted, #9ca3af)" }}
              />
              <Text size="sm" muted className="!mb-0">
                {disclaimerText}
              </Text>
            </div>
          )}
        </FadeIn>
      </Container>
    </Section>
  );
}
