import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { getIconWithFallback } from "@/lib/iconUtils";
import { Section, Container } from "@/cms/layout";
import { FadeIn } from "@/cms/motion";
import { Heading, Text } from "@/cms/typography";
import type { BlockRenderProps } from "./types";

interface BenefitItem {
  headline: string;
  description: string;
  icon?: string;
  emphasis?: boolean;
}

export default function BenefitStackBlock({ data, settings }: BlockRenderProps) {
  const title = data?.title || "";
  const items: BenefitItem[] = data?.items || [];
  const layout = data?.layout || "stack";

  return (
    <Section className={settings?.className} data-testid="block-benefitstack">
      <Container>
        <FadeIn>
          {title && (
            <Heading level={2} align="center" className="mb-12">
              {title}
            </Heading>
          )}

          {layout === "timeline" ? (
            <div className="relative" style={{ paddingLeft: "2.5rem" }}>
              <div
                className="absolute top-0 bottom-0"
                style={{
                  left: "0.75rem",
                  width: "2px",
                  backgroundColor: "color-mix(in srgb, var(--pp-primary, #67e8f9) 20%, transparent)",
                }}
              />
              <div className="flex flex-col gap-8">
                {items.map((item, idx) => {
                  const Icon = getIconWithFallback(item.icon, Zap);
                  return (
                    <div key={idx} className="relative" data-testid={`benefit-item-${idx}`}>
                      <div
                        className="absolute flex items-center justify-center"
                        style={{
                          left: "-2.5rem",
                          top: "0.25rem",
                          width: "1.5rem",
                          height: "1.5rem",
                          borderRadius: "50%",
                          backgroundColor: "color-mix(in srgb, var(--pp-primary, #67e8f9) 15%, transparent)",
                          border: "2px solid var(--pp-primary, #67e8f9)",
                        }}
                      />
                      <div
                        style={{
                          backgroundColor: "var(--pp-surface, #111827)",
                          borderRadius: "var(--pp-card-radius, 0.75rem)",
                          border: item.emphasis
                            ? "1px solid color-mix(in srgb, var(--pp-primary, #67e8f9) 25%, transparent)"
                            : "1px solid color-mix(in srgb, var(--pp-primary, #67e8f9) 10%, transparent)",
                          padding: "1.5rem",
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{
                              backgroundColor: "color-mix(in srgb, var(--pp-primary, #67e8f9) 15%, transparent)",
                            }}
                          >
                            <span style={{ color: "var(--pp-primary, #67e8f9)" }}><Icon className="w-5 h-5" /></span>
                          </div>
                          <div>
                            <Heading level={3} className="mb-2">{item.headline}</Heading>
                            <Text muted className="leading-relaxed">{item.description}</Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item, idx) => {
                const Icon = getIconWithFallback(item.icon, Zap);
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-5"
                    style={{
                      backgroundColor: "var(--pp-surface, #111827)",
                      borderRadius: "var(--pp-card-radius, 0.75rem)",
                      border: item.emphasis
                        ? "1px solid color-mix(in srgb, var(--pp-primary, #67e8f9) 25%, transparent)"
                        : "1px solid color-mix(in srgb, var(--pp-primary, #67e8f9) 10%, transparent)",
                      padding: "1.5rem",
                      transition: "border-color 200ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "color-mix(in srgb, var(--pp-primary, #67e8f9) 25%, transparent)";
                    }}
                    onMouseLeave={(e) => {
                      if (!item.emphasis) {
                        e.currentTarget.style.borderColor = "color-mix(in srgb, var(--pp-primary, #67e8f9) 10%, transparent)";
                      }
                    }}
                    data-testid={`benefit-item-${idx}`}
                  >
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--pp-primary, #67e8f9) 15%, transparent)",
                      }}
                    >
                      <span style={{ color: "var(--pp-primary, #67e8f9)" }}><Icon className="w-6 h-6" /></span>
                    </div>
                    <div>
                      <Heading level={3} className="mb-2">{item.headline}</Heading>
                      <Text muted className="leading-relaxed">{item.description}</Text>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </FadeIn>
      </Container>
    </Section>
  );
}
