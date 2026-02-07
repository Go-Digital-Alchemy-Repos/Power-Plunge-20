import { useAdmin } from "@/hooks/use-admin";
import { useLocation } from "wouter";
import CmsV2Layout from "@/components/admin/CmsV2Layout";
import { FileText, Sparkles, Layers, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CMS_TEMPLATES, type CmsTemplate } from "@/cms/templates/templateLibrary";

const BLOCK_ICONS: Record<string, { label: string; color: string }> = {
  hero: { label: "Hero", color: "#67e8f9" },
  richText: { label: "Text", color: "#a78bfa" },
  featureList: { label: "Features", color: "#34d399" },
  productHighlight: { label: "Product", color: "#fbbf24" },
  productGrid: { label: "Grid", color: "#fb923c" },
  testimonials: { label: "Reviews", color: "#f472b6" },
  trustBar: { label: "Trust", color: "#60a5fa" },
  callToAction: { label: "CTA", color: "#f87171" },
  faq: { label: "FAQ", color: "#a3a3a3" },
  comparisonTable: { label: "Compare", color: "#2dd4bf" },
  imageGrid: { label: "Images", color: "#c084fc" },
  spacer: { label: "Space", color: "#525252" },
};

function getBlockMeta(type: string) {
  return BLOCK_ICONS[type] ?? { label: type, color: "#6b7280" };
}

function TemplateThumbnail({ template }: { template: CmsTemplate }) {
  if (template.blocks.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800/30">
        <div className="flex flex-col items-center gap-2 text-gray-600">
          <FileText className="w-8 h-8" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Blank</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-[2px] p-2.5 bg-gray-900/80">
      {template.blocks.map((block, i) => {
        const meta = getBlockMeta(block.type);
        const isHero = block.type === "hero";
        return (
          <div
            key={i}
            className="rounded-sm flex items-center gap-1.5 px-2 shrink-0"
            style={{
              backgroundColor: `${meta.color}12`,
              borderLeft: `2px solid ${meta.color}`,
              height: isHero ? "28px" : "18px",
              minHeight: isHero ? "28px" : "18px",
            }}
          >
            <span className="text-[8px] font-medium truncate" style={{ color: meta.color }}>
              {meta.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TemplateCard({ template, onUse }: { template: CmsTemplate; onUse: () => void }) {
  const isBlank = template.id === "blank";
  return (
    <div
      className="group rounded-xl border border-gray-800/60 bg-gray-900/60 overflow-hidden hover:border-cyan-800/50 transition-all hover:shadow-lg hover:shadow-cyan-950/20"
      data-testid={`card-template-${template.id}`}
    >
      <div className="h-40 border-b border-gray-800/40 overflow-hidden relative">
        <TemplateThumbnail template={template} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              {isBlank ? (
                <FileText className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              )}
              <h3 className="font-semibold text-white text-sm truncate">{template.name}</h3>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Layers className="w-3 h-3 shrink-0" />
              <span className="text-[10px]">
                {template.blocks.length === 0 ? "Empty canvas" : `${template.blocks.length} blocks`}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{template.description}</p>

        {template.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {template.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-gray-700/60 text-gray-500 text-[10px] py-0 px-1.5"
                data-testid={`tag-${template.id}-${tag}`}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Button
          onClick={onUse}
          size="sm"
          className="w-full bg-cyan-600/90 hover:bg-cyan-600 text-white text-xs h-8"
          data-testid={`button-use-template-${template.id}`}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Create Page
        </Button>
      </div>
    </div>
  );
}

export default function AdminCmsV2Templates() {
  const { hasFullAccess, isLoading: adminLoading } = useAdmin();
  const [, navigate] = useLocation();

  if (adminLoading || !hasFullAccess) {
    return (
      <CmsV2Layout activeNav="templates" breadcrumbs={[{ label: "Templates" }]}>
        <div className="p-8 text-center text-gray-400">{adminLoading ? "Loading..." : "Access Denied"}</div>
      </CmsV2Layout>
    );
  }

  function handleUseTemplate(templateId: string) {
    navigate(`/admin/cms-v2/pages?template=${templateId}`);
  }

  return (
    <CmsV2Layout activeNav="templates" breadcrumbs={[{ label: "Templates" }]}>
      <div className="max-w-6xl mx-auto" data-testid="admin-cms-v2-templates-page">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white">Templates</h1>
          <p className="text-sm text-gray-500 mt-1">
            Pre-built page layouts to get started quickly. Pick a template and start editing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {CMS_TEMPLATES.map((tmpl) => (
            <TemplateCard
              key={tmpl.id}
              template={tmpl}
              onUse={() => handleUseTemplate(tmpl.id)}
            />
          ))}
        </div>
      </div>
    </CmsV2Layout>
  );
}
