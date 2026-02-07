import { useState } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import CmsV2Layout from "@/components/admin/CmsV2Layout";
import { PenLine, Plus, Globe, GlobeLock, MoreHorizontal, Pencil, Trash2, Eye, Search } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminCmsV2Posts() {
  const { hasFullAccess, isLoading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formFeaturedImage, setFormFeaturedImage] = useState("");
  const [formAuthorName, setFormAuthorName] = useState("");
  const [formMetaTitle, setFormMetaTitle] = useState("");
  const [formMetaDescription, setFormMetaDescription] = useState("");

  const { data: posts = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/cms-v2/posts"],
    queryFn: () => apiRequest("GET", "/api/admin/cms-v2/posts").then((r) => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/cms-v2/posts", data).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms-v2/posts"] });
      toast({ title: "Post created" });
      resetForm();
      setShowCreate(false);
    },
    onError: () => toast({ title: "Failed to create post", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest("PUT", `/api/admin/cms-v2/posts/${id}`, data).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms-v2/posts"] });
      toast({ title: "Post updated" });
      resetForm();
      setEditingPost(null);
    },
    onError: () => toast({ title: "Failed to update post", variant: "destructive" }),
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/admin/cms-v2/posts/${id}/publish`).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms-v2/posts"] });
      toast({ title: "Post published" });
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/admin/cms-v2/posts/${id}/unpublish`).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms-v2/posts"] });
      toast({ title: "Post unpublished" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/cms-v2/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms-v2/posts"] });
      toast({ title: "Post deleted" });
    },
  });

  function resetForm() {
    setFormTitle("");
    setFormSlug("");
    setFormBody("");
    setFormExcerpt("");
    setFormCategory("");
    setFormTags("");
    setFormFeaturedImage("");
    setFormAuthorName("");
    setFormMetaTitle("");
    setFormMetaDescription("");
  }

  function openEdit(post: any) {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormSlug(post.slug);
    setFormBody(post.body || "");
    setFormExcerpt(post.excerpt || "");
    setFormCategory(post.category || "");
    setFormTags((post.tags || []).join(", "));
    setFormFeaturedImage(post.featuredImage || "");
    setFormAuthorName(post.authorName || "");
    setFormMetaTitle(post.metaTitle || "");
    setFormMetaDescription(post.metaDescription || "");
  }

  function handleSave() {
    const data: any = {
      title: formTitle,
      slug: formSlug || slugify(formTitle),
      body: formBody,
      excerpt: formExcerpt || null,
      category: formCategory || null,
      tags: formTags ? formTags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
      featuredImage: formFeaturedImage || null,
      authorName: formAuthorName || null,
      metaTitle: formMetaTitle || null,
      metaDescription: formMetaDescription || null,
    };

    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data });
    } else {
      createMutation.mutate(data);
    }
  }

  const filteredPosts = posts.filter(
    (p: any) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (adminLoading || isLoading) {
    return (
      <CmsV2Layout activeNav="posts" breadcrumbs={[{ label: "Posts" }]}>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
        </div>
      </CmsV2Layout>
    );
  }

  if (!hasFullAccess) {
    return (
      <CmsV2Layout activeNav="posts" breadcrumbs={[{ label: "Posts" }]}>
        <div className="text-center py-20 text-gray-400" data-testid="text-access-denied">Access Denied</div>
      </CmsV2Layout>
    );
  }

  const isFormOpen = showCreate || !!editingPost;

  return (
    <CmsV2Layout activeNav="posts" breadcrumbs={[{ label: "Posts" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-posts-title">Posts</h1>
            <p className="text-sm text-gray-400 mt-1">Manage blog posts and articles</p>
          </div>
          <Button
            onClick={() => { resetForm(); setShowCreate(true); }}
            className="bg-cyan-600 hover:bg-cyan-700 gap-2"
            data-testid="button-create-post"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search posts..."
            className="pl-10 bg-gray-900/60 border-gray-700 text-white"
            data-testid="input-search-posts"
          />
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 text-gray-500" data-testid="text-no-posts">
            <PenLine className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No posts yet. Create your first blog post.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredPosts.map((post: any) => (
              <Card key={post.id} className="bg-gray-900/60 border-gray-800" data-testid={`card-post-${post.id}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt=""
                      className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white truncate" data-testid={`text-post-title-${post.id}`}>
                        {post.title}
                      </h3>
                      <Badge
                        variant={post.status === "published" ? "default" : "secondary"}
                        className={post.status === "published" ? "bg-green-900/40 text-green-400 border-green-800" : "bg-gray-800 text-gray-400"}
                        data-testid={`badge-post-status-${post.id}`}
                      >
                        {post.status === "published" ? (
                          <><Globe className="w-3 h-3 mr-1" />Published</>
                        ) : (
                          <><GlobeLock className="w-3 h-3 mr-1" />Draft</>
                        )}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      /{post.slug}
                      {post.category && <> &middot; {post.category}</>}
                      {post.authorName && <> &middot; by {post.authorName}</>}
                    </p>
                    {post.excerpt && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">{post.excerpt}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-600">{formatDate(post.createdAt)}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-white" data-testid={`button-post-menu-${post.id}`}>
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700 text-white">
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 gap-2"
                          onClick={() => openEdit(post)}
                          data-testid={`button-edit-post-${post.id}`}
                        >
                          <Pencil className="w-4 h-4" />Edit
                        </DropdownMenuItem>
                        {post.status === "draft" ? (
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 gap-2"
                            onClick={() => publishMutation.mutate(post.id)}
                            data-testid={`button-publish-post-${post.id}`}
                          >
                            <Globe className="w-4 h-4" />Publish
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 gap-2"
                            onClick={() => unpublishMutation.mutate(post.id)}
                            data-testid={`button-unpublish-post-${post.id}`}
                          >
                            <GlobeLock className="w-4 h-4" />Unpublish
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-red-900/30 focus:bg-red-900/30 gap-2 text-red-400"
                          onClick={() => {
                            if (window.confirm("Delete this post?")) {
                              deleteMutation.mutate(post.id);
                            }
                          }}
                          data-testid={`button-delete-post-${post.id}`}
                        >
                          <Trash2 className="w-4 h-4" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={(open) => { if (!open) { setShowCreate(false); setEditingPost(null); resetForm(); } }}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle data-testid="text-post-dialog-title">{editingPost ? "Edit Post" : "New Post"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingPost ? "Update this blog post." : "Create a new blog post. It will start as a draft."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-gray-300">Title *</Label>
              <Input
                value={formTitle}
                onChange={(e) => {
                  setFormTitle(e.target.value);
                  if (!editingPost) setFormSlug(slugify(e.target.value));
                }}
                placeholder="My Blog Post"
                className="bg-gray-800 border-gray-700 text-white mt-1"
                data-testid="input-post-title"
              />
            </div>
            <div>
              <Label className="text-gray-300">Slug *</Label>
              <Input
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="my-blog-post"
                className="bg-gray-800 border-gray-700 text-white mt-1"
                data-testid="input-post-slug"
              />
            </div>
            <div>
              <Label className="text-gray-300">Body (Markdown / HTML)</Label>
              <Textarea
                value={formBody}
                onChange={(e) => setFormBody(e.target.value)}
                placeholder="Write your post content here..."
                className="bg-gray-800 border-gray-700 text-white mt-1 min-h-[200px] font-mono text-sm"
                data-testid="input-post-body"
              />
            </div>
            <div>
              <Label className="text-gray-300">Excerpt</Label>
              <Textarea
                value={formExcerpt}
                onChange={(e) => setFormExcerpt(e.target.value)}
                placeholder="Short description for previews..."
                className="bg-gray-800 border-gray-700 text-white mt-1 min-h-[60px]"
                data-testid="input-post-excerpt"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Category</Label>
                <Input
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g. News, Guides"
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  data-testid="input-post-category"
                />
              </div>
              <div>
                <Label className="text-gray-300">Tags (comma-separated)</Label>
                <Input
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="health, wellness, cold plunge"
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  data-testid="input-post-tags"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Author Name</Label>
                <Input
                  value={formAuthorName}
                  onChange={(e) => setFormAuthorName(e.target.value)}
                  placeholder="Author name"
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  data-testid="input-post-author"
                />
              </div>
              <div>
                <Label className="text-gray-300">Featured Image URL</Label>
                <Input
                  value={formFeaturedImage}
                  onChange={(e) => setFormFeaturedImage(e.target.value)}
                  placeholder="https://..."
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  data-testid="input-post-featured-image"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Meta Title</Label>
                <Input
                  value={formMetaTitle}
                  onChange={(e) => setFormMetaTitle(e.target.value)}
                  placeholder="SEO title"
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  data-testid="input-post-meta-title"
                />
              </div>
              <div>
                <Label className="text-gray-300">Meta Description</Label>
                <Input
                  value={formMetaDescription}
                  onChange={(e) => setFormMetaDescription(e.target.value)}
                  placeholder="SEO description"
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  data-testid="input-post-meta-description"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setShowCreate(false); setEditingPost(null); resetForm(); }} data-testid="button-cancel-post">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formTitle || createMutation.isPending || updateMutation.isPending}
              className="bg-cyan-600 hover:bg-cyan-700"
              data-testid="button-save-post"
            >
              {(createMutation.isPending || updateMutation.isPending) ? "Saving..." : editingPost ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CmsV2Layout>
  );
}
