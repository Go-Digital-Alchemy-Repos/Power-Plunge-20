import { useState } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import CmsV2Layout from "@/components/admin/CmsV2Layout";
import { Menu, Plus, Trash2, Pencil, GripVertical, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

interface MenuItemForm {
  id: string;
  label: string;
  url: string;
  target: "_self" | "_blank";
  order: number;
}

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function AdminCmsV2Menus() {
  const { hasFullAccess, isLoading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editingMenu, setEditingMenu] = useState<any>(null);

  const [formName, setFormName] = useState("");
  const [formLocation, setFormLocation] = useState("header");
  const [formActive, setFormActive] = useState(true);
  const [formItems, setFormItems] = useState<MenuItemForm[]>([]);

  const { data: menus = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/cms-v2/menus"],
    queryFn: () => apiRequest("GET", "/api/admin/cms-v2/menus").then((r) => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/cms-v2/menus", data).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms-v2/menus"] });
      toast({ title: "Menu created" });
      resetForm();
      setShowCreate(false);
    },
    onError: () => toast({ title: "Failed to create menu", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest("PUT", `/api/admin/cms-v2/menus/${id}`, data).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms-v2/menus"] });
      toast({ title: "Menu updated" });
      resetForm();
      setEditingMenu(null);
    },
    onError: () => toast({ title: "Failed to update menu", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/cms-v2/menus/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms-v2/menus"] });
      toast({ title: "Menu deleted" });
    },
  });

  function resetForm() {
    setFormName("");
    setFormLocation("header");
    setFormActive(true);
    setFormItems([]);
  }

  function openEdit(menu: any) {
    setEditingMenu(menu);
    setFormName(menu.name);
    setFormLocation(menu.location);
    setFormActive(menu.active);
    setFormItems(
      (menu.items || []).map((item: any, i: number) => ({
        id: item.id || generateId(),
        label: item.label || "",
        url: item.url || "",
        target: item.target || "_self",
        order: item.order ?? i,
      }))
    );
  }

  function addItem() {
    setFormItems([
      ...formItems,
      { id: generateId(), label: "", url: "/", target: "_self", order: formItems.length },
    ]);
  }

  function updateItem(index: number, field: string, value: string) {
    const updated = [...formItems];
    (updated[index] as any)[field] = value;
    setFormItems(updated);
  }

  function removeItem(index: number) {
    setFormItems(formItems.filter((_, i) => i !== index));
  }

  function handleSave() {
    const data: any = {
      name: formName,
      location: formLocation,
      active: formActive,
      items: formItems.map((item, i) => ({
        id: item.id,
        label: item.label,
        url: item.url,
        target: item.target,
        order: i,
        children: [],
      })),
    };

    if (editingMenu) {
      updateMutation.mutate({ id: editingMenu.id, data });
    } else {
      createMutation.mutate(data);
    }
  }

  const locationLabels: Record<string, string> = {
    header: "Header",
    footer: "Footer",
    sidebar: "Sidebar",
  };

  if (adminLoading || isLoading) {
    return (
      <CmsV2Layout activeNav="menus" breadcrumbs={[{ label: "Menus" }]}>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
        </div>
      </CmsV2Layout>
    );
  }

  if (!hasFullAccess) {
    return (
      <CmsV2Layout activeNav="menus" breadcrumbs={[{ label: "Menus" }]}>
        <div className="text-center py-20 text-gray-400" data-testid="text-access-denied">Access Denied</div>
      </CmsV2Layout>
    );
  }

  const isFormOpen = showCreate || !!editingMenu;

  return (
    <CmsV2Layout activeNav="menus" breadcrumbs={[{ label: "Menus" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-menus-title">Menus</h1>
            <p className="text-sm text-gray-400 mt-1">Manage navigation menus for header, footer, and sidebar</p>
          </div>
          <Button
            onClick={() => { resetForm(); setShowCreate(true); }}
            className="bg-cyan-600 hover:bg-cyan-700 gap-2"
            data-testid="button-create-menu"
          >
            <Plus className="w-4 h-4" />
            New Menu
          </Button>
        </div>

        {menus.length === 0 ? (
          <div className="text-center py-16 text-gray-500" data-testid="text-no-menus">
            <Menu className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No menus yet. Create a navigation menu.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {menus.map((menu: any) => (
              <Card key={menu.id} className="bg-gray-900/60 border-gray-800" data-testid={`card-menu-${menu.id}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-white" data-testid={`text-menu-name-${menu.id}`}>
                      {menu.name}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <Badge
                        variant="secondary"
                        className="bg-gray-800 text-gray-300 text-xs"
                        data-testid={`badge-menu-location-${menu.id}`}
                      >
                        {locationLabels[menu.location] || menu.location}
                      </Badge>
                      {!menu.active && (
                        <Badge variant="secondary" className="bg-yellow-900/30 text-yellow-400 text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-gray-500 mb-3">
                    {(menu.items || []).length} item{(menu.items || []).length !== 1 ? "s" : ""}
                  </div>
                  {(menu.items || []).length > 0 && (
                    <div className="space-y-1 mb-3">
                      {(menu.items as any[]).slice(0, 5).map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                          <GripVertical className="w-3 h-3 text-gray-600" />
                          <span className="truncate">{item.label}</span>
                          {item.target === "_blank" && <ExternalLink className="w-3 h-3 text-gray-600 flex-shrink-0" />}
                        </div>
                      ))}
                      {(menu.items as any[]).length > 5 && (
                        <span className="text-xs text-gray-600">+{(menu.items as any[]).length - 5} more</span>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(menu)}
                      className="text-gray-400 hover:text-white gap-1 h-7 text-xs"
                      data-testid={`button-edit-menu-${menu.id}`}
                    >
                      <Pencil className="w-3 h-3" />Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (window.confirm("Delete this menu?")) {
                          deleteMutation.mutate(menu.id);
                        }
                      }}
                      className="text-red-400 hover:text-red-300 gap-1 h-7 text-xs"
                      data-testid={`button-delete-menu-${menu.id}`}
                    >
                      <Trash2 className="w-3 h-3" />Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={(open) => { if (!open) { setShowCreate(false); setEditingMenu(null); resetForm(); } }}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle data-testid="text-menu-dialog-title">{editingMenu ? "Edit Menu" : "New Menu"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingMenu ? "Update this navigation menu." : "Create a new navigation menu."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-gray-300">Name *</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Main Navigation"
                className="bg-gray-800 border-gray-700 text-white mt-1"
                data-testid="input-menu-name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Location</Label>
                <Select value={formLocation} onValueChange={setFormLocation}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1" data-testid="select-menu-location">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="header">Header</SelectItem>
                    <SelectItem value="footer">Footer</SelectItem>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2 pb-1">
                <Switch
                  checked={formActive}
                  onCheckedChange={setFormActive}
                  data-testid="switch-menu-active"
                />
                <Label className="text-gray-300 text-sm">{formActive ? "Active" : "Inactive"}</Label>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-gray-300">Menu Items</Label>
                <Button variant="ghost" size="sm" onClick={addItem} className="text-cyan-400 hover:text-cyan-300 h-7 text-xs gap-1" data-testid="button-add-menu-item">
                  <Plus className="w-3 h-3" />Add Item
                </Button>
              </div>
              {formItems.length === 0 ? (
                <p className="text-xs text-gray-600 py-4 text-center">No items. Click "Add Item" to start.</p>
              ) : (
                <div className="space-y-2">
                  {formItems.map((item, i) => (
                    <div key={item.id} className="flex items-center gap-2 bg-gray-800/60 rounded-md p-2" data-testid={`menu-item-row-${i}`}>
                      <GripVertical className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      <Input
                        value={item.label}
                        onChange={(e) => updateItem(i, "label", e.target.value)}
                        placeholder="Label"
                        className="bg-gray-700/60 border-gray-600 text-white text-xs h-8 flex-1"
                        data-testid={`input-menu-item-label-${i}`}
                      />
                      <Input
                        value={item.url}
                        onChange={(e) => updateItem(i, "url", e.target.value)}
                        placeholder="/path"
                        className="bg-gray-700/60 border-gray-600 text-white text-xs h-8 flex-1"
                        data-testid={`input-menu-item-url-${i}`}
                      />
                      <Select value={item.target} onValueChange={(v) => updateItem(i, "target", v)}>
                        <SelectTrigger className="bg-gray-700/60 border-gray-600 text-white text-xs h-8 w-24" data-testid={`select-menu-item-target-${i}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="_self">Same tab</SelectItem>
                          <SelectItem value="_blank">New tab</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(i)}
                        className="text-red-400 hover:text-red-300 h-8 w-8 p-0"
                        data-testid={`button-remove-menu-item-${i}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setShowCreate(false); setEditingMenu(null); resetForm(); }} data-testid="button-cancel-menu">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formName || createMutation.isPending || updateMutation.isPending}
              className="bg-cyan-600 hover:bg-cyan-700"
              data-testid="button-save-menu"
            >
              {(createMutation.isPending || updateMutation.isPending) ? "Saving..." : editingMenu ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CmsV2Layout>
  );
}
