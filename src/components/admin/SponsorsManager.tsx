import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SponsorCard, { type Sponsor } from "./SponsorCard";
import SponsorEditModal from "./SponsorEditModal";

interface SponsorsManagerProps {
  eventId: string;
}

const SponsorsManager = ({ eventId }: SponsorsManagerProps) => {
  const queryClient = useQueryClient();
  const [editModal, setEditModal] = useState<{ open: boolean; sponsor: Partial<Sponsor> | null }>({ open: false, sponsor: null });
  const [enabled, setEnabled] = useState<boolean | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Fetch sponsors enabled setting
  const { data: sponsorsEnabled = true } = useQuery({
    queryKey: ["event-setting", eventId, "sponsors_enabled"],
    queryFn: async () => {
      const { data } = await supabase
        .from("event_settings")
        .select("setting_value")
        .eq("event_id", eventId)
        .eq("setting_key", "sponsors_enabled")
        .maybeSingle();
      const val = data?.setting_value as boolean | null;
      return val !== false;
    },
    enabled: !!eventId,
  });

  // Fetch sponsors
  const { data: sponsors = [] } = useQuery({
    queryKey: ["event-sponsors", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_sponsors")
        .select("*")
        .eq("event_id", eventId)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as Sponsor[];
    },
    enabled: !!eventId,
  });

  const toggleEnabled = async () => {
    const newVal = !sponsorsEnabled;
    try {
      const { error } = await supabase
        .from("event_settings")
        .upsert({
          event_id: eventId,
          setting_key: "sponsors_enabled",
          setting_value: newVal as any,
        } as any, { onConflict: "event_id,setting_key" });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["event-setting", eventId, "sponsors_enabled"] });
      toast.success(newVal ? "Sponsors enabled" : "Sponsors disabled");
    } catch (err: any) {
      toast.error(err.message || "Failed to update setting");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this sponsor?")) return;
    try {
      const { error } = await supabase.from("event_sponsors").delete().eq("id", id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["event-sponsors", eventId] });
      toast.success("Sponsor removed");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove sponsor");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sponsors.findIndex((s) => s.id === active.id);
    const newIndex = sponsors.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(sponsors, oldIndex, newIndex);

    // Optimistic update
    queryClient.setQueryData(["event-sponsors", eventId], reordered);

    // Persist new order
    try {
      await Promise.all(
        reordered.map((s, i) =>
          supabase.from("event_sponsors").update({ display_order: i } as any).eq("id", s.id)
        )
      );
    } catch (err: any) {
      toast.error("Failed to reorder sponsors");
      queryClient.invalidateQueries({ queryKey: ["event-sponsors", eventId] });
    }
  };

  const removeSection = async () => {
    if (!confirm("Remove sponsors section and all sponsors for this event?")) return;
    try {
      await supabase.from("event_sponsors").delete().eq("event_id", eventId);
      await supabase.from("event_settings").delete().eq("event_id", eventId).eq("setting_key", "sponsors_enabled");
      queryClient.invalidateQueries({ queryKey: ["event-sponsors", eventId] });
      queryClient.invalidateQueries({ queryKey: ["event-setting", eventId, "sponsors_enabled"] });
      toast.success("Sponsors section removed");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove section");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-sidebar-foreground font-serif text-base">Sponsors</h3>
        <button
          type="button"
          onClick={toggleEnabled}
          className={`relative w-11 h-6 rounded-full transition-colors ${sponsorsEnabled ? "bg-green-500" : "bg-sidebar-foreground/20"}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${sponsorsEnabled ? "translate-x-5" : ""}`} />
        </button>
      </div>

      {sponsorsEnabled && (
        <>
          {/* Sponsor list with drag and drop */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sponsors.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {sponsors.map((sponsor) => (
                  <SponsorCard
                    key={sponsor.id}
                    sponsor={sponsor}
                    onEdit={(s) => setEditModal({ open: true, sponsor: s })}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {sponsors.length === 0 && (
            <p className="text-sidebar-foreground/30 text-sm text-center py-6">No sponsors added yet</p>
          )}

          {/* Add sponsor button */}
          <button
            type="button"
            onClick={() => setEditModal({ open: true, sponsor: null })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-sidebar-border text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground hover:border-sidebar-foreground/30 transition-colors w-full justify-center"
          >
            <Plus className="w-4 h-4" /> Add Sponsor
          </button>

          {/* Remove section */}
          {sponsors.length > 0 && (
            <button
              type="button"
              onClick={removeSection}
              className="flex items-center gap-2 text-xs text-red-400/60 hover:text-red-400 transition-colors mt-2"
            >
              <Trash2 className="w-3 h-3" /> Remove Section
            </button>
          )}
        </>
      )}

      <SponsorEditModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, sponsor: null })}
        sponsor={editModal.sponsor}
        eventId={eventId}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ["event-sponsors", eventId] })}
      />
    </div>
  );
};

export default SponsorsManager;
