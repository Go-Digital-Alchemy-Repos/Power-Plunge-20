import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getIconWithFallback } from "@/lib/iconUtils";
import { Section, Container } from "@/cms/layout";
import { Heading, Text } from "@/cms/typography";
import type { BlockRenderProps } from "./types";

const gridColsMap: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};

export default function FeatureListBlock({ data, settings }: BlockRenderProps) {
  const title = data?.title || "";
  const items = data?.items || data?.features || [];
  const columns = data?.columns || 3;

  return (
    <Section className={settings?.className} data-testid="block-featurelist">
      <Container>
        {title && (
          <Heading level={2} align="center" className="mb-8">
            {title}
          </Heading>
        )}
        <div
          className={cn(
            "grid grid-cols-1 gap-8",
            gridColsMap[columns] || "md:grid-cols-3"
          )}
        >
          {items.map(
            (
              f: { icon?: string; title: string; description: string },
              idx: number
            ) => {
              const Icon = getIconWithFallback(f.icon, Check);
              return (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <Heading level={3} className="mb-2">{f.title}</Heading>
                    <Text muted>{f.description}</Text>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </Container>
    </Section>
  );
}
