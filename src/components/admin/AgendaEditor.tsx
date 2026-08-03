import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus, GripVertical, Pencil, Trash2, Clock, User,
  Loader2, Play, Mic, Music, Heart, MessageCircle, Sparkles, Coffee,
} from "lucide-react";
import AdminModal from "./AdminModal";

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

interface AgendaEditorProps {
  eventId: string;
}

const AgendaEditor = ({ eventId }: AgendaEditorProps) => {
  const queryClient = useQueryClient();
  const [formModal, setFormModal] = useState<{ open: boolean; segment?: any }>({ open: false });
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: segments = [], isLoading } = useQuery({
    queryKey: ["event-flow", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_flow_segments")
        .select("*")
        .eq("event_id", eventId)
        .order("segment_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });

  const totalMinutes = segments.reduce((sum, s: any) => sum + (s.duration_minutes || 0), 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this segment?")) return;
    const { error } = await supabase.from("event_flow_segments").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Segment removed");
    queryClient.invalidateQueries({ queryKey: ["event-flow", eventId] });
  };

  const handleReorder = async (fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return;
    const items = [...segments] as any[];
    const [moved] = items.splice(fromIdx, 1);
    items.splice(toIdx, 0, moved);
    setSaving(true);
    try {
      await Promise.all(
        items.map((item, idx) =>
          supabase.from("event_flow_segments").update({ segment_order: idx }).eq("id", item.id)
        )
      );
      queryClient.invalidateQueries({ queryKey: ["event-flow", eventId] });
    } catch {
      toast.error("Failed to reorder");
    } finally {
      setSaving(false);
    }
  };

  const addPreset = async (preset: typeof SEGMENT_PRESETS[0]) => {
    const { error } = await supabase.from("event_flow_segments").insert({
      event_id: eventId,
      title: preset.title,
      segment_type: preset.type,
      duration_minutes: preset.duration,
      segment_order: segments.length,
    });
    if (error) { toast.error(error.message); return; }
    toast.success(`Added "${preset.title}"`);
    queryClient.invalidateQueries({ queryKey: ["event-flow", eventId] });
  };

  const getStartTime = (idx: number) => {
    let m = 0;
    for (let i = 0; i < idx; i++) m += (segments[i] as any).duration_minutes || 0;
    const h = Math.floor(m / 60);
    const r = m % 60;
    return `+${h > 0 ? `${h}h ` : ""}${r}m`;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-[#022701] font-medium text-sm">Agenda</h3>
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#022701]/40" />}
          {segments.length > 0 && (
            <span className="text-[#022701]/40 text-xs">
              <Clock className="w-3 h-3 inline mr-0.5" />
              {hours > 0 ? `${hours}h ` : ""}{mins}m
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setFormModal({ open: true })}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#022701] text-[#eee8e1] text-xs font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {/* Quick Add Presets */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {SEGMENT_PRESETS.map((preset) => {
          const Icon = preset.icon;
          return (
            <button
              key={preset.type}
              type="button"
              onClick={() => addPreset(preset)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#022701]/20 text-[11px] text-[#022701]/50 hover:text-[#022701] hover:bg-[#022701]/10/50 transition-colors"
            >
              <Icon className="w-3 h-3" />
              {preset.title}
            </button>
          );
        })}
      </div>

      {/* Segments List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-[#022701]/30" />
        </div>
      ) : segments.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-[#022701]/20 rounded-lg">
          <p className="text-[#022701]/30 text-xs">No segments yet — use quick-add or click Add</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {segments.map((seg: any, idx: number) => {
            const Icon = SEGMENT_ICONS[seg.segment_type] || Clock;
            const isDragged = draggedIdx === idx;
            return (
              <div
                key={seg.id}
                draggable
                onDragStart={() => setDraggedIdx(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => { if (draggedIdx !== null) { handleReorder(draggedIdx, idx); setDraggedIdx(null); } }}
                onDragEnd={() => setDraggedIdx(null)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all group cursor-grab active:cursor-grabbing ${
                  isDragged
                    ? "border-sidebar-ring/50 bg-[#022701]/10/60 opacity-60"
                    : "border-[#022701]/20 hover:bg-[#022701]/10/20"
                }`}
              >
                <GripVertical className="w-3.5 h-3.5 text-[#022701]/20 group-hover:text-[#022701]/40 shrink-0" />
                <span className="text-[10px] text-[#022701]/30 font-mono w-8 text-right shrink-0">{getStartTime(idx)}</span>
                <div className="w-7 h-7 rounded-md bg-[#022701]/10 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[#022701]/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#022701] text-xs font-medium truncate">{seg.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[#022701]/40 text-[10px]">{seg.duration_minutes}m</span>
                    {seg.facilitator && (
                      <span className="text-[#022701]/40 text-[10px] flex items-center gap-0.5">
                        <User className="w-2.5 h-2.5" /> {seg.facilitator}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button type="button" onClick={() => setFormModal({ open: true, segment: seg })} className="p-1 rounded hover:bg-[#022701]/10 text-[#022701]/40 hover:text-[#022701]">
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button type="button" onClick={() => handleDelete(seg.id)} className="p-1 rounded hover:bg-red-500/10 text-[#022701]/40 hover:text-red-400">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Segment Form Modal */}
      <SegmentFormModal
        open={formModal.open}
        onClose={() => setFormModal({ open: false })}
        segment={formModal.segment}
        eventId={eventId}
        nextOrder={segments.length}
      />
    </div>
  );
};

function SegmentFormModal({
  open, onClose, segment, eventId, nextOrder,
}: {
  open: boolean; onClose: () => void; segment?: any; eventId: string; nextOrder: number;
}) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", duration_minutes: 15, facilitator: "", facilitator_instagram: "", segment_type: "custom",
  });

  useEffect(() => {
    if (segment) {
      setForm({
        title: segment.title || "", description: segment.description || "",
        duration_minutes: segment.duration_minutes || 15, facilitator: segment.facilitator || "",
        facilitator_instagram: segment.facilitator_instagram || "",
        segment_type: segment.segment_type || "custom",
      });
    } else {
      setForm({ title: "", description: "", duration_minutes: 15, facilitator: "", facilitator_instagram: "", segment_type: "custom" });
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

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-[#022701]/10 border border-[#022701]/20 text-[#022701] text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-ring/50";

  return (
    <AdminModal open={open} onClose={onClose} title={segment ? "Edit Segment" : "Add Segment"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-[#022701] mb-1.5">Title *</label>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="e.g. Guided Breathwork" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#022701] mb-1.5">Type</label>
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
            <label className="block text-sm text-[#022701] mb-1.5">Duration (min)</label>
            <input type="number" min={1} max={480} value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value) || 15 })} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-[#022701] mb-1.5">Facilitator</label>
          <input value={form.facilitator} onChange={(e) => setForm({ ...form, facilitator: e.target.value })} className={inputClass} placeholder="e.g. DJ Soleil" />
        </div>
        <div>
          <label className="block text-sm text-[#022701] mb-1.5">Instagram Handle</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#022701]/30 text-sm">@</span>
            <input value={form.facilitator_instagram} onChange={(e) => setForm({ ...form, facilitator_instagram: e.target.value.replace(/^@/, "") })} className={`${inputClass} pl-8`} placeholder="username" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-[#022701] mb-1.5">Notes</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={`${inputClass} resize-none`} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-full border border-[#022701]/20 text-sm text-[#022701]/60 hover:text-[#022701] transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 bg-[#022701] text-[#eee8e1] py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? "Saving..." : segment ? "Update" : "Add Segment"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}

export default AgendaEditor;
