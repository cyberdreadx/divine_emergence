import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Users, Calendar, CheckCircle, Clock, AlertCircle, TrendingUp,
  ArrowRight, UserCheck, Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { data: events = [] } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: guests = [] } = useQuery({
    queryKey: ["admin-guests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("guests").select("id, status, event_id");
      if (error) throw error;
      return data;
    },
  });

  const { data: partners = [] } = useQuery({
    queryKey: ["admin-partners"],
    queryFn: async () => {
      const { data, error } = await supabase.from("partners").select("id, company_name, status");
      if (error) throw error;
      return data;
    },
  });

  const { data: deliverables = [] } = useQuery({
    queryKey: ["admin-deliverables-dash"],
    queryFn: async () => {
      const { data, error } = await supabase.from("deliverables").select("id, status");
      if (error) throw error;
      return data;
    },
  });

  const activeEvents = events.filter((e) => e.status === "active");
  const nextEvent = activeEvents.find((e) => e.date) || activeEvents[0];
  const pendingGuests = guests.filter((g) => g.status === "pending").length;
  const confirmedGuests = guests.filter((g) => g.status === "confirmed").length;
  const checkedInGuests = guests.filter((g) => g.status === "checked_in").length;
  const totalGuests = guests.length;
  const pendingDeliverables = deliverables.filter((d) => d.status === "pending").length;
  const activePartners = partners.filter((p) => p.status === "active").length;

  const nextEventGuests = nextEvent
    ? guests.filter((g) => g.event_id === nextEvent.id)
    : [];
  const nextEventCapacity = nextEvent?.max_guests || 100;
  const nextEventConfirmed = nextEventGuests.filter((g) =>
    ["confirmed", "checked_in"].includes(g.status)
  ).length;
  const capacityPercent = Math.round((nextEventConfirmed / nextEventCapacity) * 100);

  const stats = [
    { label: "Total RSVPs", value: totalGuests, icon: Users, color: "text-sidebar-foreground" },
    { label: "Pending Approval", value: pendingGuests, icon: AlertCircle, color: "text-yellow-400", urgent: pendingGuests > 0 },
    { label: "Confirmed", value: confirmedGuests, icon: CheckCircle, color: "text-green-400" },
    { label: "Checked In", value: checkedInGuests, icon: UserCheck, color: "text-emerald-400" },
    { label: "Active Partners", value: activePartners, icon: TrendingUp, color: "text-blue-400" },
    { label: "Pending Deliverables", value: pendingDeliverables, icon: Package, color: "text-orange-400" },
  ];

  const quickLinks = [
    { label: "Approve Guests", desc: `${pendingGuests} pending`, path: "/admin/guests", show: pendingGuests > 0 },
    { label: "Manage Events", desc: `${events.length} total`, path: "/admin/events", show: true },
    
    { label: "Partner Deliverables", desc: `${pendingDeliverables} pending`, path: "/admin/deliverables", show: true },
    { label: "Check-In", desc: "Open check-in view", path: "/checkin", show: !!nextEvent },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Next Event Banner */}
      {nextEvent && (
        <div className="mb-8 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-sidebar-accent to-sidebar-accent/50 border border-sidebar-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sidebar-foreground/40 text-xs uppercase tracking-wider mb-1">Next Event</p>
              <h2 className="text-sidebar-foreground font-serif text-xl">{nextEvent.name}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-sidebar-foreground/60">
                {nextEvent.date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(nextEvent.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </span>
                )}
                {(nextEvent as any).time && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {(() => {
                      const [h, m] = (nextEvent as any).time.split(":");
                      const hour = parseInt(h);
                      return `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:${m} ${hour < 12 ? "AM" : "PM"}`;
                    })()}
                  </span>
                )}
                {nextEvent.location && (
                  <span className="truncate max-w-[200px]">{nextEvent.location}</span>
                )}
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-3xl font-serif text-sidebar-foreground">
                {nextEventConfirmed}<span className="text-sidebar-foreground/30">/{nextEventCapacity}</span>
              </p>
              <div className="w-32 h-2 rounded-full bg-sidebar-border mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(capacityPercent, 100)}%`,
                    backgroundColor: capacityPercent > 90 ? "hsl(0, 72%, 51%)" : capacityPercent > 70 ? "hsl(45, 93%, 47%)" : "hsl(142, 71%, 45%)",
                  }}
                />
              </div>
              <p className="text-sidebar-foreground/30 text-xs mt-1">{capacityPercent}% capacity</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 text-center transition-colors ${
            s.urgent ? "border-yellow-500/30 bg-yellow-500/5" : "border-sidebar-border bg-sidebar-accent/30"
          }`}>
            <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
            <p className="text-2xl font-serif text-sidebar-foreground">{s.value}</p>
            <p className="text-sidebar-foreground/30 text-[10px] uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-sidebar-foreground/40 text-xs font-medium uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.filter((l) => l.show).map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="flex items-center justify-between p-4 rounded-xl border border-[#022701]/30 hover:bg-sidebar-accent/30 transition-colors text-left group"
            >
              <div>
                <p className="text-sidebar-foreground font-medium text-sm">{link.label}</p>
                <p className="text-sidebar-foreground/40 text-xs mt-0.5">{link.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-sidebar-foreground/20 group-hover:text-sidebar-foreground/50 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
