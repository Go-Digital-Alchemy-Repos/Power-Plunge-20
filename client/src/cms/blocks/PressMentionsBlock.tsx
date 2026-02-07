import { Section, Container } from "@/cms/layout";
import { FadeIn } from "@/cms/motion";
import { Heading, Text } from "@/cms/typography";
import type { BlockRenderProps } from "./types";

export default function PressMentionsBlock({ data, settings }: BlockRenderProps) {
  const title = data?.title || "";
  const logos: { src: string; alt: string; href?: string }[] = data?.logos || [];
  const noteText = data?.noteText;

  return (
    <Section background="surface" className={settings?.className} data-testid="block-pressmentions">
      <Container>
        <FadeIn>
          {title && (
            <Heading level={2} align="center" className="mb-10">
              {title}
            </Heading>
          )}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {logos.map((logo, idx) => {
              const img = (
                <img
                  src={logo.src}
                  alt={logo.alt}
                  style={{
                    maxHeight: "40px",
                    width: "auto",
                    filter: "grayscale(100%)",
                    opacity: 0.7,
                    transition: "filter 300ms ease, opacity 300ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = "grayscale(0%)";
                    e.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = "grayscale(100%)";
                    e.currentTarget.style.opacity = "0.7";
                  }}
                  data-testid={`press-logo-${idx}`}
                />
              );

              return logo.href ? (
                <a
                  key={idx}
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`press-link-${idx}`}
                >
                  {img}
                </a>
              ) : (
                <div key={idx}>{img}</div>
              );
            })}
          </div>
          {noteText && (
            <Text muted size="sm" align="center" className="mt-8">
              {noteText}
            </Text>
          )}
        </FadeIn>
      </Container>
    </Section>
  );
}
