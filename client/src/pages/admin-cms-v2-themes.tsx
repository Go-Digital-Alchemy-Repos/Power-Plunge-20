import { useState, useEffect } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CmsV2Layout from "@/components/admin/CmsV2Layout";
import { Palette, Check, Eye, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { applyThemeVariables, clearThemeVariables } from "@/components/ThemeProvider";
import type { ThemePreset } from "@shared/themePresets";

function ThemeSwatchRow({ variables }: { variables: Record<string, string> }) {
  const colors = [
    variables["--theme-bg"],
    variables["--theme-bg-card"],
    variables["--theme-bg-elevated"],
    variables["--theme-primary"],
    variables["--theme-accent"],
    variables["--theme-text"],
    variables["--theme-text-muted"],
  ].filter(Boolean);

  return (
    <div className="flex gap-1">
      {colors.map((color, i) => (
        <div key={i} className="w-4 h-4 rounded-sm border border-white/10" style={{ backgroundColor: color }} />
      ))}
    </div>
  );
}

function ThemePreview({ variables }: { variables: Record<string, string> }) {
  return (
    <div
      className="rounded-lg border overflow-hidden text-xs"
      style={{
        backgroundColor: variables["--theme-bg"],
        borderColor: variables["--theme-border"],
        fontFamily: variables["--theme-font"],
      }}
    >
      <div
        className="px-3 py-1.5 flex items-center justify-between"
        style={{ backgroundColor: variables["--theme-bg-card"], borderBottom: `1px solid ${variables["--theme-border"]}` }}
      >
        <span style={{ color: variables["--theme-text"] }} className="font-semibold text-[10px]">Header</span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: variables["--theme-error"] }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: variables["--theme-warning"] }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: variables["--theme-success"] }} />
        </div>
      </div>
      <div className="p-2.5 space-y-1.5">
        <div style={{ color: variables["--theme-text"] }} className="font-medium text-[10px]">Page Title</div>
        <div style={{ color: variables["--theme-text-muted"] }} className="text-[9px]">Body text preview.</div>
        <div className="flex gap-1.5 mt-1.5">
          <div
            className="px-1.5 py-0.5 rounded text-[8px] font-medium"
            style={{
              backgroundColor: variables["--theme-primary"],
              color: variables["--theme-bg"],
              borderRadius: variables["--theme-radius"],
            }}
          >
            Primary
          </div>
          <div
            className="px-1.5 py-0.5 rounded text-[8px] font-medium"
            style={{
              backgroundColor: variables["--theme-bg-elevated"],
              color: variables["--theme-text"],
              border: `1px solid ${variables["--theme-border"]}`,
              borderRadius: variables["--theme-radius"],
            }}
          >
            Secondary
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminCmsV2Themes() {
  const { hasFullAccess, isLoading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [originalVars, setOriginalVars] = useState<Record<string, string> | null>(null);

  const { data: themes } = useQuery<ThemePreset[]>({
    queryKey: ["/api/admin/cms-v2/themes"],
    enabled: hasFullAccess,
  });

  const { data: activeTheme } = useQuery<ThemePreset>({
    queryKey: ["/api/admin/cms-v2/themes/active"],
    enabled: hasFullAccess,
  });

  const activateMutation = useMutation({
    mutationFn: async (themeId: string) => {
      const res = await fetch("/api/admin/cms-v2/themes/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeId }),
      });
      if (!res.ok) throw new Error("Failed to activate theme");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms-v2/themes/active"] });
      queryClient.invalidateQueries({ queryKey: ["/api/theme/active"] });
      applyThemeVariables(data.variables);
      setPreviewId(null);
      setOriginalVars(null);
      toast({ title: "Theme activated", description: `"${data.name}" is now the active theme.` });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to activate theme.", variant: "destructive" });
    },
  });

  const handlePreview = (theme: ThemePreset) => {
    if (previewId === theme.id) {
      handleStopPreview();
      return;
    }
    if (!originalVars && activeTheme) {
      setOriginalVars(activeTheme.variables);
    }
    setPreviewId(theme.id);
    applyThemeVariables(theme.variables);
  };

  const handleStopPreview = () => {
    if (originalVars) applyThemeVariables(originalVars);
    else if (activeTheme) applyThemeVariables(activeTheme.variables);
    setPreviewId(null);
    setOriginalVars(null);
  };

  useEffect(() => {
    return () => {
      if (originalVars) applyThemeVariables(originalVars);
    };
  }, []);

  if (adminLoading || !hasFullAccess) {
    return (
      <CmsV2Layout activeNav="themes" breadcrumbs={[{ label: "Themes" }]}>
        <div className="p-8 text-center text-gray-400">{adminLoading ? "Loading..." : "Access Denied"}</div>
      </CmsV2Layout>
    );
  }

  return (
    <CmsV2Layout activeNav="themes" breadcrumbs={[{ label: "Themes" }]}>
      <div className="max-w-5xl mx-auto" data-testid="admin-cms-v2-themes-page">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Themes
              {activeTheme && (
                <Badge variant="outline" className="border-cyan-700/60 text-cyan-400 text-[10px]">Active: {activeTheme.name}</Badge>
              )}
            </h1>
          </div>
          {previewId && (
            <Button
              size="sm"
              variant="outline"
              className="border-yellow-700 text-yellow-400 hover:bg-yellow-900/20 h-8 text-xs gap-1.5"
              onClick={handleStopPreview}
              data-testid="button-stop-preview"
            >
              <RotateCcw className="w-3 h-3" />
              Revert Preview
            </Button>
          )}
        </div>

        {previewId && (
          <div className="mb-4 p-2.5 rounded-lg border border-yellow-700/30 bg-yellow-900/10 text-yellow-400 text-xs" data-testid="text-preview-banner">
            Previewing — changes are temporary until you activate.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {themes?.map((theme) => {
            const isActive = activeTheme?.id === theme.id;
            const isPreviewing = previewId === theme.id;

            return (
              <Card
                key={theme.id}
                className={`bg-gray-900/60 border-gray-800/60 transition-all ${isPreviewing ? "ring-1 ring-yellow-500/50" : isActive ? "ring-1 ring-cyan-500/50" : "hover:border-gray-700"}`}
                data-testid={`card-theme-${theme.id}`}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-medium text-white text-sm truncate" data-testid={`text-theme-name-${theme.id}`}>{theme.name}</h3>
                        {isActive && (
                          <Badge className="bg-cyan-900/30 text-cyan-400 border-cyan-800/60 text-[9px] px-1.5 gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Active
                          </Badge>
                        )}
                        {isPreviewing && (
                          <Badge className="bg-yellow-900/30 text-yellow-400 border-yellow-800/60 text-[9px] px-1.5 gap-0.5">
                            <Eye className="w-2.5 h-2.5" /> Preview
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{theme.description}</p>
                    </div>
                  </div>

                  <ThemePreview variables={theme.variables} />
                  <ThemeSwatchRow variables={theme.variables} />

                  <div className="flex gap-1.5 pt-0.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`h-7 text-[11px] ${isPreviewing ? "border-yellow-700/60 text-yellow-400" : "border-gray-700/60 text-gray-500 hover:text-white"}`}
                      onClick={() => handlePreview(theme)}
                      data-testid={`button-preview-${theme.id}`}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      {isPreviewing ? "Stop" : "Preview"}
                    </Button>
                    {!isActive && (
                      <Button
                        size="sm"
                        className="bg-cyan-700 hover:bg-cyan-600 text-white h-7 text-[11px]"
                        onClick={() => activateMutation.mutate(theme.id)}
                        disabled={activateMutation.isPending}
                        data-testid={`button-activate-${theme.id}`}
                      >
                        <Check className="w-3 h-3 mr-1" />
                        {activateMutation.isPending ? "..." : "Activate"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </CmsV2Layout>
  );
}
