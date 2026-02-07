import { CreditCard, DollarSign } from "lucide-react";
import { Section, Container } from "@/cms/layout";
import { FadeIn } from "@/cms/motion";
import { Heading, Text } from "@/cms/typography";
import type { BlockRenderProps } from "./types";

export default function FinancingAndPaymentBlock({ data, settings }: BlockRenderProps) {
  const title = data?.title || "";
  const bullets: string[] = data?.bullets || [];
  const financingProviderName = data?.financingProviderName || "";
  const financingDisclaimer = data?.financingDisclaimer || "";

  return (
    <Section className={settings?.className} data-testid="block-financingpayment">
      <Container>
        <FadeIn>
          {title && (
            <Heading level={2} align="center" className="mb-12">
              {title}
            </Heading>
          )}

          <div className="flex flex-col gap-3 max-w-2xl mx-auto">
            {bullets.map((bullet, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3"
                style={{
                  backgroundColor: "var(--pp-surface, #111827)",
                  borderRadius: "var(--pp-card-radius, 0.75rem)",
                  border: "1px solid color-mix(in srgb, var(--pp-primary, #67e8f9) 10%, transparent)",
                  padding: "1rem 1.25rem",
                }}
                data-testid={`financing-bullet-${idx}`}
              >
                <CreditCard
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: "var(--pp-primary, #67e8f9)" }}
                />
                <Text className="!mb-0" style={{ color: "var(--pp-text, #f9fafb)" }}>
                  {bullet}
                </Text>
              </div>
            ))}
          </div>

          {financingProviderName && (
            <div className="mt-8 text-center flex items-center justify-center gap-2">
              <DollarSign
                className="w-5 h-5"
                style={{ color: "var(--pp-primary, #67e8f9)" }}
              />
              <Text className="!mb-0 font-medium" style={{ color: "var(--pp-text, #f9fafb)" }}>
                Financing available through {financingProviderName}
              </Text>
            </div>
          )}

          {financingDisclaimer && (
            <div className="mt-6 text-center max-w-2xl mx-auto">
              <Text size="sm" muted className="!mb-0">
                {financingDisclaimer}
              </Text>
            </div>
          )}
        </FadeIn>
      </Container>
    </Section>
  );
}
