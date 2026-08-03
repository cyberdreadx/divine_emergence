import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus, GripVertical, Pencil, Trash2, Clock, User, ChevronDown,
  Loader2, Play, Mic, Music, Heart, MessageCircle, Sparkles, Coffee, Printer,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminModal from "@/components/admin/AdminModal";

const SEGMENT_PRESETS = [
  { title: "Welcome & Opening", type: "welcome", duration: 10, icon: Sparkles },
  { title: "Guided Breathwork", type: "breathwork", duration: 30, icon: Play },
  { title: "Sound Journey", type: "sound", duration: 45, icon: Music },
  { title: "Integration & Sharing", type: "integration", duration: 20, icon: Heart },
  { title: "Closing & Gratitude", type: "closing", duration: 10, icon: MessageCircle },
  { title: "Community Mingle", type: "mingle", duration: 15, icon: Coffee },
  { title: "Partner Spotlight", type: "partner", duration: 5, icon: Mic },
];

const SEGMENT_ICONS: Record<string, typeof Play> = {
  welcome: Sparkles, breathwork: Play, sound: Music, integration: Heart,
  closing: MessageCircle, mingle: Coffee, partner: Mic, custom: Clock,
};

const AdminEventFlow = () => {
  const queryClient = useQueryClient();
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [formModal, setFormModal] = useState<{ open: boolean; segment?: any }>({ open: false });
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: events = [] } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("id, name, date, status").order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (events.length && !selectedEventId) {
      const active = events.find((e) => e.status === "active");
      setSelectedEventId(active?.id || events[0].id);
    }
  }, [events, selectedEventId]);

  const { data: segments = [], isLoading } = useQuery({
    queryKey: ["event-flow", selectedEventId],
    queryFn: async () => {
      if (!selectedEventId) return [];
      const { data, error } = await supabase
        .from("event_flow_segments")
        .select("*")
        .eq("event_id", selectedEventId)
        .order("segment_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!selectedEventId,
  });

  const totalMinutes = segments.reduce((sum, s: any) => sum + (s.duration_minutes || 0), 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this segment?")) return;
    const { error } = await supabase.from("event_flow_segments").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Segment removed");
    queryClient.invalidateQueries({ queryKey: ["event-flow", selectedEventId] });
  };

  const handleReorder = async (fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return;
    const items = [...segments] as any[];
    const [moved] = items.splice(fromIdx, 1);
    items.splice(toIdx, 0, moved);

    setSaving(true);
    try {
      const updates = items.map((item, idx) =>
        supabase.from("event_flow_segments").update({ segment_order: idx }).eq("id", item.id)
      );
      await Promise.all(updates);
      queryClient.invalidateQueries({ queryKey: ["event-flow", selectedEventId] });
    } catch (err: any) {
      toast.error("Failed to reorder");
    } finally {
      setSaving(false);
    }
  };

  const addPreset = async (preset: typeof SEGMENT_PRESETS[0]) => {
    const { error } = await supabase.from("event_flow_segments").insert({
      event_id: selectedEventId,
      title: preset.title,
      segment_type: preset.type,
      duration_minutes: preset.duration,
      segment_order: segments.length,
    });
    if (error) { toast.error(error.message); return; }
    toast.success(`Added "${preset.title}"`);
    queryClient.invalidateQueries({ queryKey: ["event-flow", selectedEventId] });
  };

  // Calculate running start times
  const getStartTime = (idx: number) => {
    let mins = 0;
    for (let i = 0; i < idx; i++) {
      mins += (segments[i] as any).duration_minutes || 0;
    }
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `+${h > 0 ? `${h}h ` : ""}${m}m`;
  };

  return (
    <AdminLayout
      title="Event Flow"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-sidebar-border text-sidebar-foreground/60 text-sm hover:text-sidebar-foreground transition-colors"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          <button
            onClick={() => setFormModal({ open: true })}
            disabled={!selectedEventId}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Add Segment
          </button>
        </div>
      }
    >
      {/* Event Selector */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-sidebar-accent border border-sidebar-border text-sidebar-foreground text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-ring/50 min-w-[250px]"
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.name} {ev.date ? `(${new Date(ev.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })})` : ""}
              </option>
            ))}
          </select>
          {saving && <Loader2 className="w-4 h-4 animate-spin text-sidebar-foreground/40" />}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-sidebar-foreground/40">
            {segments.length} segment{segments.length !== 1 ? "s" : ""}
          </span>
          <span className="text-sidebar-foreground/60 font-medium">
            <Clock className="w-3.5 h-3.5 inline mr-1" />
            {hours > 0 ? `${hours}h ` : ""}{mins}m total
          </span>
        </div>
      </div>

      {/* Quick Add Presets */}
      <div className="mb-6">
        <p className="text-sidebar-foreground/40 text-xs font-medium uppercase tracking-wider mb-3">Quick Add</p>
        <div className="flex flex-wrap gap-2">
          {SEGMENT_PRESETS.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.type}
                onClick={() => addPreset(preset)}
                disabled={!selectedEventId}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sidebar-border text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors disabled:opacity-30"
              >
                <Icon className="w-3.5 h-3.5" />
                {preset.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Flow Timeline */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-sidebar-foreground/30" />
        </div>
      ) : segments.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-sidebar-border rounded-xl">
          <p className="text-sidebar-foreground/30 text-sm">No segments yet — use quick-add or create a custom one</p>
        </div>
      ) : (
        <div className="space-y-2">
          {segments.map((seg: any, idx: number) => {
            const Icon = SEGMENT_ICONS[seg.segment_type] || Clock;
            const isDragged = draggedIdx === idx;
            return (
              <div
                key={seg.id}
                draggable
                onDragStart={() => setDraggedIdx(idx)}
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={() => { if (draggedIdx !== null) { handleReorder(draggedIdx, idx); setDraggedIdx(null); } }}
                onDragEnd={() => setDraggedIdx(null)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all group cursor-grab active:cursor-grabbing ${
                  isDragged
                    ? "border-sidebar-ring/50 bg-sidebar-accent/60 opacity-60"
                    : "border-sidebar-border hover:border-sidebar-border/80 hover:bg-sidebar-accent/20"
                }`}
              >
                {/* Drag Handle */}
                <GripVertical className="w-4 h-4 text-sidebar-foreground/20 group-hover:text-sidebar-foreground/40 shrink-0" />

                {/* Timeline indicator */}
                <div className="w-10 text-right shrink-0">
                  <span className="text-[10px] text-sidebar-foreground/30 font-mono">{getStartTime(idx)}</span>
                </div>

                {/* Icon */}
                <div className="w-9 h-9 rounded-lg bg-sidebar-accent flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-sidebar-foreground/60" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sidebar-foreground font-medium text-sm truncate">{seg.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-sidebar-foreground/40 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {seg.duration_minutes}m
                    </span>
                    {seg.facilitator && (
                      <span className="text-sidebar-foreground/40 text-xs flex items-center gap-1">
                        <User className="w-3 h-3" /> {seg.facilitator}
                      </span>
                    )}
                    {seg.description && (
                      <span className="text-sidebar-foreground/30 text-xs truncate max-w-[200px] hidden sm:inline">
                        {seg.description}
                      </span>
                    )}
                  </div>
                </div>

                {/* Duration bar */}
                <div className="hidden sm:block w-24 shrink-0">
                  <div className="w-full h-1.5 rounded-full bg-sidebar-accent overflow-hidden">
                    <div
                      className="h-full rounded-full bg-sidebar-ring/40"
                      style={{ width: `${Math.min((seg.duration_minutes / 60) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => setFormModal({ open: true, segment: seg })}
                    className="p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/40 hover:text-sidebar-foreground"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(seg.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-sidebar-foreground/40 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Segment Form Modal */}
      <SegmentForm
        open={formModal.open}
        onClose={() => setFormModal({ open: false })}
        segment={formModal.segment}
        eventId={selectedEventId}
        nextOrder={segments.length}
      />
    </AdminLayout>
  );
};

// ── Segment Form ──
function SegmentForm({
  open, onClose, segment, eventId, nextOrder,
}: {
  open: boolean; onClose: () => void; segment?: any; eventId: string; nextOrder: number;
}) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", duration_minutes: 15, facilitator: "", segment_type: "custom",
  });

  useEffect(() => {
    if (segment) {
      setForm({
        title: segment.title || "",
        description: segment.description || "",
        duration_minutes: segment.duration_minutes || 15,
        facilitator: segment.facilitator || "",
        segment_type: segment.segment_type || "custom",
      });
    } else {
      setForm({ title: "", description: "", duration_minutes: 15, facilitator: "", segment_type: "custom" });
    }
  }, [segment, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (segment) {
        const { error } = await supabase.from("event_flow_segments").update(form).eq("id", segment.id);
        if (error) throw error;
        toast.success("Segment updated!");
      } else {
        const { error } = await supabase.from("event_flow_segments").insert({
          ...form, event_id: eventId, segment_order: nextOrder,
        });
        if (error) throw error;
        toast.success("Segment added!");
      }
      queryClient.invalidateQueries({ queryKey: ["event-flow", eventId] });
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-sidebar-accent border border-sidebar-border text-sidebar-foreground text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-ring/50";

  return (
    <AdminModal open={open} onClose={onClose} title={segment ? "Edit Segment" : "Add Segment"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-sidebar-foreground mb-1.5">Title *</label>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="e.g. Guided Breathwork" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-sidebar-foreground mb-1.5">Type</label>
            <select value={form.segment_type} onChange={(e) => setForm({ ...form, segment_type: e.target.value })} className={inputClass}>
              <option value="welcome">Welcome & Opening</option>
              <option value="breathwork">Breathwork</option>
              <option value="sound">Sound Journey</option>
              <option value="integration">Integration</option>
              <option value="closing">Closing</option>
              <option value="mingle">Community Mingle</option>
              <option value="partner">Partner Spotlight</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-sidebar-foreground mb-1.5">Duration (minutes)</label>
            <input type="number" min={1} max={480} value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value) || 15 })} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-sidebar-foreground mb-1.5">Facilitator / Owner</label>
          <input value={form.facilitator} onChange={(e) => setForm({ ...form, facilitator: e.target.value })} className={inputClass} placeholder="e.g. Lead Facilitator, DJ Soleil" />
        </div>
        <div>
          <label className="block text-sm text-sidebar-foreground mb-1.5">Notes</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={`${inputClass} resize-none`} placeholder="Breathwork sequence, sound check notes, etc." />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-full border border-sidebar-border text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 bg-sidebar-primary text-sidebar-primary-foreground py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? "Saving..." : segment ? "Update" : "Add Segment"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}

export default AdminEventFlow;
