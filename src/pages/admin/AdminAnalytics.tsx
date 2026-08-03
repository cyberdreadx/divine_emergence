import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  DollarSign, Users, UserCheck, TrendingUp, Handshake, Package,
  Calendar, BarChart3,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from "recharts";

const COLORS = ["#022701", "#4a7c4b", "#8bb88c", "#c6d2c1"];

const AdminAnalytics = () => {
  const { data: events = [] } = useQuery({
    queryKey: ["analytics-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: guests = [] } = useQuery({
    queryKey: ["analytics-guests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("guests").select("id, status, event_id, check_in_time, rsvp_date");
      if (error) throw error;
      return data;
    },
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["analytics-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("id, total_amount, status, event_id, ticket_type, created_at, quantity");
      if (error) throw error;
      return data;
    },
  });

  const { data: partners = [] } = useQuery({
    queryKey: ["analytics-partners"],
    queryFn: async () => {
      const { data, error } = await supabase.from("partners").select("id, status, tier, monetary_value, quantity");
      if (error) throw error;
      return data;
    },
  });

  const { data: deliverables = [] } = useQuery({
    queryKey: ["analytics-deliverables"],
    queryFn: async () => {
      const { data, error } = await supabase.from("deliverables").select("id, status");
      if (error) throw error;
      return data;
    },
  });

  // --- Computed metrics ---
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const totalTicketsSold = orders.reduce((sum, o) => sum + (o.quantity || 1), 0);
  const totalGuests = guests.length;
  const checkedIn = guests.filter((g) => g.status === "checked_in").length;
  const checkInRate = totalGuests > 0 ? Math.round((checkedIn / totalGuests) * 100) : 0;
  const activePartners = partners.filter((p) => p.status === "active").length;
  const partnerValue = partners.reduce((sum, p) => sum + Number(p.monetary_value || 0), 0);

  // --- Revenue by event ---
  const revenueByEvent = events
    .filter((e) => e.status !== "draft")
    .map((e) => {
      const eventOrders = orders.filter((o) => o.event_id === e.id);
      return {
        name: e.name.length > 18 ? e.name.slice(0, 18) + "…" : e.name,
        revenue: eventOrders.reduce((s, o) => s + Number(o.total_amount || 0), 0),
        tickets: eventOrders.reduce((s, o) => s + (o.quantity || 1), 0),
      };
    })
    .filter((e) => e.revenue > 0 || e.tickets > 0);

  // --- Guest status breakdown ---
  const statusCounts = [
    { name: "Confirmed", value: guests.filter((g) => g.status === "confirmed").length },
    { name: "Checked In", value: checkedIn },
    { name: "Pending", value: guests.filter((g) => g.status === "pending").length },
    { name: "Cancelled", value: guests.filter((g) => g.status === "cancelled").length },
  ].filter((s) => s.value > 0);

  // --- Partner tier breakdown ---
  const tierCounts: Record<string, number> = {};
  partners.forEach((p) => {
    const t = p.tier || "other";
    tierCounts[t] = (tierCounts[t] || 0) + 1;
  });
  const tierData = Object.entries(tierCounts).map(([name, value]) => ({ name, value }));

  // --- Deliverables status ---
  const delCompleted = deliverables.filter((d) => d.status === "completed").length;
  const delPending = deliverables.filter((d) => d.status === "pending").length;
  const delInProgress = deliverables.filter((d) => d.status === "in_progress").length;

  // --- Check-in rate per event ---
  const checkInByEvent = events
    .filter((e) => e.status !== "draft")
    .map((e) => {
      const eg = guests.filter((g) => g.event_id === e.id);
      const ci = eg.filter((g) => g.status === "checked_in").length;
      return {
        name: e.name.length > 18 ? e.name.slice(0, 18) + "…" : e.name,
        rate: eg.length > 0 ? Math.round((ci / eg.length) * 100) : 0,
        checkedIn: ci,
        total: eg.length,
      };
    })
    .filter((e) => e.total > 0);

  const kpis = [
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-500" },
    { label: "Tickets Sold", value: totalTicketsSold, icon: BarChart3, color: "text-blue-400" },
    { label: "Total RSVPs", value: totalGuests, icon: Users, color: "text-sidebar-foreground" },
    { label: "Check-In Rate", value: `${checkInRate}%`, icon: UserCheck, color: "text-emerald-400" },
    { label: "Active Partners", value: activePartners, icon: Handshake, color: "text-purple-400" },
    { label: "Partner Value", value: `$${partnerValue.toLocaleString()}`, icon: TrendingUp, color: "text-amber-400" },
  ];

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: "hsl(108 16% 90%)",
      border: "1px solid hsl(80 15% 80%)",
      borderRadius: "8px",
      color: "#022701",
      fontSize: "12px",
    },
  };

  return (
    <AdminLayout title="Analytics">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-sidebar-border bg-sidebar-accent/30 p-4 text-center">
            <k.icon className={`w-5 h-5 mx-auto mb-2 ${k.color}`} />
            <p className="text-2xl font-serif text-sidebar-foreground">{k.value}</p>
            <p className="text-sidebar-foreground/30 text-[10px] uppercase tracking-wider mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue by Event */}
        <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/20 p-5">
          <h3 className="text-sidebar-foreground text-sm font-medium mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Revenue by Event
          </h3>
          {revenueByEvent.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueByEvent}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(80 15% 80%)" />
                <XAxis dataKey="name" tick={{ fill: "#022701", fontSize: 10 }} />
                <YAxis tick={{ fill: "#022701", fontSize: 10 }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="revenue" fill="#022701" radius={[4, 4, 0, 0]} name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sidebar-foreground/30 text-sm text-center py-10">No revenue data yet</p>
          )}
        </div>

        {/* Check-In Rate by Event */}
        <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/20 p-5">
          <h3 className="text-sidebar-foreground text-sm font-medium mb-4 flex items-center gap-2">
            <UserCheck className="w-4 h-4" /> Check-In Rate by Event
          </h3>
          {checkInByEvent.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={checkInByEvent}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(80 15% 80%)" />
                <XAxis dataKey="name" tick={{ fill: "#022701", fontSize: 10 }} />
                <YAxis tick={{ fill: "#022701", fontSize: 10 }} unit="%" />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="rate" fill="#4a7c4b" radius={[4, 4, 0, 0]} name="Check-In Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sidebar-foreground/30 text-sm text-center py-10">No check-in data yet</p>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Guest Status */}
        <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/20 p-5">
          <h3 className="text-sidebar-foreground text-sm font-medium mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" /> Guest Breakdown
          </h3>
          {statusCounts.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={statusCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                    {statusCounts.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {statusCounts.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-1.5 text-[10px] text-sidebar-foreground/60">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    {s.name} ({s.value})
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sidebar-foreground/30 text-sm text-center py-10">No guest data yet</p>
          )}
        </div>

        {/* Partner Tiers */}
        <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/20 p-5">
          <h3 className="text-sidebar-foreground text-sm font-medium mb-4 flex items-center gap-2">
            <Handshake className="w-4 h-4" /> Partner Tiers
          </h3>
          {tierData.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={tierData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                    {tierData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {tierData.map((t, i) => (
                  <div key={t.name} className="flex items-center gap-1.5 text-[10px] text-sidebar-foreground/60">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    {t.name} ({t.value})
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sidebar-foreground/30 text-sm text-center py-10">No partner data yet</p>
          )}
        </div>

        {/* Deliverables Status */}
        <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/20 p-5">
          <h3 className="text-sidebar-foreground text-sm font-medium mb-4 flex items-center gap-2">
            <Package className="w-4 h-4" /> Deliverables
          </h3>
          <div className="space-y-4 mt-6">
            {[
              { label: "Completed", value: delCompleted, color: "#022701" },
              { label: "In Progress", value: delInProgress, color: "#4a7c4b" },
              { label: "Pending", value: delPending, color: "#c6d2c1" },
            ].map((d) => {
              const total = deliverables.length || 1;
              return (
                <div key={d.label}>
                  <div className="flex justify-between text-[11px] text-sidebar-foreground/60 mb-1">
                    <span>{d.label}</span>
                    <span>{d.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-sidebar-border overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(d.value / total) * 100}%`, backgroundColor: d.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tickets by Event Table */}
      <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/20 p-5">
        <h3 className="text-sidebar-foreground text-sm font-medium mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Event Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-sidebar-foreground/40 text-[10px] uppercase tracking-wider border-b border-sidebar-border">
                <th className="text-left py-2 font-medium">Event</th>
                <th className="text-right py-2 font-medium">RSVPs</th>
                <th className="text-right py-2 font-medium">Checked In</th>
                <th className="text-right py-2 font-medium">Rate</th>
                <th className="text-right py-2 font-medium">Tickets</th>
                <th className="text-right py-2 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {events.filter((e) => e.status !== "draft").map((e) => {
                const eg = guests.filter((g) => g.event_id === e.id);
                const ci = eg.filter((g) => g.status === "checked_in").length;
                const eo = orders.filter((o) => o.event_id === e.id);
                const rev = eo.reduce((s, o) => s + Number(o.total_amount || 0), 0);
                const tix = eo.reduce((s, o) => s + (o.quantity || 1), 0);
                return (
                  <tr key={e.id} className="border-b border-sidebar-border/50 text-sidebar-foreground">
                    <td className="py-2.5 font-medium">{e.name}</td>
                    <td className="py-2.5 text-right">{eg.length}</td>
                    <td className="py-2.5 text-right">{ci}</td>
                    <td className="py-2.5 text-right">{eg.length > 0 ? Math.round((ci / eg.length) * 100) : 0}%</td>
                    <td className="py-2.5 text-right">{tix}</td>
                    <td className="py-2.5 text-right">${rev.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {events.filter((e) => e.status !== "draft").length === 0 && (
            <p className="text-sidebar-foreground/30 text-sm text-center py-6">No events to display</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
