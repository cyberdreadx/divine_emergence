import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, Download, DollarSign, CalendarDays, Plus } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminModal from "@/components/admin/AdminModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { format, subDays, subMonths, startOfDay, isAfter } from "date-fns";

const DATE_RANGES = [
  { label: "Past 7 days", value: "7d" },
  { label: "Past 30 days", value: "30d" },
  { label: "Past 3 months", value: "3m" },
  { label: "Past 6 months", value: "6m" },
  { label: "All time", value: "all" },
] as const;

const STATUS_OPTIONS = ["all", "completed", "pending", "refunded", "cancelled"] as const;
const TICKET_TYPES = ["general", "vip", "early_bird", "comp", "sponsor"] as const;
const PAYMENT_METHODS = ["manual", "cash", "card", "transfer", "comp"] as const;

function getDateCutoff(range: string): Date | null {
  const now = new Date();
  switch (range) {
    case "7d": return subDays(now, 7);
    case "30d": return subDays(now, 30);
    case "3m": return subMonths(now, 3);
    case "6m": return subMonths(now, 6);
    default: return null;
  }
}

const emptyForm = {
  purchaser_name: "",
  purchaser_email: "",
  event_id: "",
  ticket_type: "general",
  quantity: 1,
  unit_price: 0,
  status: "completed",
  payment_method: "manual",
  notes: "",
};

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("3m");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const { data: events } = useQuery({
    queryKey: ["admin-events-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("events")
        .select("id, name")
        .order("date", { ascending: false });
      return data ?? [];
    },
  });

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders", dateRange, statusFilter, eventFilter, search],
    queryFn: async () => {
      let q = supabase
        .from("orders")
        .select("*, events(name)")
        .order("created_at", { ascending: false });

      const cutoff = getDateCutoff(dateRange);
      if (cutoff) q = q.gte("created_at", cutoff.toISOString());
      if (statusFilter !== "all") q = q.eq("status", statusFilter);
      if (eventFilter !== "all") q = q.eq("event_id", eventFilter);
      if (search) {
        q = q.or(`purchaser_name.ilike.%${search}%,purchaser_email.ilike.%${search}%,order_number.ilike.%${search}%`);
      }

      const { data } = await q;
      return data ?? [];
    },
  });

  const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total_amount), 0) ?? 0;
  const todayCutoff = startOfDay(new Date());
  const todayRevenue = orders
    ?.filter((o) => isAfter(new Date(o.created_at), todayCutoff))
    .reduce((sum, o) => sum + Number(o.total_amount), 0) ?? 0;
  const completedCount = orders?.filter((o) => o.status === "completed").length ?? 0;

  const openCreate = () => {
    setForm({ ...emptyForm });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.purchaser_name.trim() || !form.purchaser_email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setSaving(true);
    const total = form.quantity * form.unit_price;
    const { error } = await supabase.from("orders").insert({
      purchaser_name: form.purchaser_name.trim(),
      purchaser_email: form.purchaser_email.trim(),
      event_id: form.event_id || null,
      ticket_type: form.ticket_type,
      quantity: form.quantity,
      unit_price: form.unit_price,
      total_amount: total,
      status: form.status,
      payment_method: form.payment_method,
      notes: form.notes.trim() || null,
    });
    setSaving(false);
    if (error) {
      toast.error("Failed to create order");
      return;
    }
    toast.success("Order created");
    setModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  const exportCSV = () => {
    if (!orders?.length) return;
    const headers = ["Order #", "Purchaser", "Email", "Event", "Type", "Qty", "Amount", "Status", "Date"];
    const rows = orders.map((o) => [
      o.order_number,
      o.purchaser_name,
      o.purchaser_email,
      (o as any).events?.name ?? "",
      o.ticket_type,
      o.quantity,
      `$${Number(o.total_amount).toFixed(2)}`,
      o.status,
      format(new Date(o.created_at), "MMM d, yyyy h:mm a"),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "completed": return "default";
      case "pending": return "secondary";
      case "refunded": return "outline";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <AdminLayout title="Orders">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-2xl font-semibold text-foreground flex items-center gap-1.5">
            <DollarSign className="h-5 w-5 text-primary" />
            {totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Today</p>
          <p className="text-2xl font-semibold text-foreground flex items-center gap-1.5">
            <DollarSign className="h-5 w-5 text-primary" />
            {todayRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Completed Orders</p>
          <p className="text-2xl font-semibold text-foreground">{completedCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search order #, name, or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={eventFilter} onValueChange={setEventFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            {events?.map((e) => (
              <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[160px]">
            <CalendarDays className="h-4 w-4 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            {DATE_RANGES.map((r) => (
              <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5">
          <Download className="h-4 w-4" /> Export
        </Button>

        <Button size="sm" onClick={openCreate} className="gap-1.5">
          <Plus className="h-4 w-4" /> New Order
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Purchaser</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  Loading orders…
                </TableCell>
              </TableRow>
            ) : !orders?.length ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  You don't have any orders yet
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.order_number}</TableCell>
                  <TableCell>{order.purchaser_name}</TableCell>
                  <TableCell className="text-muted-foreground">{order.purchaser_email}</TableCell>
                  <TableCell>{(order as any).events?.name ?? "—"}</TableCell>
                  <TableCell className="capitalize">{order.ticket_type}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${Number(order.total_amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {format(new Date(order.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColor(order.status) as any} className="capitalize">
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Order Modal */}
      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="New Order">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Purchaser Name *</Label>
              <Input
                value={form.purchaser_name}
                onChange={(e) => set("purchaser_name", e.target.value)}
                placeholder="Full name"
                maxLength={100}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input
                type="email"
                value={form.purchaser_email}
                onChange={(e) => set("purchaser_email", e.target.value)}
                placeholder="email@example.com"
                maxLength={255}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Event</Label>
            <Select value={form.event_id} onValueChange={(v) => set("event_id", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select event (optional)" />
              </SelectTrigger>
              <SelectContent>
                {events?.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Ticket Type</Label>
              <Select value={form.ticket_type} onValueChange={(v) => set("ticket_type", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TICKET_TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">
                      {t.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Payment Method</Label>
              <Select value={form.payment_method} onValueChange={(v) => set("payment_method", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m} value={m} className="capitalize">{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Quantity</Label>
              <Input
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) => set("quantity", Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Unit Price ($)</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={form.unit_price}
                onChange={(e) => set("unit_price", Math.max(0, parseFloat(e.target.value) || 0))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Total</Label>
              <div className="h-10 flex items-center rounded-md border border-input bg-muted/30 px-3 text-sm font-medium">
                ${(form.quantity * form.unit_price).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set("status", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["completed", "pending", "refunded", "cancelled"] as const).map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Optional notes…"
              maxLength={500}
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Create Order"}
            </Button>
          </div>
        </div>
      </AdminModal>
    </AdminLayout>
  );
};

export default AdminOrders;
