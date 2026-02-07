import { MessageCircle } from "lucide-react";
import { Section, Container } from "@/cms/layout";
import { FadeIn } from "@/cms/motion";
import { Heading, Text } from "@/cms/typography";
import type { BlockRenderProps } from "./types";

export default function ObjectionBustersBlock({ data, settings }: BlockRenderProps) {
  const title = data?.title || "";
  const items: { objection: string; response: string }[] = data?.items || [];

  return (
    <Section className={settings?.className} data-testid="block-objectionbusters">
      <Container>
        <FadeIn>
          {title && (
            <Heading level={2} align="center" className="mb-12">
              {title}
            </Heading>
          )}
          <div className="flex flex-col gap-4">
            {items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "var(--pp-surface, #111827)",
                  borderRadius: "var(--pp-card-radius, 0.75rem)",
                  border: "1px solid color-mix(in srgb, var(--pp-primary, #67e8f9) 10%, transparent)",
                  padding: "1.5rem",
                  transition: "border-color 200ms ease, box-shadow 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "color-mix(in srgb, var(--pp-primary, #67e8f9) 25%, transparent)";
                  e.currentTarget.style.boxShadow = "0 0 24px color-mix(in srgb, var(--pp-primary, #67e8f9) 8%, transparent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "color-mix(in srgb, var(--pp-primary, #67e8f9) 10%, transparent)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                data-testid={`card-objection-${idx}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--pp-primary, #67e8f9) 15%, transparent)",
                    }}
                  >
                    <MessageCircle
                      className="w-5 h-5"
                      style={{ color: "var(--pp-primary, #67e8f9)" }}
                    />
                  </div>
                  <p
                    className="text-lg font-bold italic leading-snug"
                    style={{ color: "var(--pp-text, #f9fafb)" }}
                  >
                    "{item.objection}"
                  </p>
                </div>
                <div className="pl-[3.25rem]">
                  <Text muted className="leading-relaxed">{item.response}</Text>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
