import { useAdmin } from "@/hooks/use-admin";
import CmsV2Layout from "@/components/admin/CmsV2Layout";
import { BookTemplate, FileText, Layers, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const templatePreviews = [
  { name: "Blank Page", description: "Start from scratch with an empty canvas", icon: FileText, blocks: 0 },
  { name: "Landing Page", description: "Hero + features + CTA + testimonials", icon: Sparkles, blocks: 5 },
  { name: "Product Showcase", description: "Product highlight + comparison + trust bar", icon: Layers, blocks: 4 },
];

export default function AdminCmsV2Templates() {
  const { hasFullAccess, isLoading: adminLoading } = useAdmin();

  if (adminLoading || !hasFullAccess) {
    return (
      <CmsV2Layout activeNav="templates" breadcrumbs={[{ label: "Templates" }]}>
        <div className="p-8 text-center text-gray-400">{adminLoading ? "Loading..." : "Access Denied"}</div>
      </CmsV2Layout>
    );
  }

  return (
    <CmsV2Layout activeNav="templates" breadcrumbs={[{ label: "Templates" }]}>
      <div className="max-w-5xl mx-auto" data-testid="admin-cms-v2-templates-page">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-xl font-bold text-white">Templates</h1>
          <Badge variant="outline" className="border-gray-700 text-gray-500 text-xs">Coming Soon</Badge>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Templates provide pre-built page layouts with configured blocks. Select a template when creating a new page to get started quickly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {templatePreviews.map((tmpl) => (
            <Card key={tmpl.name} className="bg-gray-900/60 border-gray-800/60 hover:border-gray-700 transition-colors" data-testid={`card-template-${tmpl.name.toLowerCase().replace(/\s+/g, "-")}`}>
              <CardContent className="p-5">
                <div className="p-2.5 rounded-lg bg-gray-800/60 w-fit mb-3">
                  <tmpl.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-medium text-white text-sm mb-1">{tmpl.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{tmpl.description}</p>
                <Badge variant="outline" className="border-gray-700/60 text-gray-600 text-[10px]">
                  {tmpl.blocks} blocks
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </CmsV2Layout>
  );
}
