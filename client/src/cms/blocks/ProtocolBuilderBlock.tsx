import { Thermometer, AlertTriangle } from "lucide-react";
import { Section, Container } from "@/cms/layout";
import { FadeIn } from "@/cms/motion";
import { Heading, Text } from "@/cms/typography";
import type { BlockRenderProps } from "./types";

interface Protocol {
  level: "beginner" | "intermediate" | "advanced";
  tempRange: string;
  duration: string;
  frequency: string;
  notes: string;
}

const levelColors: Record<string, { bg: string; text: string; border: string }> = {
  beginner: {
    bg: "color-mix(in srgb, var(--pp-success, #4ade80) 15%, transparent)",
    text: "var(--pp-success, #4ade80)",
    border: "color-mix(in srgb, var(--pp-success, #4ade80) 30%, transparent)",
  },
  intermediate: {
    bg: "color-mix(in srgb, var(--pp-warning, #fbbf24) 15%, transparent)",
    text: "var(--pp-warning, #fbbf24)",
    border: "color-mix(in srgb, var(--pp-warning, #fbbf24) 30%, transparent)",
  },
  advanced: {
    bg: "color-mix(in srgb, var(--pp-danger, #f87171) 15%, transparent)",
    text: "var(--pp-danger, #f87171)",
    border: "color-mix(in srgb, var(--pp-danger, #f87171) 30%, transparent)",
  },
};

export default function ProtocolBuilderBlock({ data, settings }: BlockRenderProps) {
  const title = data?.title || "";
  const protocols: Protocol[] = data?.protocols || [];
  const disclaimerText = data?.disclaimerText || "Consult a healthcare professional before starting any cold exposure protocol.";

  return (
    <Section className={settings?.className} data-testid="block-protocolbuilder">
      <Container>
        <FadeIn>
          {title && (
            <Heading level={2} align="center" className="mb-12">
              {title}
            </Heading>
          )}

          <div
            className="grid grid-cols-1 gap-6"
            style={{
              gridTemplateColumns: protocols.length === 1
                ? "1fr"
                : protocols.length === 2
                  ? "repeat(2, 1fr)"
                  : "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            {protocols.map((protocol, idx) => {
              const colors = levelColors[protocol.level] || levelColors.beginner;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "var(--pp-surface, #111827)",
                    borderRadius: "var(--pp-card-radius, 0.75rem)",
                    border: "1px solid color-mix(in srgb, var(--pp-primary, #67e8f9) 10%, transparent)",
                    padding: "1.5rem",
                    transition: "border-color 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "color-mix(in srgb, var(--pp-primary, #67e8f9) 25%, transparent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "color-mix(in srgb, var(--pp-primary, #67e8f9) 10%, transparent)";
                  }}
                  data-testid={`protocol-card-${idx}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--pp-primary, #67e8f9) 15%, transparent)",
                      }}
                    >
                      <Thermometer className="w-5 h-5" style={{ color: "var(--pp-primary, #67e8f9)" }} />
                    </div>
                    <span
                      className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      {protocol.level}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div>
                      <Text size="sm" muted className="!mb-0.5 text-xs uppercase tracking-wider">Temperature</Text>
                      <Text className="!mb-0 font-medium" style={{ color: "var(--pp-text, #f9fafb)" }}>{protocol.tempRange}</Text>
                    </div>
                    <div>
                      <Text size="sm" muted className="!mb-0.5 text-xs uppercase tracking-wider">Duration</Text>
                      <Text className="!mb-0 font-medium" style={{ color: "var(--pp-text, #f9fafb)" }}>{protocol.duration}</Text>
                    </div>
                    <div>
                      <Text size="sm" muted className="!mb-0.5 text-xs uppercase tracking-wider">Frequency</Text>
                      <Text className="!mb-0 font-medium" style={{ color: "var(--pp-text, #f9fafb)" }}>{protocol.frequency}</Text>
                    </div>
                    {protocol.notes && (
                      <div
                        className="mt-2 pt-3"
                        style={{
                          borderTop: "1px solid color-mix(in srgb, var(--pp-primary, #67e8f9) 8%, transparent)",
                        }}
                      >
                        <Text size="sm" muted className="!mb-0 leading-relaxed italic">{protocol.notes}</Text>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {disclaimerText && (
            <div
              className="flex items-start gap-3 mt-10"
              style={{
                backgroundColor: "var(--pp-surface, #111827)",
                borderRadius: "var(--pp-card-radius, 0.75rem)",
                border: "1px dashed color-mix(in srgb, var(--pp-primary, #67e8f9) 15%, transparent)",
                padding: "1rem 1.25rem",
              }}
              data-testid="disclaimer-box"
            >
              <AlertTriangle
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                style={{ color: "var(--pp-text-muted, #9ca3af)" }}
              />
              <Text
                size="sm"
                muted
                className="!mb-0 leading-relaxed"
              >
                {disclaimerText}
              </Text>
            </div>
          )}
        </FadeIn>
      </Container>
    </Section>
  );
}
