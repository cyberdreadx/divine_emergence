import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Camera, Link, Crown, X, ImagePlus } from "lucide-react";
import AdminModal from "./AdminModal";
import type { Sponsor } from "./SponsorCard";

interface SponsorEditModalProps {
  open: boolean;
  onClose: () => void;
  sponsor: Partial<Sponsor> | null;
  eventId: string;
  onSaved: () => void;
}

const SponsorEditModal = ({ open, onClose, sponsor, eventId, onSaved }: SponsorEditModalProps) => {
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    website_url: "",
    description: "",
    is_main: false,
    cta_label: "",
    cta_link: "",
  });

  useEffect(() => {
    if (sponsor) {
      setForm({
        name: sponsor.name || "",
        website_url: sponsor.website_url || "",
        description: sponsor.description || "",
        is_main: sponsor.is_main || false,
        cta_label: sponsor.cta_label || "",
        cta_link: sponsor.cta_link || "",
      });
      setLogoPreview(sponsor.logo_url || null);
    } else {
      setForm({ name: "", website_url: "", description: "", is_main: false, cta_label: "", cta_link: "" });
      setLogoPreview(null);
    }
    setLogoFile(null);
  }, [sponsor, open]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2MB");
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const uploadLogo = async (sponsorId: string): Promise<string | null> => {
    if (!logoFile) return logoPreview;
    const ext = logoFile.name.split(".").pop() || "png";
    const path = `${eventId}/${sponsorId}.${ext}`;
    const { error } = await supabase.storage.from("sponsor-logos").upload(path, logoFile, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("sponsor-logos").getPublicUrl(path);
    return `${data.publicUrl}?t=${Date.now()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!form.name.trim()) {
      toast.error("Sponsor name is required");
      return;
    }
    setLoading(true);
    try {
      const sponsorId = sponsor?.id || crypto.randomUUID();
      const logoUrl = logoFile ? await uploadLogo(sponsorId) : logoPreview;

      const payload = {
        name: form.name,
        logo_url: logoUrl,
        website_url: form.website_url || null,
        description: form.description || null,
        is_main: form.is_main,
        cta_label: form.is_main && form.cta_label ? form.cta_label : null,
        cta_link: form.is_main && form.cta_link ? form.cta_link : null,
      };

      if (sponsor?.id) {
        const { error } = await supabase.from("event_sponsors").update(payload as any).eq("id", sponsor.id);
        if (error) throw error;
        toast.success("Sponsor updated!");
      } else {
        const { error } = await supabase.from("event_sponsors").insert({
          ...payload,
          id: sponsorId,
          event_id: eventId,
          display_order: 999,
        } as any);
        if (error) throw error;
        toast.success("Sponsor added!");
      }

      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save sponsor");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-white/60 border border-[#022701]/20 text-sm text-[#022701] placeholder:text-[#022701]/40 focus:outline-none focus:ring-2 focus:ring-[#022701]/30";

  return (
    <AdminModal open={open} onClose={onClose} title={sponsor?.id ? "Edit Sponsor" : "Add Sponsor"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Logo Upload */}
        <div className="flex justify-center">
          <label className="relative cursor-pointer group">
            <div className="w-24 h-24 rounded-full bg-[#022701]/10 border-2 border-dashed border-[#022701]/20 flex items-center justify-center overflow-hidden group-hover:border-[#022701]/40 transition-colors">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-8 h-8 text-[#022701]/30" />
              )}
            </div>
            {logoPreview && (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setLogoFile(null); setLogoPreview(null); }}
                className="absolute -top-1 -right-1 p-1 rounded-full bg-red-500 text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
          </label>
        </div>

        <div>
          <label className="block text-sm text-[#022701] mb-1.5">Sponsor Name *</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Sponsor's Name" className={inputClass} />
        </div>

        <div>
          <label className="block text-sm text-[#022701] mb-1.5">Website</label>
          <input value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} placeholder="https://..." className={inputClass} />
        </div>

        {/* Main Sponsor Toggle */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#022701]/60" />
            <span className="text-sm text-[#022701] font-medium">Mark as Main Sponsor</span>
          </div>
          <button
            type="button"
            onClick={() => setForm({ ...form, is_main: !form.is_main })}
            className={`relative w-11 h-6 rounded-full transition-colors ${form.is_main ? "bg-[#022701]" : "bg-[#022701]/20"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${form.is_main ? "translate-x-5" : ""}`} />
          </button>
        </div>

        <div>
          <label className="block text-sm text-[#022701] mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder={form.is_main ? "Add a detailed description about your top sponsor..." : "Short description..."}
            rows={form.is_main ? 4 : 2}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* CTA fields — only for main sponsors */}
        {form.is_main && (
          <div className="space-y-3 p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <p className="text-xs text-[#022701]/60 font-medium uppercase tracking-wider">Main Sponsor CTA</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#022701]/60 mb-1">Button Label</label>
                <input value={form.cta_label} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} placeholder="Learn More" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-[#022701]/60 mb-1">Button Link</label>
                <input value={form.cta_link} onChange={(e) => setForm({ ...form, cta_link: e.target.value })} placeholder="https://..." className={inputClass} />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-full border border-[#022701]/20 text-sm text-[#022701]/60 hover:text-[#022701] transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="flex-1 bg-[#022701] text-white py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? "Saving..." : sponsor?.id ? "Update" : "Add Sponsor"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
};

export default SponsorEditModal;
