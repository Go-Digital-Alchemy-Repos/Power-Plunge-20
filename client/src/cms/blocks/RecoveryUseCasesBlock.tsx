import { Users, Activity, Briefcase, Heart, Shield, Check } from "lucide-react";
import { Section, Container } from "@/cms/layout";
import { FadeIn } from "@/cms/motion";
import { Heading, Text, Eyebrow } from "@/cms/typography";
import type { BlockRenderProps } from "./types";

interface UseCase {
  audience: "athletes" | "busy professionals" | "active aging" | "first responders";
  headline: string;
  bullets: string[];
}

const audienceIcons: Record<string, React.ComponentType<any>> = {
  athletes: Activity,
  "busy professionals": Briefcase,
  "active aging": Heart,
  "first responders": Shield,
};

export default function RecoveryUseCasesBlock({ data, settings }: BlockRenderProps) {
  const title = data?.title || "";
  const cases: UseCase[] = data?.cases || [];

  return (
    <Section className={settings?.className} data-testid="block-recoveryusecases">
      <Container>
        <FadeIn>
          {title && (
            <Heading level={2} align="center" className="mb-12">
              {title}
            </Heading>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cases.map((useCase, idx) => {
              const Icon = audienceIcons[useCase.audience] || Users;
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
                  data-testid={`usecase-card-${idx}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--pp-primary, #67e8f9) 15%, transparent)",
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: "var(--pp-primary, #67e8f9)" }} />
                    </div>
                    <Eyebrow>{useCase.audience}</Eyebrow>
                  </div>

                  <Heading level={3} className="mb-4">{useCase.headline}</Heading>

                  {useCase.bullets && useCase.bullets.length > 0 && (
                    <ul className="flex flex-col gap-2">
                      {useCase.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2" data-testid={`bullet-${idx}-${bIdx}`}>
                          <Check
                            className="w-4 h-4 flex-shrink-0 mt-0.5"
                            style={{ color: "var(--pp-primary, #67e8f9)" }}
                          />
                          <Text size="sm" muted className="!mb-0 leading-relaxed">{bullet}</Text>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
