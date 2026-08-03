import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, DollarSign, Users, Tag, Pencil, Check } from "lucide-react";

interface Tier {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  price: number;
  capacity: number | null;
  sold_count: number;
  status: string;
  display_order: number;
  sales_end_date: string | null;
  sales_end_time: string | null;
}

interface PricingManagerProps {
  eventId: string;
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  paused: "bg-amber-500/15 text-amber-600 border-amber-500/20",
  sold_out: "bg-red-500/15 text-red-500 border-red-500/20",
  hidden: "bg-[#022701]/10 text-[#022701]/40 border-[#022701]/10",
};

const STATUS_LABELS: Record<string, string> = {
  active: "On Sale",
  paused: "Paused",
  sold_out: "Sold Out",
  hidden: "Hidden",
};

const PricingManager = ({ eventId }: PricingManagerProps) => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", capacity: "", status: "active", sales_end_date: "", sales_end_time: "" });
  const [saving, setSaving] = useState(false);

  const { data: tiers = [], isLoading } = useQuery({
    queryKey: ["ticket-tiers", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ticket_tiers")
        .select("*")
        .eq("event_id", eventId)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as Tier[];
    },
    enabled: !!eventId,
  });

  const totalCapacity = tiers.reduce((sum, t) => sum + (t.capacity || 0), 0);
  const totalSold = tiers.reduce((sum, t) => sum + t.sold_count, 0);

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", capacity: "", status: "active", sales_end_date: "", sales_end_time: "" });
    setEditingId(null);
    setAddingNew(false);
  };

  const startEdit = (tier: Tier) => {
    setForm({
      name: tier.name,
      description: tier.description || "",
      price: String(tier.price),
      capacity: tier.capacity != null ? String(tier.capacity) : "",
      status: tier.status,
      sales_end_date: tier.sales_end_date || "",
      sales_end_time: tier.sales_end_time || "",
    });
    setEditingId(tier.id);
    setAddingNew(false);
  };

  const startAdd = () => {
    resetForm();
    setAddingNew(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Tier name is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: parseFloat(form.price) || 0,
        capacity: form.capacity ? parseInt(form.capacity) : null,
        status: form.status,
        sales_end_date: form.sales_end_date || null,
        sales_end_time: form.sales_end_time || null,
      };

      if (editingId) {
        const { error } = await supabase.from("ticket_tiers").update(payload as any).eq("id", editingId);
        if (error) throw error;
        toast.success("Tier updated");
      } else {
        const { error } = await supabase.from("ticket_tiers").insert({
          ...payload,
          event_id: eventId,
          display_order: tiers.length,
        } as any);
        if (error) throw error;
        toast.success("Tier added");
      }
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["ticket-tiers", eventId] });
    } catch (err: any) {
      toast.error(err.message || "Failed to save tier");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this ticket tier?")) return;
    try {
      const { error } = await supabase.from("ticket_tiers").delete().eq("id", id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["ticket-tiers", eventId] });
      toast.success("Tier deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-lg bg-white/60 border border-[#022701]/20 text-sm text-[#022701] placeholder:text-[#022701]/40 focus:outline-none focus:ring-2 focus:ring-[#022701]/30";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[#022701] font-serif text-base">Pricing & Capacity</h3>
        {tiers.length > 0 && (
          <div className="flex items-center gap-3 text-xs text-[#022701]/50">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" /> {tiers.length} tier{tiers.length !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> {totalSold}/{totalCapacity || "∞"} sold
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {tiers.map((tier) => (
          <div key={tier.id} className="bg-white/40 border border-[#022701]/10 rounded-xl p-4">
            {editingId === tier.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#022701]/60 mb-1">Name *</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="e.g. Early Bird" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#022701]/60 mb-1">Price ($)</label>
                    <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} placeholder="0.00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#022701]/60 mb-1">Capacity</label>
                    <input type="number" min="0" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className={inputClass} placeholder="Unlimited" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#022701]/60 mb-1">Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                      <option value="active">On Sale</option>
                      <option value="paused">Paused</option>
                      <option value="sold_out">Sold Out</option>
                      <option value="hidden">Hidden</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#022701]/60 mb-1">Description</label>
                  <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} placeholder="What's included..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#022701]/60 mb-1">Sales End Date</label>
                    <input type="date" value={form.sales_end_date} onChange={(e) => setForm({ ...form, sales_end_date: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs text-[#022701]/60 mb-1">Sales End Time</label>
                    <select value={form.sales_end_time} onChange={(e) => setForm({ ...form, sales_end_time: e.target.value })} className={inputClass}>
                      <option value="">Select</option>
                      {Array.from({ length: 48 }, (_, i) => {
                        const h = Math.floor(i / 2);
                        const m = i % 2 === 0 ? "00" : "30";
                        const val = `${String(h).padStart(2, "0")}:${m}`;
                        const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
                        const ampm = h < 12 ? "AM" : "PM";
                        return <option key={val} value={val}>{`${hour12}:${m} ${ampm}`}</option>;
                      })}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={resetForm} className="px-3 py-1.5 text-xs text-[#022701]/50 hover:text-[#022701] transition-colors">Cancel</button>
                  <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#022701] text-white text-xs hover:opacity-90 disabled:opacity-50">
                    <Check className="w-3 h-3" /> {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#022701]/5 flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4 text-[#022701]/40" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[#022701] font-medium text-sm truncate">{tier.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[tier.status] || STATUS_COLORS.active}`}>
                        {STATUS_LABELS[tier.status] || tier.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#022701]/50 mt-0.5">
                      <span>${tier.price.toFixed(2)}</span>
                      <span>{tier.sold_count}/{tier.capacity ?? "∞"} sold</span>
                      {tier.description && <span className="truncate max-w-[150px]">{tier.description}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button type="button" onClick={() => startEdit(tier)} className="p-1.5 text-[#022701]/30 hover:text-[#022701] transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => handleDelete(tier.id)} className="p-1.5 text-[#022701]/30 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {tier.capacity && editingId !== tier.id && (
              <div className="mt-3">
                <div className="w-full h-1.5 rounded-full bg-[#022701]/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      tier.sold_count >= tier.capacity ? "bg-red-400" : tier.sold_count / tier.capacity > 0.8 ? "bg-amber-400" : "bg-emerald-400"
                    }`}
                    style={{ width: `${Math.min((tier.sold_count / tier.capacity) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {addingNew && (
        <div className="bg-white/40 border border-dashed border-[#022701]/20 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#022701]/60 mb-1">Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="e.g. General Admission" />
            </div>
            <div>
              <label className="block text-xs text-[#022701]/60 mb-1">Price ($)</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} placeholder="0.00" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#022701]/60 mb-1">Capacity</label>
              <input type="number" min="0" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className={inputClass} placeholder="Unlimited" />
            </div>
            <div>
              <label className="block text-xs text-[#022701]/60 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                <option value="active">On Sale</option>
                <option value="paused">Paused</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#022701]/60 mb-1">Description</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} placeholder="What's included..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#022701]/60 mb-1">Sales End Date</label>
              <input type="date" value={form.sales_end_date} onChange={(e) => setForm({ ...form, sales_end_date: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-[#022701]/60 mb-1">Sales End Time</label>
              <select value={form.sales_end_time} onChange={(e) => setForm({ ...form, sales_end_time: e.target.value })} className={inputClass}>
                <option value="">Select</option>
                {Array.from({ length: 48 }, (_, i) => {
                  const h = Math.floor(i / 2);
                  const m = i % 2 === 0 ? "00" : "30";
                  const val = `${String(h).padStart(2, "0")}:${m}`;
                  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
                  const ampm = h < 12 ? "AM" : "PM";
                  return <option key={val} value={val}>{`${hour12}:${m} ${ampm}`}</option>;
                })}
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={resetForm} className="px-3 py-1.5 text-xs text-[#022701]/50 hover:text-[#022701] transition-colors">Cancel</button>
            <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#022701] text-white text-xs hover:opacity-90 disabled:opacity-50">
              <Check className="w-3 h-3" /> {saving ? "Saving..." : "Add Tier"}
            </button>
          </div>
        </div>
      )}

      {!addingNew && !editingId && (
        <button
          type="button"
          onClick={startAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-[#022701]/20 text-sm text-[#022701]/50 hover:text-[#022701] hover:border-[#022701]/30 transition-colors w-full justify-center"
        >
          <Plus className="w-4 h-4" /> Add Ticket Tier
        </button>
      )}

      {tiers.length === 0 && !addingNew && (
        <p className="text-[#022701]/30 text-sm text-center py-4">No ticket tiers yet. Add one to enable tiered pricing.</p>
      )}
    </div>
  );
};

export default PricingManager;
