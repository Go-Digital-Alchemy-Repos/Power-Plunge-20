import { useState } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AdminNav from "@/components/admin/AdminNav";
import { Layers, ArrowLeft, Plus, Pencil, Trash2, MoreHorizontal, Copy, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SavedSection {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  blocks: any;
  createdAt: string;
  updatedAt: string;
}

const SECTION_CATEGORIES = [
  { value: "general", label: "General" },
  { value: "hero", label: "Hero" },
  { value: "content", label: "Content" },
  { value: "product", label: "Product" },
  { value: "testimonial", label: "Testimonial" },
  { value: "cta", label: "Call to Action" },
];

function getCategoryLabel(cat: string | null) {
  return SECTION_CATEGORIES.find((c) => c.value === cat)?.label ?? cat ?? "General";
}

function getBlockCount(blocks: any): number {
  if (Array.isArray(blocks)) return blocks.length;
  return 0;
}

export default function AdminCmsV2Sections() {
  const { hasFullAccess, isLoading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [createOpen, setCreateOpen] = useState(false);
  const [editSection, setEditSection] = useState<SavedSection | null>(null);
  const [deleteSection, setDeleteSection] = useState<SavedSection | null>(null);

  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("general");

  const { data: sections, isLoading } = useQuery<SavedSection[]>({
    queryKey: ["/api/admin/cms-v2/sections"],
    enabled: hasFullAccess,
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; category: string }) => {
      const res = await apiRequest("POST", "/api/admin/cms-v2/sections", {
        name: data.name,
        description: data.description || null,
        category: data.category,
        blocks: [],
      });
      return res.json();
    },
    onSuccess: (section) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms-v2/sections"] });
      toast({ title: "Section created", description: `"${section.name}" is ready to use.` });
      setCreateOpen(false);
      resetForm();
    },
    onError: (err: Error) => {
      toast({ title: "Failed to create section", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string; description: string; category: string } }) => {
      const res = await apiRequest("PUT", `/api/admin/cms-v2/sections/${id}`, {
        name: data.name,
        description: data.description || null,
        category: data.category,
      });
      return res.json();
    },
    onSuccess: (section) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms-v2/sections"] });
      toast({ title: "Section updated", description: `"${section.name}" has been updated.` });
      setEditSection(null);
      resetForm();
    },
    onError: (err: Error) => {
      toast({ title: "Failed to update section", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/cms-v2/sections/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms-v2/sections"] });
      toast({ title: "Section deleted" });
      setDeleteSection(null);
    },
    onError: (err: Error) => {
      toast({ title: "Failed to delete section", description: err.message, variant: "destructive" });
    },
  });

  function resetForm() {
    setFormName("");
    setFormDescription("");
    setFormCategory("general");
  }

  function openCreate() {
    resetForm();
    setCreateOpen(true);
  }

  function openEdit(section: SavedSection) {
    setFormName(section.name);
    setFormDescription(section.description ?? "");
    setFormCategory(section.category ?? "general");
    setEditSection(section);
  }

  function handleCreate() {
    if (!formName.trim()) return;
    createMutation.mutate({ name: formName.trim(), description: formDescription.trim(), category: formCategory });
  }

  function handleUpdate() {
    if (!editSection || !formName.trim()) return;
    updateMutation.mutate({ id: editSection.id, data: { name: formName.trim(), description: formDescription.trim(), category: formCategory } });
  }

  function copyId(id: string) {
    navigator.clipboard.writeText(id);
    toast({ title: "Section ID copied", description: "You can reference this section in the page builder." });
  }

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

  return (
    <div className="min-h-screen bg-gray-950 text-white" data-testid="admin-cms-v2-sections-page">
      <AdminNav currentPage="cms-v2" />

      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/cms-v2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" data-testid="link-back-dashboard">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Layers className="w-7 h-7 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white">Sections</h1>
            {!isLoading && sections && (
              <Badge variant="outline" className="border-gray-700 text-gray-400 text-xs">
                {sections.length} total
              </Badge>
            )}
          </div>
          <Button
            onClick={openCreate}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
            data-testid="button-create-section"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Section
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-gray-900 border-gray-800 animate-pulse">
                <CardContent className="p-4 h-16" />
              </Card>
            ))}
          </div>
        ) : !sections || sections.length === 0 ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-12 text-center">
              <Layers className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400 mb-2">No saved sections yet.</p>
              <p className="text-gray-500 text-sm mb-4">Create reusable sections to insert across multiple pages.</p>
              <Button
                onClick={openCreate}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
                data-testid="button-create-first-section"
              >
                <Plus className="w-4 h-4 mr-1" />
                Create First Section
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section) => (
              <Card key={section.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors" data-testid={`card-section-${section.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-white truncate" data-testid={`text-section-name-${section.id}`}>
                        {section.name}
                      </h3>
                      {section.description && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{section.description}</p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-400 hover:text-white h-8 w-8 p-0 flex-shrink-0"
                          data-testid={`button-actions-${section.id}`}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700 text-white">
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800"
                          onClick={() => openEdit(section)}
                          data-testid={`action-edit-${section.id}`}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800"
                          onClick={() => copyId(section.id)}
                          data-testid={`action-copy-id-${section.id}`}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem
                          className="cursor-pointer text-red-400 hover:bg-gray-800 focus:bg-gray-800 focus:text-red-400"
                          onClick={() => setDeleteSection(section)}
                          data-testid={`action-delete-${section.id}`}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="border-gray-700 text-gray-400 text-xs">
                      {getCategoryLabel(section.category)}
                    </Badge>
                    <Badge variant="outline" className="border-gray-700 text-gray-500 text-xs">
                      <FileText className="w-3 h-3 mr-1" />
                      {getBlockCount(section.blocks)} blocks
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white" data-testid="dialog-create-section">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Section</DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a reusable section that can be inserted into any page via the builder.
            </DialogDescription>
          </DialogHeader>
          <SectionForm
            name={formName}
            description={formDescription}
            category={formCategory}
            onNameChange={setFormName}
            onDescriptionChange={setFormDescription}
            onCategoryChange={setFormCategory}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateOpen(false)} className="text-gray-400 hover:text-white" data-testid="button-cancel-create">
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!formName.trim() || createMutation.isPending}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
              data-testid="button-confirm-create"
            >
              {createMutation.isPending ? "Creating..." : "Create Section"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editSection} onOpenChange={() => setEditSection(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white" data-testid="dialog-edit-section">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Section</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update the section name, description, or category.
            </DialogDescription>
          </DialogHeader>
          <SectionForm
            name={formName}
            description={formDescription}
            category={formCategory}
            onNameChange={setFormName}
            onDescriptionChange={setFormDescription}
            onCategoryChange={setFormCategory}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditSection(null)} className="text-gray-400 hover:text-white" data-testid="button-cancel-edit">
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={!formName.trim() || updateMutation.isPending}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
              data-testid="button-confirm-edit"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteSection} onOpenChange={() => setDeleteSection(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white" data-testid="dialog-delete-section">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Section</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete "{deleteSection?.name}"? Pages using this section will show a missing section warning.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteSection(null)} className="text-gray-400 hover:text-white" data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteSection && deleteMutation.mutate(deleteSection.id)}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Section"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SectionForm({
  name, description, category,
  onNameChange, onDescriptionChange, onCategoryChange,
}: {
  name: string;
  description: string;
  category: string;
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
}) {
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="section-name" className="text-gray-300">Name</Label>
        <Input
          id="section-name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g., Hero with CTA"
          className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
          data-testid="input-section-name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="section-description" className="text-gray-300">Description</Label>
        <Textarea
          id="section-description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Optional description of this section"
          rows={2}
          className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
          data-testid="input-section-description"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Category</Label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white" data-testid="select-section-category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600 text-white">
            {SECTION_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
