import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, Plus, Download, Pencil, Trash2, Camera, ArrowLeft } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import PartnerForm from "@/components/admin/PartnerForm";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import PartnerAssetsManager from "@/components/admin/PartnerAssetsManager";

// Partners management page
const AdminPartners = () => {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [partnerModal, setPartnerModal] = useState<{ open: boolean; partner?: any }>({ open: false });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string }>({ open: false, id: "" });
  const [selectedPartner, setSelectedPartner] = useState<any>(null);

  const { data: partners = [] } = useQuery({
    queryKey: ["admin-partners"],
    queryFn: async () => {
      const { data, error } = await supabase.from("partners").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const tiers = ["all", "title_sponsor", "premium_partner", "activation_partner", "gift_bag"];

  const filtered = partners
    .filter((p) => tierFilter === "all" || p.tier === tierFilter)
    .filter((p) => `${p.company_name} ${p.contact_name} ${p.email}`.toLowerCase().includes(search.toLowerCase()));

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      confirmed: "bg-green-500/20 text-green-400",
      active: "bg-emerald-500/20 text-emerald-400",
      prospect: "bg-yellow-500/20 text-yellow-400",
      contacted: "bg-blue-500/20 text-blue-400",
      completed: "bg-purple-500/20 text-purple-400",
    };
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${colors[status] || "bg-sidebar-accent text-sidebar-foreground"}`}>
        {status}
      </span>
    );
  };

  const exportCSV = () => {
    if (!filtered.length) return;
    const headers = Object.keys(filtered[0]);
    const csv = [headers.join(","), ...filtered.map((r: any) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `partners-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Exported!");
  };

  // Partner Detail View
  if (selectedPartner) {
    return (
      <AdminLayout
        title={selectedPartner.company_name}
        actions={
          <div className="flex items-center gap-2">
            <button onClick={() => setPartnerModal({ open: true, partner: selectedPartner })}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-sidebar-border text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
              <Pencil className="w-4 h-4" /> Edit
            </button>
          </div>
        }
      >
        <button onClick={() => setSelectedPartner(null)}
          className="flex items-center gap-1 text-sm text-sidebar-foreground/40 hover:text-sidebar-foreground mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Partners
        </button>

        {/* Partner Info Card */}
        <div className="rounded-xl border border-sidebar-border p-5 mb-6 bg-sidebar-accent/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sidebar-foreground/40 text-[10px] uppercase tracking-wider mb-0.5">Contact</p>
              <p className="text-sidebar-foreground text-sm font-medium">{selectedPartner.contact_name}</p>
              <p className="text-sidebar-foreground/50 text-xs">{selectedPartner.email}</p>
              {selectedPartner.phone && <p className="text-sidebar-foreground/50 text-xs">{selectedPartner.phone}</p>}
            </div>
            <div>
              <p className="text-sidebar-foreground/40 text-[10px] uppercase tracking-wider mb-0.5">Tier & Status</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2.5 py-1 rounded-full bg-sidebar-accent text-sidebar-foreground capitalize">
                  {(selectedPartner.tier || "gift_bag").replace(/_/g, " ")}
                </span>
                {statusBadge(selectedPartner.status)}
              </div>
            </div>
            <div>
              <p className="text-sidebar-foreground/40 text-[10px] uppercase tracking-wider mb-0.5">Details</p>
              {selectedPartner.instagram && (
                <p className="text-sidebar-foreground/50 text-xs">@{selectedPartner.instagram}</p>
              )}
              {selectedPartner.monetary_value > 0 && (
                <p className="text-sidebar-foreground/50 text-xs">${Number(selectedPartner.monetary_value).toLocaleString()} value</p>
              )}
              {selectedPartner.quantity > 0 && (
                <p className="text-sidebar-foreground/50 text-xs">Qty: {selectedPartner.quantity}</p>
              )}
            </div>
          </div>
          {selectedPartner.affiliate_link && (
            <div className="mt-3 pt-3 border-t border-sidebar-border">
              <p className="text-sidebar-foreground/40 text-[10px] uppercase tracking-wider mb-0.5">Affiliate Link</p>
              <a href={selectedPartner.affiliate_link} target="_blank" rel="noopener"
                className="text-sidebar-foreground/60 text-xs hover:text-sidebar-foreground underline break-all">
                {selectedPartner.affiliate_link}
              </a>
            </div>
          )}
          {selectedPartner.notes && (
            <div className="mt-3 pt-3 border-t border-sidebar-border">
              <p className="text-sidebar-foreground/40 text-[10px] uppercase tracking-wider mb-0.5">Notes</p>
              <p className="text-sidebar-foreground/60 text-xs">{selectedPartner.notes}</p>
            </div>
          )}
        </div>

        {/* Assets Manager */}
        <PartnerAssetsManager
          partnerId={selectedPartner.id}
          partnerEmail={selectedPartner.email}
          partnerName={selectedPartner.contact_name}
        />

        <PartnerForm open={partnerModal.open} onClose={() => { setPartnerModal({ open: false }); }} partner={partnerModal.partner} />
      </AdminLayout>
    );
  }

  // Partners List View
  return (
    <AdminLayout
      title="Partners"
      actions={
        <button onClick={() => setPartnerModal({ open: true })}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Partner
        </button>
      }
    >
      <div className="flex flex-col gap-3 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sidebar-foreground/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search partners..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-sidebar-accent border border-sidebar-border text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/30 focus:outline-none focus:ring-2 focus:ring-sidebar-ring/50" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg overflow-hidden border border-sidebar-border flex-wrap">
            {tiers.map((t) => (
              <button key={t} onClick={() => setTierFilter(t)}
                className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${
                  tierFilter === t ? "bg-sidebar-accent text-sidebar-foreground" : "text-sidebar-foreground/40 hover:text-sidebar-foreground/70"
                }`}>
                {t === "all" ? "All" : t.replace(/_/g, " ")}
              </button>
            ))}
          </div>
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-sidebar-border text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border border-sidebar-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sidebar-border">
              <th className="text-left px-5 py-3 text-sidebar-foreground/40 font-medium text-xs">Company</th>
              <th className="text-left px-5 py-3 text-sidebar-foreground/40 font-medium text-xs">Contact</th>
              <th className="text-left px-5 py-3 text-sidebar-foreground/40 font-medium text-xs">Tier</th>
              <th className="text-left px-5 py-3 text-sidebar-foreground/40 font-medium text-xs">Status</th>
              <th className="text-left px-5 py-3 text-sidebar-foreground/40 font-medium text-xs">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-sidebar-border/50 hover:bg-sidebar-accent/30 transition-colors cursor-pointer"
                onClick={() => setSelectedPartner(p)}>
                <td className="px-5 py-4">
                  <p className="text-sidebar-foreground font-medium">{p.company_name}</p>
                  <p className="text-sidebar-foreground/40 text-xs mt-0.5">{p.email}</p>
                </td>
                <td className="px-5 py-4 text-sidebar-foreground/60">{p.contact_name}</td>
                <td className="px-5 py-4">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-sidebar-accent text-sidebar-foreground capitalize">
                    {(p.tier || "gift_bag").replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-5 py-4">{statusBadge(p.status)}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <button onClick={(e) => { e.stopPropagation(); setPartnerModal({ open: true, partner: p }); }}
                      className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground/40 hover:text-sidebar-foreground">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedPartner(p); }}
                      className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground/40 hover:text-sidebar-foreground">
                      <Camera className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteModal({ open: true, id: p.id }); }}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-sidebar-foreground/40 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-sidebar-foreground/30">No partners found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((p) => (
          <div key={p.id} className="rounded-xl border border-sidebar-border p-4 bg-sidebar-accent/20 cursor-pointer active:bg-sidebar-accent/40 transition-colors"
            onClick={() => setSelectedPartner(p)}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <p className="text-sidebar-foreground font-medium text-sm">{p.company_name}</p>
                <p className="text-sidebar-foreground/40 text-xs truncate">{p.contact_name} · {p.email}</p>
              </div>
              {statusBadge(p.status)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs px-2.5 py-1 rounded-full bg-sidebar-accent text-sidebar-foreground capitalize">
                {(p.tier || "gift_bag").replace(/_/g, " ")}
              </span>
              <Camera className="w-4 h-4 text-sidebar-foreground/40" />
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sidebar-foreground/30 py-12">No partners found</p>
        )}
      </div>

      <PartnerForm open={partnerModal.open} onClose={() => setPartnerModal({ open: false })} partner={partnerModal.partner} />
      <DeleteConfirm open={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: "" })}
        table="partners" id={deleteModal.id} label="Partner" queryKey="admin-partners" />
    </AdminLayout>
  );
};

export default AdminPartners;
