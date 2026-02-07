import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section, Container } from "@/cms/layout";
import { FadeIn } from "@/cms/motion";
import { Heading, Text } from "@/cms/typography";
import type { BlockRenderProps } from "./types";

export default function SocialProofStatsBlock({ data, settings }: BlockRenderProps) {
  const title = data?.title || "";
  const stats: { value: string; label: string }[] = data?.stats || [];
  const disclaimer = data?.disclaimer;

  return (
    <Section className={settings?.className} data-testid="block-socialproofstats">
      <Container>
        <FadeIn>
          {title && (
            <div className="flex items-center justify-center gap-3 mb-10">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--pp-primary, #67e8f9) 15%, transparent)",
                }}
              >
                <BarChart3
                  className="w-5 h-5"
                  style={{ color: "var(--pp-primary, #67e8f9)" }}
                />
              </div>
              <Heading level={2}>{title}</Heading>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-0">
            {stats.map((stat, idx) => {
              const isLast = idx === stats.length - 1;
              return (
                <div
                  key={idx}
                  className={cn(
                    "flex flex-col items-center text-center flex-1 min-w-[140px] justify-center",
                    !isLast && "md:border-r"
                  )}
                  style={{
                    borderColor: !isLast
                      ? "color-mix(in srgb, var(--pp-primary, #67e8f9) 12%, transparent)"
                      : undefined,
                    padding: "0.75rem 1.5rem",
                  }}
                  data-testid={`stat-item-${idx}`}
                >
                  <span
                    className="text-3xl md:text-4xl font-bold leading-tight"
                    style={{ color: "var(--pp-primary, #67e8f9)" }}
                  >
                    {stat.value}
                  </span>
                  <Text muted size="sm" className="mt-1 !mb-0">
                    {stat.label}
                  </Text>
                </div>
              );
            })}
          </div>
          {disclaimer && (
            <Text muted size="sm" align="center" className="mt-8 italic">
              {disclaimer}
            </Text>
          )}
        </FadeIn>
      </Container>
    </Section>
  );
}
