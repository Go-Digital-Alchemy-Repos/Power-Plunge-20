import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section, Container } from "@/cms/layout";
import { FadeIn } from "@/cms/motion";
import { Heading, Text } from "@/cms/typography";
import type { BlockRenderProps } from "./types";

interface TestimonialItem {
  quote: string;
  name: string;
  title?: string;
  avatar?: string;
  rating?: number;
}

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-4 h-4",
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
          )}
        />
      ))}
    </div>
  );
}

function GoogleBadge({ overallRating, totalReviews }: { overallRating: number; totalReviews: number }) {
  return (
    <div
      className="flex items-center justify-center gap-3 mb-10"
      data-testid="google-reviews-badge"
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-label="Google">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold" style={{ color: "var(--pp-text, #f9fafb)" }}>
          {overallRating.toFixed(1)}
        </span>
        <StarRating rating={Math.round(overallRating)} />
        <span className="text-sm" style={{ color: "color-mix(in srgb, var(--pp-text, #f9fafb) 60%, transparent)" }}>
          ({totalReviews} reviews)
        </span>
      </div>
    </div>
  );
}

function TestimonialCard({ item, idx }: { item: TestimonialItem; idx: number }) {
  return (
    <div
      className="flex flex-col h-full"
      style={{
        backgroundColor: "var(--pp-surface, #111827)",
        borderRadius: "var(--pp-card-radius, 0.75rem)",
        border: "1px solid color-mix(in srgb, var(--pp-primary, #67e8f9) 10%, transparent)",
        padding: "1.75rem",
        transition: "border-color 200ms ease, box-shadow 200ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "color-mix(in srgb, var(--pp-primary, #67e8f9) 25%, transparent)";
        e.currentTarget.style.boxShadow = "0 0 20px color-mix(in srgb, var(--pp-primary, #67e8f9) 6%, transparent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "color-mix(in srgb, var(--pp-primary, #67e8f9) 10%, transparent)";
        e.currentTarget.style.boxShadow = "none";
      }}
      data-testid={`card-testimonial-${idx}`}
    >
      <div className="flex items-center justify-between mb-5">
        <StarRating rating={item.rating || 5} />
        <Quote
          className="w-5 h-5 opacity-20"
          style={{ color: "var(--pp-primary, #67e8f9)" }}
        />
      </div>

      <blockquote className="flex-1 mb-6">
        <Text
          size="base"
          className="italic leading-relaxed"
          style={{
            color: "color-mix(in srgb, var(--pp-text, #f9fafb) 85%, transparent)",
          }}
        >
          "{item.quote}"
        </Text>
      </blockquote>

      <div
        className="flex items-center gap-3 pt-5"
        style={{
          borderTop: "1px solid color-mix(in srgb, var(--pp-primary, #67e8f9) 8%, transparent)",
        }}
      >
        {item.avatar ? (
          <img
            src={item.avatar}
            alt={item.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            style={{
              border: "2px solid color-mix(in srgb, var(--pp-primary, #67e8f9) 20%, transparent)",
            }}
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-semibold"
            style={{
              backgroundColor: "color-mix(in srgb, var(--pp-primary, #67e8f9) 15%, transparent)",
              color: "var(--pp-primary, #67e8f9)",
            }}
          >
            {item.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <Text size="sm" className="font-semibold !mb-0" style={{ color: "var(--pp-text, #f9fafb)" }}>
            {item.name}
          </Text>
          {item.title && (
            <Text size="sm" muted className="text-xs !mb-0">{item.title}</Text>
          )}
        </div>
      </div>
    </div>
  );
}

function useGoogleReviews(source: string, minRating: number) {
  const [reviews, setReviews] = useState<TestimonialItem[]>([]);
  const [meta, setMeta] = useState<{ overallRating: number; totalReviews: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (source !== "google") return;

    let cancelled = false;
    setLoading(true);

    fetch("/api/google-reviews")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.reviews?.length) {
          const filtered = data.reviews
            .filter((r: any) => r.rating >= minRating)
            .map((r: any) => ({
              quote: r.text,
              name: r.author,
              avatar: r.avatar,
              title: r.relativeTime || "Google Review",
              rating: r.rating,
            }));
          setReviews(filtered);
          setMeta({
            overallRating: data.overallRating || 0,
            totalReviews: data.totalReviews || 0,
          });
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [source, minRating]);

  return { reviews, meta, loading };
}

export default function TestimonialsBlock({ data, settings }: BlockRenderProps) {
  const title = data?.title || "";
  const source = data?.source || "manual";
  const minRating = data?.minRating ?? 4;
  const manualItems: TestimonialItem[] = data?.items || data?.testimonials || [];
  const layout = data?.layout || "cards";
  const showGoogleBadge = data?.showGoogleBadge !== false;

  const { reviews: googleReviews, meta, loading } = useGoogleReviews(source, minRating);
  const items = source === "google" ? googleReviews : manualItems;
  const [current, setCurrent] = useState(0);

  if (loading) {
    return (
      <Section className={settings?.className} data-testid="block-testimonials">
        <Container>
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--pp-primary, #67e8f9)" }} />
          </div>
        </Container>
      </Section>
    );
  }

  if (items.length === 0) {
    if (source === "google") {
      return (
        <Section className={settings?.className} data-testid="block-testimonials">
          <Container>
            <FadeIn>
              {title && <Heading level={2} align="center" className="mb-6">{title}</Heading>}
              <Text align="center" muted>
                Google Reviews will appear here once configured in admin settings.
              </Text>
            </FadeIn>
          </Container>
        </Section>
      );
    }
    return null;
  }

  if (layout === "slider" && items.length > 0) {
    const next = () => setCurrent((c) => (c + 1) % items.length);
    const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);

    return (
      <Section className={settings?.className} data-testid="block-testimonials">
        <Container width="default">
          <FadeIn>
          {title && (
            <Heading level={2} align="center" className="mb-12">
              {title}
            </Heading>
          )}
          {source === "google" && showGoogleBadge && meta && (
            <GoogleBadge overallRating={meta.overallRating} totalReviews={meta.totalReviews} />
          )}
          <div className="relative max-w-2xl mx-auto">
            <TestimonialCard item={items[current]} idx={current} />
            {items.length > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer"
                  style={{
                    backgroundColor: "var(--pp-surface, #111827)",
                    border: "1px solid color-mix(in srgb, var(--pp-primary, #67e8f9) 15%, transparent)",
                  }}
                  data-testid="testimonial-prev"
                >
                  <ChevronLeft className="w-5 h-5" style={{ color: "var(--pp-text, #f9fafb)" }} />
                </button>
                <div className="flex gap-1.5">
                  {items.map((_, i: number) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className="w-2 h-2 rounded-full transition-all cursor-pointer"
                      style={{
                        backgroundColor:
                          i === current
                            ? "var(--pp-primary, #67e8f9)"
                            : "color-mix(in srgb, var(--pp-text, #f9fafb) 20%, transparent)",
                      }}
                      data-testid={`testimonial-dot-${i}`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer"
                  style={{
                    backgroundColor: "var(--pp-surface, #111827)",
                    border: "1px solid color-mix(in srgb, var(--pp-primary, #67e8f9) 15%, transparent)",
                  }}
                  data-testid="testimonial-next"
                >
                  <ChevronRight className="w-5 h-5" style={{ color: "var(--pp-text, #f9fafb)" }} />
                </button>
              </div>
            )}
          </div>
          </FadeIn>
        </Container>
      </Section>
    );
  }

  return (
    <Section className={settings?.className} data-testid="block-testimonials">
      <Container>
        <FadeIn>
        {title && (
          <Heading level={2} align="center" className="mb-12">
            {title}
          </Heading>
        )}
        {source === "google" && showGoogleBadge && meta && (
          <GoogleBadge overallRating={meta.overallRating} totalReviews={meta.totalReviews} />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: TestimonialItem, idx: number) => (
            <TestimonialCard key={idx} item={item} idx={idx} />
          ))}
        </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
