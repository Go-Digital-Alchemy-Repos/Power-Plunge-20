import { Truck, Package } from "lucide-react";
import { Section, Container } from "@/cms/layout";
import { FadeIn } from "@/cms/motion";
import { Heading, Text } from "@/cms/typography";
import type { BlockRenderProps } from "./types";

export default function DeliveryAndSetupBlock({ data, settings }: BlockRenderProps) {
  const title = data?.title || "";
  const steps: { title: string; description: string }[] = data?.steps || [];
  const includesBullets: string[] = data?.includesBullets || [];
  const shippingEstimateText = data?.shippingEstimateText || "";

  return (
    <Section className={settings?.className} data-testid="block-deliverysetup">
      <Container>
        <FadeIn>
          {title && (
            <Heading level={2} align="center" className="mb-12">
              {title}
            </Heading>
          )}

          <div className="flex flex-col gap-6 max-w-2xl mx-auto">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4"
                data-testid={`delivery-step-${idx}`}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{
                    backgroundColor: "var(--pp-primary, #67e8f9)",
                    color: "var(--pp-surface, #111827)",
                    fontFamily: "var(--pp-font-family, 'Inter', sans-serif)",
                  }}
                >
                  {idx + 1}
                </div>
                <div className="pt-1">
                  <Heading level={3} className="mb-1">{step.title}</Heading>
                  <Text muted className="!mb-0 leading-relaxed">{step.description}</Text>
                </div>
              </div>
            ))}
          </div>

          {includesBullets.length > 0 && (
            <div className="mt-12 max-w-2xl mx-auto">
              <Heading level={3} className="mb-6">What's Included</Heading>
              <div className="flex flex-col gap-3">
                {includesBullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-3" data-testid={`includes-bullet-${idx}`}>
                    <Package
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
          )}

          {shippingEstimateText && (
            <div
              className="mt-10 max-w-2xl mx-auto flex items-start gap-3"
              style={{
                backgroundColor: "color-mix(in srgb, var(--pp-primary, #67e8f9) 8%, transparent)",
                borderRadius: "var(--pp-card-radius, 0.75rem)",
                border: "1px solid color-mix(in srgb, var(--pp-primary, #67e8f9) 20%, transparent)",
                padding: "1rem 1.25rem",
              }}
              data-testid="shipping-estimate"
            >
              <Truck
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                style={{ color: "var(--pp-primary, #67e8f9)" }}
              />
              <Text className="!mb-0 font-medium" style={{ color: "var(--pp-text, #f9fafb)" }}>
                {shippingEstimateText}
              </Text>
            </div>
          )}
        </FadeIn>
      </Container>
    </Section>
  );
}
