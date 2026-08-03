import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Upload, Trash2, Download, Copy, Send, FileText, Image as ImageIcon,
  Loader2, ExternalLink, X,
} from "lucide-react";

interface PartnerAssetsManagerProps {
  partnerId: string;
  partnerEmail: string;
  partnerName: string;
}

const PartnerAssetsManager = ({ partnerId, partnerEmail, partnerName }: PartnerAssetsManagerProps) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["partner-assets", partnerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partner_assets")
        .select("*")
        .eq("partner_id", partnerId)
        .order("uploaded_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!partnerId,
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `${partnerId}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("partner-assets")
          .upload(path, file);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("partner-assets")
          .getPublicUrl(path);

        const fileType = file.type.startsWith("image/") ? "image" : "document";

        const { error: dbError } = await supabase.from("partner_assets").insert({
          partner_id: partnerId,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_type: fileType,
          file_size: file.size,
        });
        if (dbError) throw dbError;
      }
      toast.success(`${files.length} file(s) uploaded`);
      queryClient.invalidateQueries({ queryKey: ["partner-assets", partnerId] });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    if (!confirm("Delete this asset?")) return;
    // Extract storage path from URL
    const pathMatch = fileUrl.split("/partner-assets/")[1]?.split("?")[0];
    if (pathMatch) {
      await supabase.storage.from("partner-assets").remove([decodeURIComponent(pathMatch)]);
    }
    const { error } = await supabase.from("partner_assets").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Asset deleted");
    setSelectedAssets((prev) => prev.filter((a) => a !== id));
    queryClient.invalidateQueries({ queryKey: ["partner-assets", partnerId] });
  };

  const copyShareLink = (fileUrl: string) => {
    navigator.clipboard.writeText(fileUrl);
    toast.success("Link copied to clipboard!");
  };

  const toggleSelect = (id: string) => {
    setSelectedAssets((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedAssets.length === assets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(assets.map((a: any) => a.id));
    }
  };

  const sendToPartner = () => {
    const selectedFiles = assets.filter((a: any) => selectedAssets.includes(a.id));
    if (!selectedFiles.length) { toast.error("Select at least one asset"); return; }

    const links = selectedFiles.map((f: any) => `• ${f.file_name}: ${f.file_url}`).join("\n");
    const subject = encodeURIComponent(`Media Assets from Breathe & Bloom`);
    const body = encodeURIComponent(
      `Hi ${partnerName},\n\nHere are your media assets:\n\n${links}\n\nBest,\nBreathe & Bloom Team`
    );
    window.open(`mailto:${partnerEmail}?subject=${subject}&body=${body}`, "_blank");
    toast.success("Email client opened");
  };

  const copyShareableLinks = () => {
    const selectedFiles = assets.filter((a: any) => selectedAssets.includes(a.id));
    if (!selectedFiles.length) { toast.error("Select at least one asset"); return; }
    const links = selectedFiles.map((f: any) => f.file_url).join("\n");
    navigator.clipboard.writeText(links);
    toast.success(`${selectedFiles.length} link(s) copied!`);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sidebar-foreground font-medium text-sm">Media Assets</h3>
        <div className="flex items-center gap-2">
          {selectedAssets.length > 0 && (
            <>
              <button onClick={copyShareableLinks}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-sidebar-border text-[11px] text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
                <Copy className="w-3 h-3" /> Copy Links
              </button>
              <button onClick={sendToPartner}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-[11px] font-medium hover:opacity-90 transition-opacity">
                <Send className="w-3 h-3" /> Email to Partner
              </button>
            </>
          )}
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            Upload
          </button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.pptx,.xlsx"
        onChange={handleUpload} className="hidden" />

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-sidebar-foreground/30" />
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-sidebar-border rounded-lg">
          <Upload className="w-6 h-6 mx-auto mb-2 text-sidebar-foreground/20" />
          <p className="text-sidebar-foreground/30 text-xs">No assets yet — upload images or documents</p>
        </div>
      ) : (
        <>
          {assets.length > 1 && (
            <button onClick={selectAll} className="text-[11px] text-sidebar-foreground/40 hover:text-sidebar-foreground mb-2 transition-colors">
              {selectedAssets.length === assets.length ? "Deselect all" : "Select all"}
            </button>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {assets.map((asset: any) => {
              const isImage = asset.file_type === "image";
              const isSelected = selectedAssets.includes(asset.id);
              return (
                <div key={asset.id}
                  className={`relative group rounded-lg border overflow-hidden transition-all cursor-pointer ${
                    isSelected ? "border-sidebar-ring ring-2 ring-sidebar-ring/30" : "border-sidebar-border hover:border-sidebar-foreground/30"
                  }`}
                  onClick={() => toggleSelect(asset.id)}
                >
                  {/* Preview */}
                  <div className="aspect-square bg-sidebar-accent flex items-center justify-center overflow-hidden">
                    {isImage ? (
                      <img src={asset.file_url} alt={asset.file_name} className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-8 h-8 text-sidebar-foreground/20" />
                    )}
                  </div>
                  {/* Selection checkbox */}
                  <div className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    isSelected ? "bg-sidebar-primary border-sidebar-primary" : "border-white/60 bg-black/20"
                  }`}>
                    {isSelected && <span className="text-sidebar-primary-foreground text-[10px] font-bold">✓</span>}
                  </div>
                  {/* Actions overlay */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); copyShareLink(asset.file_url); }}
                      className="p-1.5 rounded-md bg-black/40 text-white hover:bg-black/60 transition-colors" title="Copy link">
                      <Copy className="w-3 h-3" />
                    </button>
                    <a href={asset.file_url} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-md bg-black/40 text-white hover:bg-black/60 transition-colors" title="Open">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(asset.id, asset.file_url); }}
                      className="p-1.5 rounded-md bg-red-500/60 text-white hover:bg-red-500/80 transition-colors" title="Delete">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  {/* Info */}
                  <div className="p-2">
                    <p className="text-sidebar-foreground text-[11px] font-medium truncate">{asset.file_name}</p>
                    <p className="text-sidebar-foreground/30 text-[10px]">{formatSize(asset.file_size || 0)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default PartnerAssetsManager;
