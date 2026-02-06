import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlockRenderProps } from "./types";

function TestimonialCard({
  item,
}: {
  item: { quote: string; name: string; title?: string; avatar?: string };
}) {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4 fill-yellow-400 text-yellow-400"
          />
        ))}
      </div>
      <blockquote className="text-slate-300 mb-4">"{item.quote}"</blockquote>
      <div className="flex items-center gap-3">
        {item.avatar && (
          <img
            src={item.avatar}
            alt={item.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-semibold text-white">{item.name}</p>
          {item.title && (
            <p className="text-sm text-slate-400">{item.title}</p>
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
      <section
        className={cn("max-w-4xl mx-auto px-4 py-12", settings?.className)}
        data-testid="block-testimonials"
      >
        {title && (
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            {title}
          </h2>
        )}
        <div className="relative">
          <TestimonialCard item={items[current]} />
          {items.length > 1 && (
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={prev}
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center transition-colors"
                data-testid="testimonial-prev"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center transition-colors"
                data-testid="testimonial-next"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn("max-w-7xl mx-auto px-4 py-12", settings?.className)}
      data-testid="block-testimonials"
    >
      {title && (
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          {title}
        </h2>
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
    </section>
  );
}
