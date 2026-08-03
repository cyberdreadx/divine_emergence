import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Search, Plus, Pencil, Trash2, FileText, Package, Image, Flag,
  BarChart3, Camera, Eye, Heart, MessageSquare, ChevronDown, ChevronRight,
  Download, CheckCircle2, Clock, AlertCircle, Share2, FileDown, Send, Copy,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminModal from "@/components/admin/AdminModal";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { generateRecapPDF } from "@/lib/generateRecapPDF";

const ASSET_TYPES = [
  { value: "samples", label: "Product Samples", icon: Package },
  { value: "logo", label: "Logo / Branding", icon: Image },
  { value: "display", label: "Display / Signage", icon: Flag },
  { value: "social_content", label: "Social Content", icon: Camera },
  { value: "other", label: "Other", icon: FileText },
];

const STATUS_CONFIG: Record<string, { color: string; icon: typeof CheckCircle2 }> = {
  approved: { color: "bg-green-500/20 text-green-400", icon: CheckCircle2 },
  submitted: { color: "bg-blue-500/20 text-blue-400", icon: CheckCircle2 },
  pending: { color: "bg-yellow-500/20 text-yellow-400", icon: Clock },
  in_progress: { color: "bg-cyan-500/20 text-cyan-400", icon: Clock },
  revision_needed: { color: "bg-orange-500/20 text-orange-400", icon: AlertCircle },
};

