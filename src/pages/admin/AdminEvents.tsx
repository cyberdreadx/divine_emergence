import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Search, Plus, Download, Pencil, Trash2,
  Send, Loader2, ArrowUpDown, ArrowUp, ArrowDown,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import EventForm from "@/components/admin/EventForm";
import DeleteConfirm from "@/components/admin/DeleteConfirm";

const AdminEvents = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState<"upcoming" | "past" | "cancelled">("upcoming");
  const [eventModal, setEventModal] = useState<{ open: boolean; event?: any }>({ open: false });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string }>({ open: false, id: "" });
  const [followUpLoading, setFollowUpLoading] = useState<string | null>(null);
  const [sortCol, setSortCol] = useState<"date" | "rsvps" | "gross" | null>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleSort = (col: "date" | "rsvps" | "gross") => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const runFollowUp = async (eventId: string, eventName: string) => {
    if (!confirm(`Run post-event follow-up for "${eventName}"?\n\nThis will:\n• Mark confirmed/checked-in guests as "attended"\n• Mark pending guests as "no-show"\n• Set event status to "completed"`)) return;
    setFollowUpLoading(eventId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("post-event-followup", {
        body: { event_id: eventId },
      });
      if (error) throw error;
      toast.success(data.message || "Follow-up complete!");
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["admin-guest-counts"] });
    } catch (err: any) {
      toast.error(err.message || "Follow-up failed");
    } finally {
      setFollowUpLoading(null);
    }
  };

  const { data: events = [] } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: guestCounts = {} } = useQuery({
    queryKey: ["admin-guest-counts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("guests").select("event_id, status");
      if (error) throw error;
      const counts: Record<string, { total: number; confirmed: number }> = {};
      data.forEach((g) => {
        if (!g.event_id) return;
        if (!counts[g.event_id]) counts[g.event_id] = { total: 0, confirmed: 0 };
        counts[g.event_id].total++;
        if (["confirmed", "checked_in"].includes(g.status)) counts[g.event_id].confirmed++;
      });
      return counts;
    },
  });

  const { data: orderTotals = {} } = useQuery({
    queryKey: ["admin-event-gross"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("event_id, total_amount, status");
      if (error) throw error;
      const totals: Record<string, number> = {};
      data.forEach((o) => {
        if (!o.event_id || o.status === "cancelled") return;
        totals[o.event_id] = (totals[o.event_id] || 0) + (o.total_amount || 0);
      });
      return totals;
    },
  });

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const filtered = events
    .filter((ev) => {
      if (timeFilter === "upcoming") return ev.status !== "cancelled" && (!ev.date || ev.date >= todayStr);
      if (timeFilter === "past") return ev.status !== "cancelled" && ev.date && ev.date < todayStr;
      if (timeFilter === "cancelled") return ev.status === "cancelled";
      return true;
    })
    .filter((ev) => `${ev.name} ${ev.location}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (!sortCol) return 0;
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortCol === "date") {
        return ((a.date || "") > (b.date || "") ? 1 : -1) * dir;
      }
      if (sortCol === "rsvps") {
        const ac = (guestCounts[a.id as keyof typeof guestCounts] as any)?.confirmed || 0;
        const bc = (guestCounts[b.id as keyof typeof guestCounts] as any)?.confirmed || 0;
        return (ac - bc) * dir;
      }
      if (sortCol === "gross") {
        const ag = (orderTotals as Record<string, number>)[a.id] || 0;
        const bg = (orderTotals as Record<string, number>)[b.id] || 0;
        return (ag - bg) * dir;
      }
      return 0;
    });

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-500/20 text-green-400",
      draft: "bg-yellow-500/20 text-yellow-400",
      completed: "bg-blue-500/20 text-blue-400",
      cancelled: "bg-red-500/20 text-red-400",
    };
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${colors[status] || "bg-sidebar-accent text-sidebar-foreground"}`}>
        {status}
      </span>
    );
  };

  const exportCSV = () => {
    if (!filtered.length) return;
    const headers = ["name", "date", "location", "status", "max_guests"];
    const csv = [headers.join(","), ...filtered.map((ev) => headers.map((h) => `"${ev[h as keyof typeof ev] ?? ""}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `events-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Exported!");
  };

  return (
    <AdminLayout
      title="Events"
      actions={
        <button
          onClick={() => setEventModal({ open: true })}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Create
        </button>
      }
    >
      {/* Search + Filters */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sidebar-foreground/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-sidebar-accent border border-sidebar-border text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/30 focus:outline-none focus:ring-2 focus:ring-sidebar-ring/50"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg overflow-hidden border border-sidebar-border">
            {(["upcoming", "past", "cancelled"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className={`px-4 py-2 text-xs font-medium capitalize transition-colors ${
                  timeFilter === f
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-sidebar-foreground/40 hover:text-sidebar-foreground/70"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-sidebar-border text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
          >
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border border-sidebar-border overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-sidebar-border">
              <th className="text-left px-5 py-3 text-sidebar-foreground/40 font-medium text-xs">
                <button onClick={() => toggleSort("date")} className="flex items-center gap-1 hover:text-sidebar-foreground transition-colors">
                  Event {sortCol === "date" ? (sortDir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                </button>
              </th>
              <th className="text-left px-5 py-3 text-sidebar-foreground/40 font-medium text-xs">
                <button onClick={() => toggleSort("rsvps")} className="flex items-center gap-1 hover:text-sidebar-foreground transition-colors">
                  RSVPs {sortCol === "rsvps" ? (sortDir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                </button>
              </th>
              <th className="text-left px-5 py-3 text-sidebar-foreground/40 font-medium text-xs">
                <button onClick={() => toggleSort("gross")} className="flex items-center gap-1 hover:text-sidebar-foreground transition-colors">
                  Gross {sortCol === "gross" ? (sortDir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                </button>
              </th>
              <th className="text-left px-5 py-3 text-sidebar-foreground/40 font-medium text-xs">Status</th>
              <th className="text-left px-5 py-3 text-sidebar-foreground/40 font-medium text-xs">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ev) => {
              const counts = guestCounts[ev.id as keyof typeof guestCounts] as { total: number; confirmed: number } | undefined;
              const gross = (orderTotals as Record<string, number>)[ev.id] || 0;
              const eventDate = ev.date ? new Date(ev.date + "T00:00:00") : null;
              const monthStr = eventDate ? eventDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase() : "";
              const dayStr = eventDate ? eventDate.getDate().toString().padStart(2, "0") : "";

              return (
                <tr key={ev.id} className="border-b border-sidebar-border/50 hover:bg-sidebar-accent/30 transition-colors cursor-pointer" onClick={() => window.open(`/event/${ev.id}`, "_blank")}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center w-14 shrink-0">
                        {eventDate ? (
                          <>
                            <span className="text-xs font-semibold tracking-wider text-orange-400 uppercase leading-none">{monthStr}</span>
                            <span className="text-2xl font-bold text-sidebar-foreground leading-tight">{dayStr}</span>
                          </>
                        ) : (
                          <span className="text-sidebar-foreground/30 text-xs">TBD</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 min-w-0">
                        {ev.cover_image ? (
                          <img src={ev.cover_image} alt={ev.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-sidebar-accent flex items-center justify-center shrink-0">
                            <span className="text-sidebar-foreground/30 text-lg font-serif">{ev.name.charAt(0)}</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sidebar-foreground font-medium truncate">{ev.name}</p>
                          <p className="text-sidebar-foreground/40 text-xs mt-0.5 truncate">{ev.location || "No location"}</p>
                          {eventDate && (
                            <p className="text-sidebar-foreground/30 text-xs mt-0.5">
                              {eventDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                              {ev.time ? ` at ${(() => { const [h,m] = ev.time.split(":").map(Number); const hr = h === 0 ? 12 : h > 12 ? h - 12 : h; return `${hr}:${m.toString().padStart(2,"0")} ${h < 12 ? "AM" : "PM"}`; })()}` : ""}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sidebar-foreground/60">
                    <div className="flex flex-col gap-1">
                      <span>{counts ? `${counts.confirmed}/${counts.total}` : "0"} / {ev.max_guests}</span>
                      {counts && ev.max_guests && (
                        <div className="w-16 h-1 rounded-full bg-sidebar-accent overflow-hidden">
                          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${Math.min((counts.confirmed / ev.max_guests) * 100, 100)}%` }} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sidebar-foreground font-medium">
                    ${gross.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-4">{statusBadge(ev.status)}</td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      {ev.status === "active" && (
                        <button
                          onClick={() => runFollowUp(ev.id, ev.name)}
                          disabled={followUpLoading === ev.id}
                          title="Run Post-Event Follow-Up"
                          className="p-1.5 rounded-lg hover:bg-emerald-500/10 transition-colors text-sidebar-foreground/40 hover:text-emerald-400 disabled:opacity-50"
                        >
                          {followUpLoading === ev.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                      )}
                      <button
                        onClick={() => setEventModal({ open: true, event: ev })}
                        className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground/40 hover:text-sidebar-foreground"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ open: true, id: ev.id })}
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
                <td colSpan={5} className="px-5 py-12 text-center text-sidebar-foreground/30">
                  No events found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((ev) => {
          const counts = guestCounts[ev.id as keyof typeof guestCounts] as { total: number; confirmed: number } | undefined;
          const gross = (orderTotals as Record<string, number>)[ev.id] || 0;
          const eventDate = ev.date ? new Date(ev.date + "T00:00:00") : null;
          const monthStr = eventDate ? eventDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase() : "";
          const dayStr = eventDate ? eventDate.getDate().toString().padStart(2, "0") : "";

          return (
            <div key={ev.id} onClick={() => window.open(`/event/${ev.id}`, "_blank")} className="rounded-xl border border-sidebar-border p-4 bg-sidebar-accent/20 cursor-pointer hover:bg-sidebar-accent/40 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex flex-col items-center justify-center w-12 shrink-0">
                  {eventDate ? (
                    <>
                      <span className="text-[10px] font-semibold tracking-wider text-orange-400 uppercase leading-none">{monthStr}</span>
                      <span className="text-xl font-bold text-sidebar-foreground leading-tight">{dayStr}</span>
                    </>
                  ) : (
                    <span className="text-sidebar-foreground/30 text-xs">TBD</span>
                  )}
                </div>
                {ev.cover_image ? (
                  <img src={ev.cover_image} alt={ev.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-sidebar-accent flex items-center justify-center shrink-0">
                    <span className="text-sidebar-foreground/30 text-lg font-serif">{ev.name.charAt(0)}</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sidebar-foreground font-medium text-sm truncate">{ev.name}</p>
                  <p className="text-sidebar-foreground/40 text-xs truncate">{ev.location || "No location"}</p>
                </div>
                {statusBadge(ev.status)}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-sidebar-foreground/60">
                  <span>RSVPs: {counts ? `${counts.confirmed}/${counts.total}` : "0"}/{ev.max_guests}</span>
                  <span className="text-sidebar-foreground font-medium">${gross.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setEventModal({ open: true, event: ev })}
                    className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground/40 hover:text-sidebar-foreground"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ open: true, id: ev.id })}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-sidebar-foreground/40 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-sidebar-foreground/30 py-12">No events found</p>
        )}
      </div>

      <EventForm open={eventModal.open} onClose={() => setEventModal({ open: false })} event={eventModal.event} />
      <DeleteConfirm
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: "" })}
        table="events" id={deleteModal.id} label="Event" queryKey="admin-events"
      />
    </AdminLayout>
  );
};

export default AdminEvents;
