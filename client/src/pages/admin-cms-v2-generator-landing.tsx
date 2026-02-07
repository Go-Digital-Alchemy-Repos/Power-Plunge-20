import { useState, useMemo, useEffect, useRef } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import CmsV2Layout from "@/components/admin/CmsV2Layout";
import { CMS_TEMPLATES, type CmsTemplate } from "@/cms/templates/templateLibrary";
import { assembleLandingPage, type AssemblyResult } from "@/admin/cms-v2/generator/assembleLandingPage";
import { ChevronRight, ChevronLeft, Check, Wand2, FileText, Package, Layers, Settings2, Monitor, Smartphone, RefreshCw, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ThemePreset } from "@shared/themePresets";

interface Product {
  id: string;
  name: string;
  price: number;
  tagline?: string;
  imageUrl?: string;
  isActive?: boolean;
}

interface SavedSection {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  blocks: any;
  createdAt: string;
  updatedAt: string;
}

const ALLOWED_TEMPLATE_IDS = ["landing-page-v1", "product-story-v1", "sales-funnel-v1"];
const WIZARD_TEMPLATES = CMS_TEMPLATES.filter((t) => ALLOWED_TEMPLATE_IDS.includes(t.id));

const STEPS = [
  { id: 1, label: "Template", icon: FileText },
  { id: 2, label: "Products", icon: Package },
  { id: 3, label: "Sections", icon: Layers },
  { id: 4, label: "Details", icon: Settings2 },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function useSlugCheck(slug: string) {
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastChecked = useRef("");

  useEffect(() => {
    if (!slug || slug.length < 2) {
      setStatus("idle");
      return;
    }
    if (slug === lastChecked.current) return;

    setStatus("checking");
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/cms-v2/pages/check-slug?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        lastChecked.current = slug;
        setStatus(data.available ? "available" : "taken");
      } catch {
        setStatus("idle");
      }
    }, 400);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [slug]);

  return status;
}

function detectDuplicateBlocks(
  template: CmsTemplate | null,
  sectionIds: string[],
  sections: SavedSection[],
): string[] {
  if (!template || sectionIds.length === 0) return [];

  const templateTypes = new Set(template.blocks.map((b) => b.type));
  const warnings: string[] = [];

  for (const id of sectionIds) {
    const section = sections.find((s) => s.id === id);
    if (!section || !Array.isArray(section.blocks)) continue;
    for (const block of section.blocks) {
      if (templateTypes.has(block.type)) {
        warnings.push(`"${section.name}" adds a "${block.type}" block that already exists in the template.`);
        break;
      }
    }
  }
  return warnings;
}

const BLOCK_TYPE_LABELS: Record<string, string> = {
  hero: "Hero Banner",
  featureList: "Feature List",
  productHighlight: "Product Spotlight",
  productGrid: "Product Grid",
  testimonials: "Testimonials",
  trustBar: "Trust Bar",
  callToAction: "Call to Action",
  faq: "FAQ",
  richText: "Rich Text",
  imageGrid: "Image Grid",
  comparisonTable: "Comparison Table",
  sectionRef: "Section Reference",
};

