import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Section, Container } from "@/cms/layout";
import { Heading, Text } from "@/cms/typography";
import { CmsButton } from "@/cms/ui";
import type { BlockRenderProps } from "./types";

export default function CallToActionBlock({ data, settings }: BlockRenderProps) {
  const headline = data?.headline || data?.title || "Get Started";
  const subheadline = data?.subheadline || data?.subtitle || "";
  const primaryCtaText = data?.primaryCtaText || data?.buttonText || "";
  const primaryCtaHref = data?.primaryCtaHref || data?.buttonLink || "#";
  const secondaryCtaText = data?.secondaryCtaText || data?.secondaryButton || "";
  const secondaryCtaHref = data?.secondaryCtaHref || data?.secondaryLink || "";

  return (
    <Section
      background="surface"
      divider
      className={cn(settings?.className)}
      data-testid="block-cta"
    >
      <Container width="default">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Heading level={2} align="center" className="font-display text-4xl md:text-5xl mb-6">
              {headline}
            </Heading>
            {subheadline && (
              <Text size="lg" muted align="center" className="mb-10 max-w-2xl mx-auto">
                {subheadline}
              </Text>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {primaryCtaText && (
                <CmsButton
                  variant="primary"
                  size="lg"
                  href={primaryCtaHref}
                  data-testid="cta-primary-button"
                >
                  {primaryCtaText}
                </CmsButton>
              )}
              {secondaryCtaText && (
                <CmsButton
                  variant="outline"
                  size="lg"
                  href={secondaryCtaHref}
                >
                  {secondaryCtaText}
                </CmsButton>
              )}
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
