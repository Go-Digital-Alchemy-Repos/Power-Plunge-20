import { Shield } from "lucide-react";
import { Section, Container } from "@/cms/layout";
import { FadeIn } from "@/cms/motion";
import { Heading, Text } from "@/cms/typography";
import { CmsButton } from "@/cms/ui";
import type { BlockRenderProps } from "./types";

export default function GuaranteeAndWarrantyBlock({ data, settings }: BlockRenderProps) {
  const title = data?.title || "";
  const guaranteeBullets: string[] = data?.guaranteeBullets || [];
  const warrantySummary = data?.warrantySummary || "";
  const supportCtaText = data?.supportCtaText || "";
  const supportCtaHref = data?.supportCtaHref || "#";

  return (
    <Section className={settings?.className} data-testid="block-guaranteewarranty">
      <Container>
        <FadeIn>
          {title && (
            <Heading level={2} align="center" className="mb-12">
              {title}
            </Heading>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              style={{
                backgroundColor: "var(--pp-surface, #111827)",
                borderRadius: "var(--pp-card-radius, 0.75rem)",
                border: "1px solid color-mix(in srgb, var(--pp-primary, #67e8f9) 10%, transparent)",
                padding: "2rem 1.5rem",
              }}
              data-testid="guarantee-section"
            >
              <Heading level={3} className="mb-6">Our Guarantee</Heading>
              <div className="flex flex-col gap-3">
                {guaranteeBullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-3" data-testid={`guarantee-bullet-${idx}`}>
                    <Shield
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      style={{ color: "var(--pp-primary, #67e8f9)" }}
                    />
                    <Text className="!mb-0" style={{ color: "var(--pp-text, #f9fafb)" }}>
                      {bullet}
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                backgroundColor: "var(--pp-surface, #111827)",
                borderRadius: "var(--pp-card-radius, 0.75rem)",
                border: "1px solid color-mix(in srgb, var(--pp-primary, #67e8f9) 10%, transparent)",
                padding: "2rem 1.5rem",
              }}
              data-testid="warranty-section"
            >
              <Heading level={3} className="mb-6">Warranty Coverage</Heading>
              <Text muted className="leading-relaxed">{warrantySummary}</Text>
            </div>
          </div>

          {supportCtaText && (
            <div className="mt-10 text-center">
              <CmsButton
                variant="primary"
                href={supportCtaHref}
                data-testid="guarantee-support-cta"
              >
                {supportCtaText}
              </CmsButton>
            </div>
          )}
        </FadeIn>
      </Container>
    </Section>
  );
}
