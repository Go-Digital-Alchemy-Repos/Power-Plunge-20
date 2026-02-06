import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Container } from "@/cms/layout";
import { Heading, Text } from "@/cms/typography";
import { CmsButton } from "@/cms/ui";
import type { BlockRenderProps } from "./types";

export default function HeroBlock({ data, settings }: BlockRenderProps) {
  const headline = data?.headline || data?.title || "Welcome";
  const subheadline = data?.subheadline || data?.subtitle || "";
  const ctaText = data?.ctaText || data?.primaryButtonText || "";
  const ctaHref = data?.ctaHref || data?.primaryButtonLink || "#";
  const backgroundImage = data?.backgroundImage || "";
  const align = data?.align || "center";
  const themeVariant = data?.themeVariant || "";

  return (
    <section
      className={cn(
        "relative min-h-[70vh] flex items-center justify-center overflow-hidden",
        settings?.className
      )}
      style={{
        paddingTop: "var(--pp-section-py, 3rem)",
        paddingBottom: "var(--pp-section-py, 3rem)",
      }}
      data-testid="block-hero"
    >
      {backgroundImage && (
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
      )}
      <Container className="relative z-10">
        <div
          className={cn(
            "py-24",
            align === "center" ? "text-center" : "text-left"
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heading
              level={1}
              className="mb-6 leading-tight"
              gradient={themeVariant === "ice"}
            >
              {headline}
            </Heading>
            {subheadline && (
              <Text
                size="lg"
                muted
                className={cn(
                  "md:text-xl mb-10",
                  align === "center" ? "max-w-2xl mx-auto" : "max-w-2xl"
                )}
              >
                {subheadline}
              </Text>
            )}
            {ctaText && (
              <div
                className={cn(
                  "flex gap-4",
                  align === "center"
                    ? "justify-center"
                    : "justify-start"
                )}
              >
                <CmsButton
                  variant="primary"
                  size="lg"
                  href={ctaHref}
                  data-testid="button-hero-primary"
                >
                  {ctaText}
                </CmsButton>
              </div>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
