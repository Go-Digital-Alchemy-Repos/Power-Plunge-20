import { ArrowRight } from "lucide-react";
import { Section, Container } from "@/cms/layout";
import { FadeIn } from "@/cms/motion";
import { Heading, Text } from "@/cms/typography";
import type { BlockRenderProps } from "./types";

export default function BeforeAfterExpectationsBlock({ data, settings }: BlockRenderProps) {
  const title = data?.title || "";
  const expectations: { label: string; description: string }[] = data?.expectations || [];

  return (
    <Section className={settings?.className} data-testid="block-beforeafterexpectations">
      <Container>
        <FadeIn>
          {title && (
            <Heading level={2} align="center" className="mb-12">
              {title}
            </Heading>
          )}
          <div className="flex flex-col gap-6">
            {expectations.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4"
                style={{
                  borderLeft: "3px solid color-mix(in srgb, var(--pp-primary, #67e8f9) 30%, transparent)",
                  paddingLeft: "1.5rem",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                }}
                data-testid={`expectation-item-${idx}`}
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--pp-primary, #67e8f9) 15%, transparent)",
                  }}
                >
                  <ArrowRight
                    className="w-4 h-4"
                    style={{ color: "var(--pp-primary, #67e8f9)" }}
                  />
                </div>
                <div>
                  <Heading level={3} className="mb-2">{item.label}</Heading>
                  <Text muted className="leading-relaxed">{item.description}</Text>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
