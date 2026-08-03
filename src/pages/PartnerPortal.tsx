import { useState } from "react";
import { useRequireAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  CheckCircle,
  Clock,
  LogOut,
  Handshake,
  Camera,
  Eye,
  Heart,
  MessageSquare,
  ExternalLink,
  Image,
  Download,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

type Tab = "recaps" | "assets" | "deliverables";

const PartnerPortal = () => {
  const { user, signOut } = useRequireAuth("partner");
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("recaps");

  const { data: partner } = useQuery({
    queryKey: ["partner-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: recaps = [] } = useQuery({
    queryKey: ["partner-recaps", partner?.id],
    queryFn: async () => {
      if (!partner) return [];
      const { data, error } = await supabase
        .from("partner_recaps")
        .select("*, events(name, date, location, cover_image)")
        .eq("partner_id", partner.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!partner,
  });

  const { data: assets = [] } = useQuery({
    queryKey: ["partner-assets", partner?.id],
    queryFn: async () => {
      if (!partner) return [];
      const { data, error } = await supabase
        .from("partner_assets")
        .select("*")
        .eq("partner_id", partner.id)
        .order("uploaded_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!partner,
  });

  const { data: deliverables = [] } = useQuery({
    queryKey: ["partner-deliverables", partner?.id],
    queryFn: async () => {
      if (!partner) return [];
      const { data, error } = await supabase
        .from("deliverables")
        .select("*")
        .eq("partner_id", partner.id)
        .order("due_date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!partner,
  });

  const handleFileUpload = async (deliverableId: string, file: File) => {
    setUploading(true);
    try {
      const filePath = `${partner?.id}/${deliverableId}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("partner-assets")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("partner-assets")
        .getPublicUrl(filePath);

      await supabase
        .from("deliverables")
        .update({ file_url: urlData.publicUrl, status: "submitted" })
        .eq("id", deliverableId);

      toast.success("File uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["partner-deliverables"] });
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "approved": return "text-green-600";
      case "submitted": return "text-blue-600";
      case "revision_needed": return "text-amber-600";
      default: return "text-muted-foreground";
    }
  };

  const tabs: { key: Tab; label: string; icon: any; count: number }[] = [
    { key: "recaps", label: "Recaps", icon: BarChart3, count: recaps.length },
    { key: "assets", label: "Media Assets", icon: Image, count: assets.length },
    { key: "deliverables", label: "Deliverables", icon: FileText, count: deliverables.length },
  ];

  if (!partner) {
    return (
      <div className="min-h-screen bg-section-light flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No partner profile found for your account.</p>
          <button onClick={signOut} className="text-gold text-sm hover:opacity-80">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-section-light">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Handshake className="w-5 h-5 text-gold" />
          <h1 className="font-serif text-lg text-foreground">Partner Portal</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
            View Site
          </Link>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 text-muted-foreground text-sm hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Partner Info */}
        <div className="bg-card rounded-xl p-6 shadow-sm mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-serif text-xl text-foreground">{partner.company_name}</h2>
              <p className="text-muted-foreground text-sm">{partner.contact_name} · {partner.email}</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-accent text-accent-foreground capitalize">
              {partner.tier.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-card rounded-xl p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-gold text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? "bg-white/20" : "bg-accent"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Recaps Tab */}
        {activeTab === "recaps" && (
          <div>
            {recaps.length === 0 ? (
              <div className="bg-card rounded-xl p-8 text-center shadow-sm">
                <BarChart3 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No recaps available yet.</p>
                <p className="text-muted-foreground text-xs mt-1">Recaps will appear here after each event.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recaps.map((recap: any) => {
                  const event = recap.events;
                  const eventDate = event?.date
                    ? new Date(event.date + "T00:00:00").toLocaleDateString("en-US", {
                        month: "long", day: "numeric", year: "numeric",
                      })
                    : "";

                  return (
                    <div key={recap.id} className="bg-card rounded-xl shadow-sm overflow-hidden">
                      {/* Event cover strip */}
                      {event?.cover_image && (
                        <div className="h-24 overflow-hidden">
                          <img src={event.cover_image} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-serif text-lg text-foreground">{event?.name || "Event"}</h4>
                            {eventDate && <p className="text-xs text-muted-foreground mt-0.5">{eventDate}{event?.location ? ` · ${event.location}` : ""}</p>}
                          </div>
                          <Link
                            to={`/recap/${recap.id}`}
                            className="text-gold text-sm hover:opacity-80 transition-opacity flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            View Full Recap
                          </Link>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { label: "Photos", value: recap.photos_count || 0, icon: Camera },
                            { label: "Impressions", value: (recap.impressions || 0).toLocaleString(), icon: Eye },
                            { label: "Engagement", value: `${recap.engagement_rate || 0}%`, icon: Heart },
                            { label: "Mentions", value: recap.social_mentions || 0, icon: MessageSquare },
                          ].map((m) => (
                            <div key={m.label} className="bg-accent rounded-lg p-3 text-center">
                              <m.icon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                              <p className="text-lg font-serif text-foreground">{m.value}</p>
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</p>
                            </div>
                          ))}
                        </div>

                        {recap.notes && (
                          <p className="text-sm text-muted-foreground mt-4 bg-accent rounded-lg p-3">{recap.notes}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Assets Tab */}
        {activeTab === "assets" && (
          <div>
            {assets.length === 0 ? (
              <div className="bg-card rounded-xl p-8 text-center shadow-sm">
                <Image className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No media assets yet.</p>
                <p className="text-muted-foreground text-xs mt-1">Photos, videos, and files from your events will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {assets.map((asset: any) => (
                  <a
                    key={asset.id}
                    href={asset.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square bg-accent flex items-center justify-center overflow-hidden">
                      {asset.file_type === "image" ? (
                        <img src={asset.file_url} alt={asset.file_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <FileText className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-medium text-foreground truncate">{asset.file_name}</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                        <Download className="w-3 h-3" />
                        {asset.file_size ? `${(asset.file_size / 1024 / 1024).toFixed(1)} MB` : "Download"}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Deliverables Tab */}
        {activeTab === "deliverables" && (
          <div>
            {deliverables.length === 0 ? (
              <div className="bg-card rounded-xl p-8 text-center shadow-sm">
                <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No deliverables assigned yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {deliverables.map((d) => (
                  <div key={d.id} className="bg-card rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-foreground">{d.title}</h4>
                        {d.description && (
                          <p className="text-muted-foreground text-sm mt-1">{d.description}</p>
                        )}
                      </div>
                      <span className={`flex items-center gap-1.5 text-xs font-medium capitalize ${statusColor(d.status)}`}>
                        {d.status === "approved" ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {d.status.replace("_", " ")}
                      </span>
                    </div>

                    {d.due_date && (
                      <p className="text-xs text-muted-foreground mb-3">
                        Due: {new Date(d.due_date).toLocaleDateString()}
                      </p>
                    )}

                    {d.file_url && (
                      <a
                        href={d.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold text-sm hover:opacity-80 transition-opacity inline-flex items-center gap-1 mb-3"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View uploaded file
                      </a>
                    )}

                    {d.status !== "approved" && (
                      <label className="flex items-center gap-2 cursor-pointer mt-2">
                        <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm hover:opacity-80 transition-opacity">
                          <Upload className="w-4 h-4" />
                          {uploading ? "Uploading..." : "Upload File"}
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          disabled={uploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(d.id, file);
                          }}
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerPortal;
