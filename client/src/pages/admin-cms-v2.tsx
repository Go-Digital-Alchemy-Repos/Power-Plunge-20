import { useAdmin } from "@/hooks/use-admin";
import AdminNav from "@/components/admin/AdminNav";
import { LayoutGrid, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminCmsV2() {
  const { hasFullAccess, isLoading: adminLoading } = useAdmin();

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
    <div className="min-h-screen bg-gray-950 text-white" data-testid="admin-cms-v2-page">
      <AdminNav currentPage="cms-v2" />

      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center gap-3 mb-6">
          <LayoutGrid className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              CMS v2
              <Badge variant="outline" className="border-cyan-700 text-cyan-400 text-xs" data-testid="badge-preview">Preview</Badge>
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">Next-generation content management system</p>
          </div>
        </div>

        <Card className="bg-gray-900 border-gray-800" data-testid="card-cms-v2-status">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-gray-300" data-testid="text-cms-v2-message">
                  CMS v2 Preview — legacy CMS remains active.
                </p>
                <p className="text-gray-500 text-sm">
                  This is a preview of the upcoming CMS v2 system. All existing CMS features continue to function normally. To disable this preview, set the <code className="bg-gray-800 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono">CMS_V2_ENABLED</code> environment variable to <code className="bg-gray-800 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono">false</code>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