export default function AdminCmsV2GeneratorLanding() {
  const { hasFullAccess, isLoading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<CmsTemplate | null>(null);
  const [primaryProductId, setPrimaryProductId] = useState<string>("");
  const [secondaryProductIds, setSecondaryProductIds] = useState<string[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [sectionMode, setSectionMode] = useState<"sectionRef" | "detach">("detach");
  const [pageTitle, setPageTitle] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ctaDestination, setCtaDestination] = useState<"shop" | "product" | "quote">("shop");
  const [themeOverride, setThemeOverride] = useState<string>("");
  const [publishNow, setPublishNow] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewWidth, setPreviewWidth] = useState<"desktop" | "mobile">("desktop");
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const slugStatus = useSlugCheck(pageSlug);

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: hasFullAccess,
  });

  const { data: sections } = useQuery<SavedSection[]>({
    queryKey: ["/api/admin/cms-v2/sections"],
    enabled: hasFullAccess,
  });

  const { data: themes } = useQuery<ThemePreset[]>({
    queryKey: ["/api/admin/cms-v2/themes"],
    enabled: hasFullAccess,
  });

  const duplicateWarnings = useMemo(
    () => detectDuplicateBlocks(selectedTemplate, selectedSections, sections || []),
    [selectedTemplate, selectedSections, sections],
  );

  const preview = useMemo<AssemblyResult | null>(() => {
    if (!selectedTemplate) return null;
    const chosenSections = selectedSections.length > 0 && sections
      ? selectedSections
          .map((id) => sections.find((s) => s.id === id))
          .filter((s): s is SavedSection => Boolean(s))
          .map((s) => ({ id: s.id, name: s.name, blocks: Array.isArray(s.blocks) ? s.blocks : [] }))
      : [];

    return assembleLandingPage({
      template: selectedTemplate,
      primaryProductId,
      secondaryProductIds,
      sections: chosenSections,
      sectionMode,
      ctaDestination,
      themeOverride,
      title: pageTitle.trim() || "Untitled Page",
      slug: pageSlug.trim() || "untitled",
      metaTitle: metaTitle.trim(),
      metaDescription: metaDescription.trim(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate, primaryProductId, secondaryProductIds, selectedSections, sectionMode, ctaDestination, themeOverride, pageTitle, pageSlug, metaTitle, metaDescription, sections, previewKey]);

  const generateMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTemplate) throw new Error("No template selected");
      if (!pageTitle.trim()) throw new Error("Page title is required");
      if (!pageSlug.trim()) throw new Error("Page slug is required");
      if (slugStatus === "taken") throw new Error("Slug is already taken — choose a different one");

      const chosenSections = selectedSections.length > 0 && sections
        ? selectedSections
            .map((id) => sections.find((s) => s.id === id))
            .filter((s): s is SavedSection => Boolean(s))
            .map((s) => ({ id: s.id, name: s.name, blocks: Array.isArray(s.blocks) ? s.blocks : [] }))
        : [];

      const { contentJson, seo } = assembleLandingPage({
        template: selectedTemplate,
        primaryProductId,
        secondaryProductIds,
        sections: chosenSections,
        sectionMode,
        ctaDestination,
        themeOverride,
        title: pageTitle.trim(),
        slug: pageSlug.trim(),
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
      });

      const pageData: Record<string, any> = {
        title: pageTitle.trim(),
        slug: pageSlug.trim(),
        pageType: "landing",
        contentJson,
        template: selectedTemplate.id,
        status: publishNow ? "published" : "draft",
        metaTitle: seo.metaTitle,
        metaDescription: seo.metaDescription,
        ogTitle: seo.ogTitle,
        ogDescription: seo.ogDescription,
      };

      const res = await apiRequest("POST", "/api/admin/cms-v2/pages", pageData);
      const created = await res.json();

      if (publishNow && created.id) {
        await apiRequest("POST", `/api/admin/cms-v2/pages/${created.id}/publish`);
      }

      return created;
    },
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms-v2/pages"] });
      toast({
        title: publishNow ? "Page generated & published" : "Page generated",
        description: `"${page.title}" has been created${publishNow ? " and published" : " as a draft"}.`,
      });
      navigate(`/admin/cms-v2/pages/${page.id}/builder`);
    },
    onError: (err: Error) => {
      toast({ title: "Failed to generate page", description: err.message, variant: "destructive" });
    },
  });

  function handleTitleChange(title: string) {
    setPageTitle(title);
    if (!slugManuallyEdited) {
      setPageSlug(slugify(title));
    }
    if (!metaTitle) {
      setMetaTitle(title);
    }
  }

  function canAdvance(): boolean {
    if (step === 1) return !!selectedTemplate;
    if (step === 2) return true;
    if (step === 3) return true;
    if (step === 4) return !!pageTitle.trim() && !!pageSlug.trim() && slugStatus !== "taken";
    return false;
  }

  function next() { if (canAdvance() && step < 4) setStep(step + 1); }
  function back() { if (step > 1) setStep(step - 1); }

  function toggleSection(id: string) {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function toggleSecondaryProduct(id: string) {
    if (id === primaryProductId) return;
    setSecondaryProductIds((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  }

  function handleGenerate() {
    if (publishNow) {
      setShowPublishConfirm(true);
    } else {
      generateMutation.mutate();
    }
  }

  function handleRegenerate() {
    setPreviewKey((k) => k + 1);
    toast({ title: "Preview regenerated", description: "The preview has been updated with your current selections." });
  }

  if (adminLoading || !hasFullAccess) {
    return (
      <CmsV2Layout activeNav="generator" breadcrumbs={[{ label: "Generator" }, { label: "Landing Page" }]}>
        <div className="p-8 text-center text-gray-400">{adminLoading ? "Loading..." : "Access Denied"}</div>
      </CmsV2Layout>
    );
  }

  return (
    <CmsV2Layout activeNav="generator" breadcrumbs={[{ label: "Generator" }, { label: "Landing Page" }]}>
      <div className="max-w-6xl mx-auto" data-testid="generator-landing-page">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-cyan-400" />
              Landing Page Generator
            </h1>
            <p className="text-sm text-gray-500 mt-1">Build a landing page in 4 steps — choose a template, add products, attach sections, and configure details.</p>
          </div>
          <div className="flex items-center gap-2">
            {selectedTemplate && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                  className="border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
                  data-testid="button-regenerate"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  Regenerate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className={`border-gray-700 ${showPreview ? "text-cyan-400 border-cyan-700/50" : "text-gray-400 hover:text-white hover:border-gray-600"}`}
                  data-testid="button-toggle-preview"
                >
                  {showPreview ? <EyeOff className="w-3.5 h-3.5 mr-1.5" /> : <Eye className="w-3.5 h-3.5 mr-1.5" />}
                  {showPreview ? "Hide Preview" : "Preview"}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 mb-8" data-testid="wizard-steps">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isCompleted = step > s.id;
            return (
              <div key={s.id} className="flex items-center gap-1 flex-1">
                <button
                  onClick={() => { if (isCompleted) setStep(s.id); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors w-full ${
                    isActive ? "bg-cyan-600/20 text-cyan-400 border border-cyan-600/40" :
                    isCompleted ? "bg-gray-800/60 text-green-400 border border-green-800/40 cursor-pointer hover:bg-gray-800" :
                    "bg-gray-900/40 text-gray-600 border border-gray-800/40"
                  }`}
                  data-testid={`step-${s.id}`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.id}</span>
                </button>
                {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-gray-700 shrink-0" />}
              </div>
            );
          })}
        </div>

        <div className={`${showPreview && preview ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : ""}`}>
          <div className="min-h-[400px]">
            {step === 1 && (
              <StepTemplate
                templates={WIZARD_TEMPLATES}
                selected={selectedTemplate}
                onSelect={setSelectedTemplate}
              />
            )}
            {step === 2 && (
              <StepProducts
                products={products || []}
                primaryProductId={primaryProductId}
                secondaryProductIds={secondaryProductIds}
                onPrimaryChange={setPrimaryProductId}
                onToggleSecondary={toggleSecondaryProduct}
              />
            )}
            {step === 3 && (
              <StepSections
                sections={sections || []}
                selectedIds={selectedSections}
                sectionMode={sectionMode}
                onToggle={toggleSection}
                onModeChange={setSectionMode}
                duplicateWarnings={duplicateWarnings}
              />
            )}
            {step === 4 && (
              <StepDetails
                pageTitle={pageTitle}
                pageSlug={pageSlug}
                metaTitle={metaTitle}
                metaDescription={metaDescription}
                ctaDestination={ctaDestination}
                themeOverride={themeOverride}
                publishNow={publishNow}
                themes={themes || []}
                slugStatus={slugStatus}
                onTitleChange={handleTitleChange}
                onSlugChange={(v) => { setPageSlug(v); setSlugManuallyEdited(true); }}
                onMetaTitleChange={setMetaTitle}
                onMetaDescriptionChange={setMetaDescription}
                onCtaChange={setCtaDestination}
                onThemeChange={setThemeOverride}
                onPublishChange={setPublishNow}
              />
            )}
          </div>

          {showPreview && preview && (
            <PreviewPanel
              result={preview}
              previewWidth={previewWidth}
              onWidthChange={setPreviewWidth}
            />
          )}
        </div>

        <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-800/60">
          <Button
            variant="ghost"
            onClick={back}
            disabled={step === 1}
            className="text-gray-400 hover:text-white"
            data-testid="button-back"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex items-center gap-2">
            {step < 4 ? (
              <Button
                onClick={next}
                disabled={!canAdvance()}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
                data-testid="button-next"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleGenerate}
                disabled={!canAdvance() || generateMutation.isPending || slugStatus === "checking"}
                className="bg-green-600 hover:bg-green-700 text-white"
                data-testid="button-generate"
              >
                <Wand2 className="w-4 h-4 mr-1" />
                {generateMutation.isPending ? "Generating..." : publishNow ? "Generate & Publish" : "Generate Page"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={showPublishConfirm} onOpenChange={setShowPublishConfirm}>
        <AlertDialogContent className="bg-gray-900 border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Publish immediately?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will generate the page and make it publicly visible right away. You can always unpublish it later from the page builder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white" data-testid="button-cancel-publish">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => generateMutation.mutate()}
              data-testid="button-confirm-publish"
            >
              Yes, Generate & Publish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CmsV2Layout>
  );
}

function PreviewPanel({ result, previewWidth, onWidthChange }: {
  result: AssemblyResult;
  previewWidth: "desktop" | "mobile";
  onWidthChange: (w: "desktop" | "mobile") => void;
}) {
  const blocks = result.contentJson.blocks;

  return (
    <div className="border border-gray-800/60 rounded-lg bg-gray-950 overflow-hidden" data-testid="preview-panel">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-900/80 border-b border-gray-800/60">
        <span className="text-xs font-medium text-gray-400">
          Preview — {blocks.length} blocks
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onWidthChange("desktop")}
            className={`p-1.5 rounded transition-colors ${previewWidth === "desktop" ? "text-cyan-400 bg-cyan-950/30" : "text-gray-500 hover:text-white"}`}
            data-testid="preview-desktop"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => onWidthChange("mobile")}
            className={`p-1.5 rounded transition-colors ${previewWidth === "mobile" ? "text-cyan-400 bg-cyan-950/30" : "text-gray-500 hover:text-white"}`}
            data-testid="preview-mobile"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-3 flex justify-center">
        <div
          className="transition-all duration-300"
          style={{ width: previewWidth === "mobile" ? "375px" : "100%", maxWidth: "100%" }}
        >
          <div className="space-y-1.5" data-testid="preview-blocks">
            {blocks.map((block, i) => (
              <PreviewBlock key={block.id} block={block} index={i} />
            ))}
          </div>

          {result.contentJson.themeOverride && (
            <div className="mt-3 px-2 py-1.5 rounded bg-gray-800/40 border border-gray-800/40">
              <span className="text-[10px] text-gray-500">Theme override: </span>
              <span className="text-[10px] text-cyan-400">{result.contentJson.themeOverride}</span>
            </div>
          )}

          <div className="mt-3 px-2 py-1.5 rounded bg-gray-800/40 border border-gray-800/40">
            <p className="text-[10px] text-gray-500 mb-0.5">SEO</p>
            <p className="text-[11px] text-white truncate">{result.seo.metaTitle}</p>
            <p className="text-[10px] text-gray-500 truncate">{result.seo.metaDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewBlock({ block, index }: { block: any; index: number }) {
  const label = BLOCK_TYPE_LABELS[block.type] || block.type;
  const isRef = block.type === "sectionRef";

  let detail = "";
  if (block.type === "hero") detail = block.data.headline || "";
  else if (block.type === "productHighlight") detail = block.data.productId ? `Product: ${block.data.productId}` : "No product set";
  else if (block.type === "productGrid") detail = `${(block.data.productIds || []).length} products, ${block.data.columns || "?"} cols`;
  else if (block.type === "featureList") detail = `${(block.data.items || []).length} features`;
  else if (block.type === "testimonials") detail = `${(block.data.items || []).length} quotes`;
  else if (block.type === "faq") detail = `${(block.data.items || []).length} questions`;
  else if (block.type === "callToAction") detail = block.data.headline || "";
  else if (block.type === "sectionRef") detail = block.data.sectionName || block.data.sectionId;
  else if (block.type === "richText") detail = "Rich content block";
  else if (block.type === "trustBar") detail = `${(block.data.items || []).length} items`;
  else if (block.type === "comparisonTable") detail = block.data.title || "";

  return (
    <div
      className={`flex items-center gap-2 px-2.5 py-2 rounded text-xs border transition-colors ${
        isRef
          ? "border-purple-800/40 bg-purple-950/20"
          : "border-gray-800/40 bg-gray-900/40"
      }`}
      data-testid={`preview-block-${index}`}
    >
      <span className="text-gray-600 w-4 text-right shrink-0">{index + 1}</span>
      <span className={`font-medium shrink-0 ${isRef ? "text-purple-400" : "text-cyan-400"}`}>{label}</span>
      {detail && <span className="text-gray-500 truncate">{detail}</span>}
      <span className="ml-auto text-[10px] text-gray-700 shrink-0">v{block.version}</span>
    </div>
  );
}

function StepTemplate({ templates, selected, onSelect }: {
  templates: CmsTemplate[];
  selected: CmsTemplate | null;
  onSelect: (t: CmsTemplate) => void;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-white mb-1">Choose a Template</h2>
      <p className="text-xs text-gray-500 mb-4">Select the base layout for your landing page. You can customize all content after generation.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {templates.map((tmpl) => {
          const isSelected = selected?.id === tmpl.id;
          return (
            <Card
              key={tmpl.id}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? "border-cyan-500 bg-cyan-950/20 ring-1 ring-cyan-500/30"
                  : "border-gray-800/60 bg-gray-900/60 hover:border-gray-700"
              }`}
              onClick={() => onSelect(tmpl)}
              data-testid={`template-card-${tmpl.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-white text-sm">{tmpl.name}</h3>
                  {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                </div>
                <p className="text-xs text-gray-500 mb-3">{tmpl.description}</p>
                <div className="flex flex-wrap gap-1">
                  {tmpl.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-gray-700/60 text-gray-500 text-[10px]">{tag}</Badge>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {tmpl.blocks.map((block, i) => (
                    <span key={i} className="text-[10px] bg-gray-800/60 text-gray-400 px-1.5 py-0.5 rounded">{block.type}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function StepProducts({ products, primaryProductId, secondaryProductIds, onPrimaryChange, onToggleSecondary }: {
  products: Product[];
  primaryProductId: string;
  secondaryProductIds: string[];
  onPrimaryChange: (id: string) => void;
  onToggleSecondary: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-white mb-1">Choose Products</h2>
      <p className="text-xs text-gray-500 mb-4">Select a primary product for the spotlight block, and optionally add secondary products for a product grid.</p>

      <div className="space-y-4">
        <div>
          <Label className="text-gray-300 text-xs mb-2 block">Primary Product</Label>
          <Select value={primaryProductId || "none"} onValueChange={(v) => onPrimaryChange(v === "none" ? "" : v)}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white" data-testid="select-primary-product">
              <SelectValue placeholder="Select a product (optional)" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600 text-white">
              <SelectItem value="none">No primary product</SelectItem>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} — ${(p.price / 100).toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-gray-300 text-xs mb-2 block">
            Secondary Products <span className="text-gray-600">(0–5 for product grid)</span>
          </Label>
          {products.length === 0 ? (
            <p className="text-xs text-gray-600">No products available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {products.filter((p) => p.id !== primaryProductId).map((p) => {
                const isSelected = secondaryProductIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => onToggleSecondary(p.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected
                        ? "border-cyan-600/50 bg-cyan-950/20"
                        : "border-gray-800/60 bg-gray-900/40 hover:border-gray-700"
                    }`}
                    data-testid={`secondary-product-${p.id}`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? "border-cyan-500 bg-cyan-500" : "border-gray-600"
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">${(p.price / 100).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepSections({ sections, selectedIds, sectionMode, onToggle, onModeChange, duplicateWarnings }: {
  sections: SavedSection[];
  selectedIds: string[];
  sectionMode: "sectionRef" | "detach";
  onToggle: (id: string) => void;
  onModeChange: (mode: "sectionRef" | "detach") => void;
  duplicateWarnings: string[];
}) {
  function getBlockCount(blocks: any): number {
    if (Array.isArray(blocks)) return blocks.length;
    return 0;
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-white mb-1">Add Sections / Kits</h2>
      <p className="text-xs text-gray-500 mb-4">Select saved sections or kits to append to the page. These are added after the template blocks.</p>

      <div className="mb-4 flex items-center gap-4">
        <Label className="text-gray-400 text-xs">Insertion Mode:</Label>
        <div className="flex gap-2">
          <button
            onClick={() => onModeChange("detach")}
            className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
              sectionMode === "detach"
                ? "border-cyan-600/50 bg-cyan-950/20 text-cyan-400"
                : "border-gray-700 text-gray-500 hover:text-white"
            }`}
            data-testid="mode-detach"
          >
            Detach (copy blocks)
          </button>
          <button
            onClick={() => onModeChange("sectionRef")}
            className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
              sectionMode === "sectionRef"
                ? "border-cyan-600/50 bg-cyan-950/20 text-cyan-400"
                : "border-gray-700 text-gray-500 hover:text-white"
            }`}
            data-testid="mode-sectionRef"
          >
            Section Ref (linked)
          </button>
        </div>
      </div>

      {duplicateWarnings.length > 0 && (
        <div className="mb-4 p-3 rounded-lg border border-yellow-700/40 bg-yellow-950/20" data-testid="duplicate-warnings">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-yellow-400 mb-1">Potential duplicate blocks</p>
              {duplicateWarnings.map((w, i) => (
                <p key={i} className="text-[11px] text-yellow-600">{w}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {sections.length === 0 ? (
        <Card className="bg-gray-900/60 border-gray-800/60">
          <CardContent className="p-8 text-center">
            <Layers className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-gray-500 text-xs">No saved sections. You can skip this step or load starter kits from the Sections page.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {sections.map((section) => {
            const isSelected = selectedIds.includes(section.id);
            return (
              <div
                key={section.id}
                onClick={() => onToggle(section.id)}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  isSelected
                    ? "border-cyan-600/50 bg-cyan-950/20"
                    : "border-gray-800/60 bg-gray-900/40 hover:border-gray-700"
                }`}
                data-testid={`section-card-${section.id}`}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  isSelected ? "border-cyan-500 bg-cyan-500" : "border-gray-600"
                }`}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{section.name}</p>
                  {section.description && <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{section.description}</p>}
                  <div className="flex gap-1.5 mt-1.5">
                    {section.category && (
                      <Badge variant="outline" className="border-gray-700/60 text-gray-600 text-[10px]">{section.category}</Badge>
                    )}
                    <Badge variant="outline" className="border-gray-700/60 text-gray-600 text-[10px]">
                      {getBlockCount(section.blocks)} blocks
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedIds.length > 0 && (
        <p className="text-xs text-gray-500 mt-3">{selectedIds.length} section(s) selected — will be appended in {sectionMode === "detach" ? "detached (copy)" : "linked reference"} mode.</p>
      )}
    </div>
  );
}

function StepDetails({ pageTitle, pageSlug, metaTitle, metaDescription, ctaDestination, themeOverride, publishNow, themes, slugStatus, onTitleChange, onSlugChange, onMetaTitleChange, onMetaDescriptionChange, onCtaChange, onThemeChange, onPublishChange }: {
  pageTitle: string;
  pageSlug: string;
  metaTitle: string;
  metaDescription: string;
  ctaDestination: "shop" | "product" | "quote";
  themeOverride: string;
  publishNow: boolean;
  themes: ThemePreset[];
  slugStatus: "idle" | "checking" | "available" | "taken";
  onTitleChange: (v: string) => void;
  onSlugChange: (v: string) => void;
  onMetaTitleChange: (v: string) => void;
  onMetaDescriptionChange: (v: string) => void;
  onCtaChange: (v: "shop" | "product" | "quote") => void;
  onThemeChange: (v: string) => void;
  onPublishChange: (v: boolean) => void;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-white mb-1">Page Details</h2>
      <p className="text-xs text-gray-500 mb-4">Set the title, slug, SEO metadata, and publishing options.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gen-title" className="text-gray-300 text-xs">Page Title *</Label>
            <Input
              id="gen-title"
              value={pageTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g., Cold Plunge Landing Page"
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
              data-testid="input-page-title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gen-slug" className="text-gray-300 text-xs">Slug *</Label>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-xs">/</span>
              <div className="flex-1 relative">
                <Input
                  id="gen-slug"
                  value={pageSlug}
                  onChange={(e) => onSlugChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="cold-plunge-landing"
                  className={`bg-gray-800 text-white placeholder:text-gray-500 pr-8 ${
                    slugStatus === "taken" ? "border-red-500" :
                    slugStatus === "available" ? "border-green-600" :
                    "border-gray-600"
                  }`}
                  data-testid="input-page-slug"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  {slugStatus === "checking" && (
                    <RefreshCw className="w-3.5 h-3.5 text-gray-500 animate-spin" />
                  )}
                  {slugStatus === "available" && (
                    <Check className="w-3.5 h-3.5 text-green-500" data-testid="slug-available" />
                  )}
                  {slugStatus === "taken" && (
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" data-testid="slug-taken" />
                  )}
                </div>
              </div>
            </div>
            {slugStatus === "taken" && (
              <p className="text-[11px] text-red-400" data-testid="slug-taken-message">This slug is already in use. Choose a different one.</p>
            )}
            {slugStatus === "available" && (
              <p className="text-[11px] text-green-500" data-testid="slug-available-message">Slug is available.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gen-meta-title" className="text-gray-300 text-xs">Meta Title</Label>
            <Input
              id="gen-meta-title"
              value={metaTitle}
              onChange={(e) => onMetaTitleChange(e.target.value)}
              placeholder="Auto-filled from title"
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
              data-testid="input-meta-title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gen-meta-desc" className="text-gray-300 text-xs">Meta Description</Label>
            <Textarea
              id="gen-meta-desc"
              value={metaDescription}
              onChange={(e) => onMetaDescriptionChange(e.target.value)}
              placeholder="Optional — for search engine results"
              rows={2}
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
              data-testid="input-meta-description"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300 text-xs">CTA Destination</Label>
            <Select value={ctaDestination} onValueChange={(v) => onCtaChange(v as any)}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white" data-testid="select-cta-destination">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 text-white">
                <SelectItem value="shop">Shop Page (/shop)</SelectItem>
                <SelectItem value="product">Primary Product Page</SelectItem>
                <SelectItem value="quote">Get a Quote (/contact)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300 text-xs">Theme Override</Label>
            <Select value={themeOverride || "none"} onValueChange={(v) => onThemeChange(v === "none" ? "" : v)}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white" data-testid="select-theme-override">
                <SelectValue placeholder="Use active theme" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 text-white">
                <SelectItem value="none">Use active theme (no override)</SelectItem>
                {themes.map((theme) => (
                  <SelectItem key={theme.id} value={theme.id}>{theme.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-800/60 bg-gray-900/40">
            <div>
              <p className="text-sm text-white">Publish immediately</p>
              <p className="text-[11px] text-gray-500">If off, page will be saved as a draft.</p>
            </div>
            <Switch
              checked={publishNow}
              onCheckedChange={onPublishChange}
              data-testid="switch-publish-now"
            />
          </div>

          <div className="p-3 rounded-lg border border-gray-800/40 bg-gray-900/30">
            <p className="text-[11px] text-gray-600 leading-relaxed">
              After generating, you'll be redirected to the page builder where you can edit all blocks, reorder sections, and fine-tune content before publishing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
