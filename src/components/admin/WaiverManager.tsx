import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ShieldCheck, Link as LinkIcon, FileText, Check } from "lucide-react";

interface WaiverManagerProps {
  eventId: string;
}

interface WaiverSettings {
  enabled: boolean;
  type: "text" | "link";
  content: string;
  required: boolean;
}

const WaiverManager = ({ eventId }: WaiverManagerProps) => {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<WaiverSettings>({
    enabled: false,
    type: "link",
    content: "",
    required: false,
  });

  const { data: savedSettings, isLoading } = useQuery({
    queryKey: ["event-waiver-settings", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_settings")
        .select("setting_key, setting_value")
        .eq("event_id", eventId)
        .in("setting_key", ["waiver_enabled", "waiver_type", "waiver_content", "waiver_required"]);
      if (error) throw error;
      const map: Record<string, any> = {};
      data?.forEach((row) => {
        map[row.setting_key] = row.setting_value;
      });
      return map;
    },
    enabled: !!eventId,
  });

  useEffect(() => {
    if (savedSettings) {
      setSettings({
        enabled: savedSettings.waiver_enabled === true,
        type: savedSettings.waiver_type === "text" ? "text" : "link",
        content: typeof savedSettings.waiver_content === "string" ? savedSettings.waiver_content : "",
        required: savedSettings.waiver_required === true,
      });
    }
  }, [savedSettings]);

  const saveSetting = async (key: string, value: any) => {
    const { error } = await supabase
      .from("event_settings")
      .upsert(
        { event_id: eventId, setting_key: key, setting_value: value as any } as any,
        { onConflict: "event_id,setting_key" }
      );
    if (error) throw error;
  };

  const handleSave = async () => {
    if (settings.enabled && settings.type === "link" && settings.content.trim()) {
      try {
        new URL(settings.content.trim());
      } catch {
        toast.error("Please enter a valid URL for the waiver link");
        return;
      }
    }

    setSaving(true);
    try {
      await Promise.all([
        saveSetting("waiver_enabled", settings.enabled),
        saveSetting("waiver_type", settings.type),
        saveSetting("waiver_content", settings.content.trim()),
        saveSetting("waiver_required", settings.required),
      ]);
      queryClient.invalidateQueries({ queryKey: ["event-waiver-settings", eventId] });
      toast.success("Waiver settings saved");
    } catch (err: any) {
      toast.error(err.message || "Failed to save waiver settings");
    } finally {
      setSaving(false);
    }
  };

  const toggleEnabled = () => {
    setSettings((s) => ({ ...s, enabled: !s.enabled }));
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg bg-white/60 border border-[#022701]/20 text-sm text-[#022701] placeholder:text-[#022701]/40 focus:outline-none focus:ring-2 focus:ring-[#022701]/30";

  if (isLoading) return null;

  return (
    <div className="space-y-4">
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#022701]/60" />
          <h3 className="text-[#022701] font-serif text-base">Waiver</h3>
        </div>
        <button
          type="button"
          onClick={toggleEnabled}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            settings.enabled ? "bg-green-500" : "bg-[#022701]/20"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              settings.enabled ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>

      {settings.enabled && (
        <div className="space-y-4">
          {/* Type selector */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSettings((s) => ({ ...s, type: "text", content: s.type === "text" ? s.content : "" }))}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors flex-1 justify-center ${
                settings.type === "text"
                  ? "border-[#022701] bg-[#022701]/5 text-[#022701] font-medium"
                  : "border-[#022701]/20 text-[#022701]/50 hover:text-[#022701]"
              }`}
            >
              <FileText className="w-4 h-4" /> Text Waiver
            </button>
            <button
              type="button"
              onClick={() => setSettings((s) => ({ ...s, type: "link", content: s.type === "link" ? s.content : "" }))}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors flex-1 justify-center ${
                settings.type === "link"
                  ? "border-[#022701] bg-[#022701]/5 text-[#022701] font-medium"
                  : "border-[#022701]/20 text-[#022701]/50 hover:text-[#022701]"
              }`}
            >
              <LinkIcon className="w-4 h-4" /> Link to Waiver
            </button>
          </div>

          {/* Content field */}
          {settings.type === "link" ? (
            <div>
              <label className="block text-xs text-[#022701]/60 mb-1">Waiver URL</label>
              <input
                value={settings.content}
                onChange={(e) => setSettings((s) => ({ ...s, content: e.target.value }))}
                placeholder="https://forms.google.com/..."
                className={inputClass}
                maxLength={2000}
              />
              <p className="text-[10px] text-[#022701]/40 mt-1">
                Link to an external waiver form (Google Forms, DocuSign, etc.)
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs text-[#022701]/60 mb-1">Waiver Text</label>
              <textarea
                value={settings.content}
                onChange={(e) => setSettings((s) => ({ ...s, content: e.target.value }))}
                placeholder="Enter your waiver terms and conditions..."
                rows={6}
                className={`${inputClass} resize-none`}
                maxLength={10000}
              />
            </div>
          )}

          {/* Required toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-[#022701] font-medium">Require Acknowledgment</p>
              <p className="text-[10px] text-[#022701]/40 mt-0.5">
                Guests must accept the waiver before completing RSVP
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSettings((s) => ({ ...s, required: !s.required }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                settings.required ? "bg-[#022701]" : "bg-[#022701]/20"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.required ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>

          {/* Save button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#022701] text-white text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <Check className="w-3.5 h-3.5" /> {saving ? "Saving..." : "Save Waiver Settings"}
          </button>
        </div>
      )}
    </div>
  );
};

export default WaiverManager;