const AdminDeliverables = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"partners" | "list">("partners");
  const [formModal, setFormModal] = useState<{ open: boolean; deliverable?: any; partnerId?: string }>({ open: false });
  const [recapModal, setRecapModal] = useState<{ open: boolean; recap?: any; partnerId?: string; eventId?: string }>({ open: false });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string }>({ open: false, id: "" });
  const [expandedPartners, setExpandedPartners] = useState<Set<string>>(new Set());

  const { data: deliverables = [] } = useQuery({
    queryKey: ["admin-deliverables"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deliverables")
        .select("*, partners(company_name)")
        .order("due_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: partners = [] } = useQuery({
    queryKey: ["admin-partners"],
    queryFn: async () => {
      const { data, error } = await supabase.from("partners").select("*").order("company_name");
      if (error) throw error;
      return data;
    },
  });

  const { data: events = [] } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("id, name").order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: recaps = [] } = useQuery({
    queryKey: ["admin-partner-recaps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partner_recaps")
        .select("*, partners(company_name), events(name)");
      if (error) throw error;
      return data;
    },
  });

  const togglePartner = (id: string) => {
    setExpandedPartners((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = deliverables.filter((d: any) =>
    `${d.title} ${d.partners?.company_name} ${d.asset_type}`.toLowerCase().includes(search.toLowerCase())
  );

  // Group deliverables by partner
  const byPartner = partners.map((p) => ({
    ...p,
    deliverables: filtered.filter((d: any) => d.partner_id === p.id),
    recaps: recaps.filter((r: any) => r.partner_id === p.id),
  })).filter((p) => !search || p.deliverables.length > 0 || p.company_name.toLowerCase().includes(search.toLowerCase()));

  const getAssetIcon = (type: string) => {
    const found = ASSET_TYPES.find((a) => a.value === type);
    return found ? found.icon : FileText;
  };

  const statusBadge = (status: string) => {
    const cfg = STATUS_CONFIG[status] || { color: "bg-sidebar-accent text-sidebar-foreground", icon: Clock };
    const Icon = cfg.icon;
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full capitalize inline-flex items-center gap-1 ${cfg.color}`}>
        <Icon className="w-3 h-3" />
        {(status || "").replace("_", " ")}
      </span>
    );
  };

  const stats = {
    total: deliverables.length,
    pending: deliverables.filter((d: any) => d.status === "pending").length,
    approved: deliverables.filter((d: any) => d.status === "approved").length,
    overdue: deliverables.filter((d: any) => d.due_date && new Date(d.due_date) < new Date() && d.status !== "approved").length,
  };

  const exportCSV = () => {
    if (!filtered.length) return;
    const headers = ["title", "asset_type", "partner", "due_date", "status", "description"];
    const csv = [
      headers.join(","),
      ...filtered.map((d: any) =>
        [d.title, d.asset_type, d.partners?.company_name || "", d.due_date || "", d.status, d.description || ""]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `deliverables-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Exported!");
  };

  return (
    <AdminLayout
      title="Deliverables Tracker"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRecapModal({ open: true })}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-sidebar-border text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
          >
            <BarChart3 className="w-4 h-4" /> Add Recap
          </button>
          <button
            onClick={() => setFormModal({ open: true })}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Add Deliverable
          </button>
        </div>
      }
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Assets", value: stats.total, color: "text-sidebar-foreground" },
          { label: "Pending", value: stats.pending, color: "text-yellow-400" },
          { label: "Approved", value: stats.approved, color: "text-green-400" },
          { label: "Overdue", value: stats.overdue, color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-sidebar-border p-4">
            <p className="text-sidebar-foreground/40 text-xs">{s.label}</p>
            <p className={`text-2xl font-serif mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search + View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sidebar-foreground/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deliverables..."
            className="pl-9 pr-4 py-2 rounded-lg bg-sidebar-accent border border-sidebar-border text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/30 focus:outline-none focus:ring-2 focus:ring-sidebar-ring/50 w-64"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg overflow-hidden border border-sidebar-border">
            {(["partners", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 text-xs font-medium capitalize transition-colors ${
                  view === v ? "bg-sidebar-accent text-sidebar-foreground" : "text-sidebar-foreground/40 hover:text-sidebar-foreground/70"
                }`}
              >
                {v === "partners" ? "By Partner" : "All Items"}
              </button>
            ))}
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-sidebar-border text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Partner Card View */}
      {view === "partners" && (
        <div className="space-y-4">
          {byPartner.map((partner) => {
            const expanded = expandedPartners.has(partner.id);
            const completedCount = partner.deliverables.filter((d: any) => d.status === "approved").length;
            const totalCount = partner.deliverables.length;
            const progress = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
            const partnerRecaps = partner.recaps as any[];

            return (
              <div key={partner.id} className="rounded-xl border border-sidebar-border overflow-hidden">
                {/* Partner Header */}
                <button
                  onClick={() => togglePartner(partner.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-sidebar-accent/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground font-serif text-sm">
                      {partner.company_name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="text-sidebar-foreground font-medium">{partner.company_name}</p>
                      <p className="text-sidebar-foreground/40 text-xs capitalize">{(partner.tier || "").replace(/_/g, " ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {/* Progress bar */}
                    <div className="hidden sm:flex items-center gap-3">
                      <div className="w-32 h-1.5 rounded-full bg-sidebar-accent overflow-hidden">
                        <div
                          className="h-full rounded-full bg-green-500 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-sidebar-foreground/40 text-xs w-16">
                        {completedCount}/{totalCount}
                      </span>
                    </div>
                    {expanded ? <ChevronDown className="w-4 h-4 text-sidebar-foreground/40" /> : <ChevronRight className="w-4 h-4 text-sidebar-foreground/40" />}
                  </div>
                </button>

                {/* Expanded Content */}
                {expanded && (
                  <div className="border-t border-sidebar-border">
                    {/* Deliverables */}
                    <div className="px-5 py-3 border-b border-sidebar-border/50">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sidebar-foreground/60 text-xs font-medium uppercase tracking-wider">Required Assets</p>
                        <button
                          onClick={() => setFormModal({ open: true, partnerId: partner.id })}
                          className="text-xs text-sidebar-ring hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add
                        </button>
                      </div>
                      {partner.deliverables.length === 0 ? (
                        <p className="text-sidebar-foreground/20 text-sm py-4 text-center">No deliverables assigned</p>
                      ) : (
                        <div className="space-y-2">
                          {partner.deliverables.map((d: any) => {
                            const AssetIcon = getAssetIcon(d.asset_type);
                            return (
                              <div
                                key={d.id}
                                className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-sidebar-accent/20 transition-colors group"
                              >
                                <div className="flex items-center gap-3">
                                  <AssetIcon className="w-4 h-4 text-sidebar-foreground/40" />
                                  <div>
                                    <p className="text-sidebar-foreground text-sm">{d.title}</p>
                                    <p className="text-sidebar-foreground/30 text-xs">
                                      {ASSET_TYPES.find((a) => a.value === d.asset_type)?.label || d.asset_type}
                                      {d.due_date && ` · Due ${new Date(d.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {statusBadge(d.status)}
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => setFormModal({ open: true, deliverable: d })}
                                      className="p-1 rounded hover:bg-sidebar-accent text-sidebar-foreground/40 hover:text-sidebar-foreground"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => setDeleteModal({ open: true, id: d.id })}
                                      className="p-1 rounded hover:bg-red-500/10 text-sidebar-foreground/40 hover:text-red-400"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Recap Metrics */}
                    <div className="px-5 py-3">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sidebar-foreground/60 text-xs font-medium uppercase tracking-wider">Post-Event Recap</p>
                        <button
                          onClick={() => setRecapModal({ open: true, partnerId: partner.id })}
                          className="text-xs text-sidebar-ring hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Recap
                        </button>
                      </div>
                      {partnerRecaps.length === 0 ? (
                        <p className="text-sidebar-foreground/20 text-sm py-3 text-center">No recaps yet</p>
                      ) : (
                        <div className="space-y-3">
                          {partnerRecaps.map((r: any) => (
                            <div key={r.id} className="rounded-lg bg-sidebar-accent/30 p-3">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sidebar-foreground text-xs font-medium">{r.events?.name || "Event"}</p>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      const { data: partnerAssets } = await supabase
                                        .from("partner_assets")
                                        .select("*")
                                        .eq("partner_id", r.partner_id);
                                      generateRecapPDF(r, partnerAssets || [], window.location.origin);
                                      toast.success("PDF downloaded!");
                                    }}
                                    className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
                                    title="Download PDF Report"
                                  >
                                    <FileDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const url = `${window.location.origin}/recap/${r.id}`;
                                      navigator.clipboard.writeText(url);
                                      toast.success("Share link copied!");
                                    }}
                                    className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
                                    title="Copy Share Link"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const partnerEmail = r.partners?.email || partner.email;
                                      const partnerName = r.partners?.contact_name || partner.contact_name;
                                      const url = `${window.location.origin}/recap/${r.id}`;
                                      const subject = encodeURIComponent(`Your Post-Event Recap — ${r.events?.name || "Event"}`);
                                      const body = encodeURIComponent(
                                        `Hi ${partnerName},\n\nThank you for partnering with us! Here's your post-event recap:\n\n${url}\n\nBest,\nBreathe & Bloom Team`
                                      );
                                      window.open(`mailto:${partnerEmail}?subject=${subject}&body=${body}`, "_blank");
                                    }}
                                    className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
                                    title="Email Recap to Partner"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="flex items-center gap-2">
                                  <Camera className="w-3.5 h-3.5 text-purple-400" />
                                  <div>
                                    <p className="text-sidebar-foreground text-sm font-medium">{r.photos_count}</p>
                                    <p className="text-sidebar-foreground/30 text-[10px]">Photos</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                                  <div>
                                    <p className="text-sidebar-foreground text-sm font-medium">{(r.impressions || 0).toLocaleString()}</p>
                                    <p className="text-sidebar-foreground/30 text-[10px]">Impressions</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Heart className="w-3.5 h-3.5 text-pink-400" />
                                  <div>
                                    <p className="text-sidebar-foreground text-sm font-medium">{r.engagement_rate}%</p>
                                    <p className="text-sidebar-foreground/30 text-[10px]">Engagement</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MessageSquare className="w-3.5 h-3.5 text-green-400" />
                                  <div>
                                    <p className="text-sidebar-foreground text-sm font-medium">{r.social_mentions}</p>
                                    <p className="text-sidebar-foreground/30 text-[10px]">Mentions</p>
                                  </div>
                                </div>
                              </div>
                              {r.notes && <p className="text-sidebar-foreground/40 text-xs mt-2">{r.notes}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {byPartner.length === 0 && (
            <div className="text-center py-12 text-sidebar-foreground/30">No partners found</div>
          )}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="rounded-xl border border-sidebar-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sidebar-border">
                <th className="text-left px-5 py-3 text-sidebar-foreground/40 font-medium text-xs">Asset</th>
                <th className="text-left px-5 py-3 text-sidebar-foreground/40 font-medium text-xs">Type</th>
                <th className="text-left px-5 py-3 text-sidebar-foreground/40 font-medium text-xs">Partner</th>
                <th className="text-left px-5 py-3 text-sidebar-foreground/40 font-medium text-xs">Due</th>
                <th className="text-left px-5 py-3 text-sidebar-foreground/40 font-medium text-xs">Status</th>
                <th className="text-left px-5 py-3 text-sidebar-foreground/40 font-medium text-xs">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d: any) => {
                const AssetIcon = getAssetIcon(d.asset_type);
                return (
                  <tr key={d.id} className="border-b border-sidebar-border/50 hover:bg-sidebar-accent/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <AssetIcon className="w-4 h-4 text-sidebar-foreground/40" />
                        <div>
                          <p className="text-sidebar-foreground font-medium">{d.title}</p>
                          {d.description && <p className="text-sidebar-foreground/40 text-xs mt-0.5 truncate max-w-[200px]">{d.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sidebar-foreground/60 text-xs capitalize">{(d.asset_type || "").replace("_", " ")}</td>
                    <td className="px-5 py-4 text-sidebar-foreground/60">{d.partners?.company_name || "—"}</td>
                    <td className="px-5 py-4 text-sidebar-foreground/60">
                      {d.due_date ? new Date(d.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                    </td>
                    <td className="px-5 py-4">{statusBadge(d.status)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setFormModal({ open: true, deliverable: d })}
                          className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground/40 hover:text-sidebar-foreground"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, id: d.id })}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-sidebar-foreground/40 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sidebar-foreground/30">No deliverables found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Deliverable Form Modal */}
      <DeliverableForm
        open={formModal.open}
        onClose={() => setFormModal({ open: false })}
        deliverable={formModal.deliverable}
        defaultPartnerId={formModal.partnerId}
        partners={partners}
      />

      {/* Recap Form Modal */}
      <RecapForm
        open={recapModal.open}
        onClose={() => setRecapModal({ open: false })}
        recap={recapModal.recap}
        defaultPartnerId={recapModal.partnerId}
        partners={partners}
        events={events}
      />

      <DeleteConfirm
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: "" })}
        table="deliverables"
        id={deleteModal.id}
        label="Deliverable"
        queryKey="admin-deliverables"
      />
    </AdminLayout>
  );
};

// ── Deliverable Form ──
function DeliverableForm({
  open, onClose, deliverable, defaultPartnerId, partners,
}: {
  open: boolean; onClose: () => void; deliverable?: any; defaultPartnerId?: string; partners: any[];
}) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", partner_id: "", due_date: "", status: "pending", asset_type: "other",
  });

  React.useEffect(() => {
    if (deliverable) {
      setForm({
        title: deliverable.title || "",
        description: deliverable.description || "",
        partner_id: deliverable.partner_id || "",
        due_date: deliverable.due_date || "",
        status: deliverable.status || "pending",
        asset_type: deliverable.asset_type || "other",
      });
    } else {
      setForm({
        title: "", description: "",
        partner_id: defaultPartnerId || partners[0]?.id || "",
        due_date: "", status: "pending", asset_type: "other",
      });
    }
  }, [deliverable, open, partners, defaultPartnerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (deliverable) {
        const { error } = await supabase.from("deliverables").update(form).eq("id", deliverable.id);
        if (error) throw error;
        toast.success("Updated!");
      } else {
        const { error } = await supabase.from("deliverables").insert(form);
        if (error) throw error;
        toast.success("Created!");
      }
      queryClient.invalidateQueries({ queryKey: ["admin-deliverables"] });
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg bg-sidebar-accent border border-sidebar-border text-sidebar-foreground text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-ring/50";

  return (
    <AdminModal open={open} onClose={onClose} title={deliverable ? "Edit Deliverable" : "Add Deliverable"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-sidebar-foreground mb-1.5">Title *</label>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-sidebar-foreground mb-1.5">Asset Type</label>
            <select value={form.asset_type} onChange={(e) => setForm({ ...form, asset_type: e.target.value })} className={inputClass}>
              {ASSET_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-sidebar-foreground mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="revision_needed">Revision Needed</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-sidebar-foreground mb-1.5">Partner *</label>
            <select required value={form.partner_id} onChange={(e) => setForm({ ...form, partner_id: e.target.value })} className={inputClass}>
              <option value="">Select partner</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>{p.company_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-sidebar-foreground mb-1.5">Due Date</label>
            <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-sidebar-foreground mb-1.5">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={`${inputClass} resize-none`} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-full border border-sidebar-border text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="flex-1 bg-sidebar-primary text-sidebar-primary-foreground py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? "Saving..." : deliverable ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}

// ── Recap Form ──
function RecapForm({
  open, onClose, recap, defaultPartnerId, partners, events,
}: {
  open: boolean; onClose: () => void; recap?: any; defaultPartnerId?: string; partners: any[]; events: any[];
}) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    partner_id: "", event_id: "", photos_count: 0, impressions: 0,
    engagement_rate: 0, social_mentions: 0, notes: "", recap_url: "",
  });

  React.useEffect(() => {
    if (recap) {
      setForm({
        partner_id: recap.partner_id || "",
        event_id: recap.event_id || "",
        photos_count: recap.photos_count || 0,
        impressions: recap.impressions || 0,
        engagement_rate: recap.engagement_rate || 0,
        social_mentions: recap.social_mentions || 0,
        notes: recap.notes || "",
        recap_url: recap.recap_url || "",
      });
    } else {
      setForm({
        partner_id: defaultPartnerId || partners[0]?.id || "",
        event_id: events[0]?.id || "",
        photos_count: 0, impressions: 0, engagement_rate: 0, social_mentions: 0,
        notes: "", recap_url: "",
      });
    }
  }, [recap, open, partners, events, defaultPartnerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (recap) {
        const { error } = await supabase.from("partner_recaps").update(form).eq("id", recap.id);
        if (error) throw error;
        toast.success("Recap updated!");
      } else {
        const { error } = await supabase.from("partner_recaps").insert(form);
        if (error) throw error;
        toast.success("Recap added!");
      }
      queryClient.invalidateQueries({ queryKey: ["admin-partner-recaps"] });
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg bg-sidebar-accent border border-sidebar-border text-sidebar-foreground text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-ring/50";

  return (
    <AdminModal open={open} onClose={onClose} title={recap ? "Edit Recap" : "Add Post-Event Recap"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-sidebar-foreground mb-1.5">Partner *</label>
            <select required value={form.partner_id} onChange={(e) => setForm({ ...form, partner_id: e.target.value })} className={inputClass}>
              <option value="">Select partner</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>{p.company_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-sidebar-foreground mb-1.5">Event *</label>
            <select required value={form.event_id} onChange={(e) => setForm({ ...form, event_id: e.target.value })} className={inputClass}>
              <option value="">Select event</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-sidebar-foreground mb-1.5">📸 Photos Delivered</label>
            <input type="number" min={0} value={form.photos_count} onChange={(e) => setForm({ ...form, photos_count: parseInt(e.target.value) || 0 })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-sidebar-foreground mb-1.5">👁 Impressions</label>
            <input type="number" min={0} value={form.impressions} onChange={(e) => setForm({ ...form, impressions: parseInt(e.target.value) || 0 })} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-sidebar-foreground mb-1.5">💗 Engagement Rate (%)</label>
            <input type="number" min={0} max={100} step={0.1} value={form.engagement_rate} onChange={(e) => setForm({ ...form, engagement_rate: parseFloat(e.target.value) || 0 })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-sidebar-foreground mb-1.5">💬 Social Mentions</label>
            <input type="number" min={0} value={form.social_mentions} onChange={(e) => setForm({ ...form, social_mentions: parseInt(e.target.value) || 0 })} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-sidebar-foreground mb-1.5">Recap URL (Google Drive, Dropbox, etc.)</label>
          <input type="url" value={form.recap_url} onChange={(e) => setForm({ ...form, recap_url: e.target.value })} placeholder="https://..." className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-sidebar-foreground mb-1.5">Notes</label>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className={`${inputClass} resize-none`} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-full border border-sidebar-border text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="flex-1 bg-sidebar-primary text-sidebar-primary-foreground py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? "Saving..." : recap ? "Update" : "Add Recap"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}

export default AdminDeliverables;
