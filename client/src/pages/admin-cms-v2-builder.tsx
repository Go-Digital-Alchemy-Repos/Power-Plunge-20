import { useMemo, useState, useCallback } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { useRoute, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AdminNav from "@/components/admin/AdminNav";
import { ArrowLeft, Save, Globe, Layers, Unlink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Puck, usePuck, type Config, type Data } from "@puckeditor/core";
import "@puckeditor/core/dist/index.css";
import { registerAllBlocks } from "@/lib/blockRegistryEntries";
import { getAllBlocks } from "@/lib/blockRegistry";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

registerAllBlocks();

function buildPuckConfig(): Config {
  const entries = getAllBlocks();
  const components: Config["components"] = {};

  for (const entry of entries) {
    if (entry.type === "sectionRef") continue;

    const puckFields: Record<string, any> = {};
    for (const [key, field] of Object.entries(entry.puckFields)) {
      if (field.type === "text") {
        puckFields[key] = { type: "text", label: field.label || key };
      } else if (field.type === "textarea") {
        puckFields[key] = { type: "textarea", label: field.label || key };
      } else if (field.type === "number") {
        puckFields[key] = { type: "number", label: field.label || key, min: field.min, max: field.max };
      } else if (field.type === "select") {
        puckFields[key] = { type: "select", label: field.label || key, options: field.options || [] };
      } else if (field.type === "radio") {
        puckFields[key] = { type: "radio", label: field.label || key, options: field.options || [] };
      }
    }

    components[entry.type] = {
      label: entry.label,
      defaultProps: entry.defaultProps,
      fields: puckFields,
      render: ({ puck: _puck, ...props }: any) => {
        const Comp = entry.renderComponent as any;
        return <Comp data={props} />;
      },
    };
  }

  components["sectionRef"] = {
    label: "Section Reference",
    defaultProps: { sectionId: "", sectionName: "" },
    fields: {
      sectionId: { type: "text", label: "Section ID" },
      sectionName: { type: "text", label: "Section Name" },
    },
    render: ({ puck: _puck, sectionId, sectionName, ...rest }: any) => (
      <div className="border-2 border-dashed border-cyan-700/50 rounded-lg p-4 my-2 bg-cyan-900/10">
        <div className="flex items-center gap-2 text-cyan-400 text-sm">
          <Layers className="w-4 h-4" />
          <span className="font-medium">Section: {sectionName || sectionId || "Not set"}</span>
        </div>
        {!sectionId && (
          <p className="text-gray-500 text-xs mt-1">Use "Insert Section" to link a saved section.</p>
        )}
      </div>
    ),
  };

  return {
    components,
    root: {
      defaultProps: { title: "" },
      fields: {
        title: { type: "text", label: "Page Title" },
      },
      render: ({ children }: any) => (
        <div className="page-renderer bg-gray-950 text-white min-h-screen">{children}</div>
      ),
    },
  };
}

function puckDataToContentJson(data: Data): { version: number; blocks: any[] } {
  const blocks = (data.content || []).map((item: any) => ({
    id: item.props?.id || crypto.randomUUID(),
    type: item.type,
    data: Object.fromEntries(
      Object.entries(item.props || {}).filter(([k]) => k !== "id")
    ),
    settings: {},
  }));
  return { version: 1, blocks };
}

function contentJsonToPuckData(contentJson: any, pageTitle: string): Data {
  const blocks = contentJson?.blocks || [];
  const content = blocks.map((block: any) => ({
    type: block.type,
    props: {
      id: block.id || crypto.randomUUID(),
      ...block.data,
    },
  }));
  return {
    root: { props: { title: pageTitle || "" } },
    content,
    zones: {},
  };
}

interface SavedSection {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  blocks: any[];
}

function InsertSectionButton({ onInsert }: { onInsert: (section: SavedSection) => void }) {
  const [open, setOpen] = useState(false);
  const { data: sections } = useQuery<SavedSection[]>({
    queryKey: ["/api/admin/cms-v2/sections"],
    enabled: open,
  });

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="border-cyan-700 text-cyan-400 hover:bg-cyan-900/30"
        onClick={() => setOpen(true)}
        data-testid="button-insert-section"
      >
        <Layers className="w-4 h-4 mr-1" />
        Insert Section
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-lg" data-testid="dialog-insert-section">
          <DialogHeader>
            <DialogTitle className="text-white">Insert Saved Section</DialogTitle>
            <DialogDescription className="text-gray-400">
              Choose a section to insert. It will be linked — changes to the section update all pages using it.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-80 overflow-y-auto space-y-2 py-2">
            {!sections || sections.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                No saved sections. Create sections in the Sections library first.
              </p>
            ) : (
              sections.map((section) => (
                <Card
                  key={section.id}
                  className="bg-gray-800 border-gray-700 hover:border-cyan-700 cursor-pointer transition-colors"
                  onClick={() => { onInsert(section); setOpen(false); }}
                  data-testid={`section-option-${section.id}`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white text-sm">{section.name}</p>
                        {section.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                        {Array.isArray(section.blocks) ? section.blocks.length : 0} blocks
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DetachSectionButton({ pageId, pageTitle, onDone }: { pageId: string; pageTitle: string; onDone: () => void }) {
  const { appState, dispatch } = usePuck();
  const { toast } = useToast();
  const [detaching, setDetaching] = useState(false);

  const sectionRefCount = (appState.data.content || []).filter((item: any) => item.type === "sectionRef" && item.props?.sectionId).length;

  const handleDetach = async () => {
    setDetaching(true);
    try {
      const newContent: any[] = [];
      for (const item of appState.data.content || []) {
        if (item.type === "sectionRef" && item.props?.sectionId) {
          const res = await fetch(`/api/admin/cms-v2/sections/${item.props.sectionId}`, { credentials: "include" });
          if (res.ok) {
            const section = await res.json();
            const blocks = Array.isArray(section.blocks) ? section.blocks : [];
            for (const block of blocks) {
              newContent.push({
                type: block.type,
                props: {
                  id: crypto.randomUUID(),
                  ...block.data,
                },
              });
            }
          } else {
            newContent.push(item);
          }
        } else {
          newContent.push(item);
        }
      }

      const contentJson = {
        version: 1,
        blocks: newContent.map((item: any) => ({
          id: item.props?.id || crypto.randomUUID(),
          type: item.type,
          data: Object.fromEntries(
            Object.entries(item.props || {}).filter(([k]) => k !== "id")
          ),
          settings: {},
        })),
      };

      const saveRes = await fetch(`/api/admin/cms-v2/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentJson, title: (appState.data.root as any)?.props?.title || pageTitle }),
      });
      if (!saveRes.ok) throw new Error("Save failed");

      toast({ title: "Sections detached", description: "Section references replaced with inline blocks. Reload to see changes." });
      onDone();
      window.location.reload();
    } catch {
      toast({ title: "Error", description: "Failed to detach sections.", variant: "destructive" });
    } finally {
      setDetaching(false);
    }
  };

  if (sectionRefCount === 0) return null;

  return (
    <Button
      size="sm"
      variant="outline"
      className="border-yellow-700 text-yellow-400 hover:bg-yellow-900/30"
      disabled={detaching}
      onClick={handleDetach}
      data-testid="button-detach-sections"
    >
      <Unlink className="w-4 h-4 mr-1" />
      {detaching ? "Detaching..." : `Detach (${sectionRefCount})`}
    </Button>
  );
}

function SaveDraftButton({ pageId, pageTitle, onDone }: { pageId: string; pageTitle: string; onDone: () => void }) {
  const { appState } = usePuck();
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      const contentJson = puckDataToContentJson(appState.data);
      const title = (appState.data.root as any)?.props?.title || pageTitle;
      const res = await fetch(`/api/admin/cms-v2/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentJson, title }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast({ title: "Draft saved", description: "Your changes have been saved." });
      onDone();
    } catch {
      toast({ title: "Error", description: "Failed to save draft.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      className="border-cyan-700 text-cyan-400 hover:bg-cyan-900/30"
      disabled={saving}
      data-testid="button-save-draft"
      onClick={handleSave}
    >
      <Save className="w-4 h-4 mr-1" />
      {saving ? "Saving..." : "Save Draft"}
    </Button>
  );
}

function PublishButton({ pageId, pageTitle, onDone }: { pageId: string; pageTitle: string; onDone: () => void }) {
  const { appState } = usePuck();
  const [publishing, setPublishing] = useState(false);
  const { toast } = useToast();

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const contentJson = puckDataToContentJson(appState.data);
      const title = (appState.data.root as any)?.props?.title || pageTitle;
      await fetch(`/api/admin/cms-v2/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentJson, title }),
      });
      const pubRes = await fetch(`/api/admin/cms-v2/pages/${pageId}/publish`, { method: "POST" });
      if (!pubRes.ok) throw new Error("Publish failed");
      toast({ title: "Published", description: "Page is now live." });
      onDone();
    } catch {
      toast({ title: "Error", description: "Failed to publish.", variant: "destructive" });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Button
      size="sm"
      className="bg-green-600 hover:bg-green-700 text-white"
      disabled={publishing}
      data-testid="button-publish"
      onClick={handlePublish}
    >
      <Globe className="w-4 h-4 mr-1" />
      {publishing ? "Publishing..." : "Publish"}
    </Button>
  );
}

export default function AdminCmsV2Builder() {
  const { hasFullAccess, isLoading: adminLoading } = useAdmin();
  const [, params] = useRoute("/admin/cms-v2/pages/:id/builder");
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const pageId = params?.id;
  const [puckKey, setPuckKey] = useState(0);

  const { data: page, isLoading } = useQuery<any>({
    queryKey: [`/api/admin/cms-v2/pages/${pageId}`],
    enabled: !!pageId && hasFullAccess,
  });

  const puckConfig = useMemo(() => buildPuckConfig(), []);

  const initialData = useMemo<Data | null>(() => {
    if (!page) return null;
    return contentJsonToPuckData(page.contentJson, page.title);
  }, [page, puckKey]);

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [`/api/admin/cms-v2/pages/${pageId}`] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/cms-v2/pages"] });
  }, [pageId, queryClient]);

  const handleInsertSection = useCallback(async (section: SavedSection) => {
    if (!pageId) return;
    const currentPage = queryClient.getQueryData<any>([`/api/admin/cms-v2/pages/${pageId}`]);
    const currentBlocks = currentPage?.contentJson?.blocks || [];

    const newBlock = {
      id: crypto.randomUUID(),
      type: "sectionRef",
      data: { sectionId: section.id, sectionName: section.name },
      settings: {},
    };

    const updatedContentJson = {
      version: 1,
      blocks: [...currentBlocks, newBlock],
    };

    try {
      const res = await fetch(`/api/admin/cms-v2/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentJson: updatedContentJson }),
      });
      if (!res.ok) throw new Error("Failed to insert section");
      invalidateQueries();
      setPuckKey((k) => k + 1);
    } catch {
    }
  }, [pageId, queryClient, invalidateQueries]);

  if (adminLoading || !hasFullAccess) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <AdminNav currentPage="cms-v2" />
        <div className="p-8 text-center text-gray-400">
          {adminLoading ? "Loading..." : "Access Denied"}
        </div>
      </div>
    );
  }

  if (isLoading || !initialData) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <AdminNav currentPage="cms-v2" />
        <div className="p-8 text-center text-gray-400">Loading page...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white" data-testid="admin-cms-v2-builder-page">
      <div className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
              onClick={() => navigate("/admin/cms-v2/pages")}
              data-testid="link-back-pages"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <span className="text-lg font-semibold text-white" data-testid="text-page-title">{page?.title}</span>
            <Badge variant="outline" className={
              page?.status === "published" ? "border-green-700 text-green-400" : "border-yellow-700 text-yellow-400"
            } data-testid="badge-page-status">
              {page?.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <InsertSectionButton onInsert={handleInsertSection} />
          </div>
        </div>
      </div>

      <div className="puck-builder-container" data-testid="puck-editor-container" key={puckKey}>
        <Puck
          config={puckConfig}
          data={initialData}
          overrides={{
            headerActions: ({ children }) => (
              <>
                {children}
                <DetachSectionButton pageId={pageId!} pageTitle={page?.title || ""} onDone={invalidateQueries} />
                <SaveDraftButton pageId={pageId!} pageTitle={page?.title || ""} onDone={invalidateQueries} />
                <PublishButton pageId={pageId!} pageTitle={page?.title || ""} onDone={invalidateQueries} />
              </>
            ),
          }}
        />
      </div>

      <style>{`
        .puck-builder-container {
          height: calc(100vh - 57px);
        }
        .puck-builder-container > div {
          height: 100%;
        }
      `}</style>
    </div>
  );
}
