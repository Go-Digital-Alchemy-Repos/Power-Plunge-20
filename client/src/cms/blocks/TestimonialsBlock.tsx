import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Section, Container } from "@/cms/layout";
import { Heading, Text } from "@/cms/typography";
import type { BlockRenderProps } from "./types";

function TestimonialCard({
  item,
}: {
  item: { quote: string; name: string; title?: string; avatar?: string };
}) {
  return (
    <div className="pp-surface-bg backdrop-blur border pp-border-subtle rounded-xl p-6">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4 fill-yellow-400 text-yellow-400"
          />
        ))}
      </div>
      <Text muted className="mb-4">"{item.quote}"</Text>
      <div className="flex items-center gap-3">
        {item.avatar && (
          <img
            src={item.avatar}
            alt={item.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div>
          <Text size="sm" className="font-semibold text-white !mb-0">{item.name}</Text>
          {item.title && (
            <Text size="sm" muted className="!mb-0">{item.title}</Text>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsBlock({ data, settings }: BlockRenderProps) {
  const title = data?.title || "";
  const items = data?.items || data?.testimonials || [];
  const layout = data?.layout || "cards";
  const [current, setCurrent] = useState(0);

  if (layout === "slider" && items.length > 0) {
    const next = () => setCurrent((c) => (c + 1) % items.length);
    const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);

    return (
      <Section className={settings?.className} data-testid="block-testimonials">
        <Container width="default">
          {title && (
            <Heading level={2} align="center" className="mb-8">
              {title}
            </Heading>
          )}
          <div className="relative">
            <TestimonialCard item={items[current]} />
            {items.length > 1 && (
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={prev}
                  className="w-10 h-10 pp-surface-bg hover:brightness-110 rounded-full flex items-center justify-center transition-colors"
                  data-testid="testimonial-prev"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={next}
                  className="w-10 h-10 pp-surface-bg hover:brightness-110 rounded-full flex items-center justify-center transition-colors"
                  data-testid="testimonial-next"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            )}
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section className={settings?.className} data-testid="block-testimonials">
      <Container>
        {title && (
          <Heading level={2} align="center" className="mb-8">
            {title}
          </Heading>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(
            (
              item: { quote: string; name: string; title?: string; avatar?: string },
              idx: number
            ) => (
              <TestimonialCard key={idx} item={item} />
            )
          )}
        </div>
      </Container>
    </Section>
  );
}
