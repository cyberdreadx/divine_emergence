import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, Plus, Download, Pencil, Trash2, CheckCircle, XCircle, Clock, Users, UserCheck, UserX, AlertCircle } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import GuestForm from "@/components/admin/GuestForm";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "checked_in", label: "Checked In" },
  { value: "declined", label: "Declined" },
  { value: "waitlisted", label: "Waitlisted" },
  { value: "no_show", label: "No Show" },
  { value: "attended", label: "Attended" },
];

const AdminGuests = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");
  const [guestModal, setGuestModal] = useState<{ open: boolean; guest?: any }>({ open: false });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string }>({ open: false, id: "" });
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set());

  const { data: guests = [] } = useQuery({
    queryKey: ["admin-guests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("guests").select("*, events(name)").order("last_name", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: events = [] } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = async (id: string, status: string) => {
    const updateData: Record<string, any> = { status };
    if (status === "checked_in") updateData.check_in_time = new Date().toISOString();
    const { error } = await supabase.from("guests").update(updateData).eq("id", id);
    if (error) { toast.error("Failed"); return; }
    toast.success(`Guest ${status.replace("_", " ")}`);
    queryClient.invalidateQueries({ queryKey: ["admin-guests"] });
  };

  const bulkUpdateStatus = async (status: string) => {
    if (bulkSelected.size === 0) return;
    const ids = Array.from(bulkSelected);
    const { error } = await supabase.from("guests").update({ status }).in("id", ids);
    if (error) { toast.error("Bulk update failed"); return; }
    toast.success(`${ids.length} guest(s) → ${status.replace("_", " ")}`);
    setBulkSelected(new Set());
    queryClient.invalidateQueries({ queryKey: ["admin-guests"] });
  };

  const filtered = guests
    .filter((g) => statusFilter === "all" || g.status === statusFilter)
    .filter((g) => eventFilter === "all" || g.event_id === eventFilter)
    .filter((g) => `${g.first_name} ${g.last_name} ${g.email} ${g.company}`.toLowerCase().includes(search.toLowerCase()));

  const totalCount = guests.length;
  const pendingCount = guests.filter((g) => g.status === "pending").length;
  const confirmedCount = guests.filter((g) => g.status === "confirmed").length;
  const checkedInCount = guests.filter((g) => g.status === "checked_in" || g.status === "attended").length;

  const statusColor = (s: string) => {
    switch (s) {
      case "confirmed": return "default";
      case "checked_in": case "attended": return "default";
      case "pending": return "secondary";
      case "waitlisted": return "outline";
      case "declined": case "no_show": return "destructive";
      default: return "secondary";
    }
  };

  const toggleBulk = (id: string) => {
    const next = new Set(bulkSelected);
    next.has(id) ? next.delete(id) : next.add(id);
    setBulkSelected(next);
  };

  const toggleAll = () => {
    if (bulkSelected.size === filtered.length) {
      setBulkSelected(new Set());
    } else {
      setBulkSelected(new Set(filtered.map((g) => g.id)));
    }
  };

  const exportCSV = () => {
    if (!filtered.length) return;
    const headers = ["first_name", "last_name", "email", "phone", "company", "dietary_requirements", "status", "rsvp_date", "check_in_time"];
    const csv = [headers.join(","), ...filtered.map((r: any) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `guests-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Exported!");
  };

  return (
    <AdminLayout title="Guests">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Total Guests</p>
          <p className="text-2xl font-semibold text-foreground flex items-center gap-1.5">
            <Users className="h-5 w-5 text-primary" />
            {totalCount}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-semibold text-foreground flex items-center gap-1.5">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            {pendingCount}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Confirmed</p>
          <p className="text-2xl font-semibold text-foreground flex items-center gap-1.5">
            <UserCheck className="h-5 w-5 text-green-500" />
            {confirmedCount}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Checked In</p>
          <p className="text-2xl font-semibold text-foreground flex items-center gap-1.5">
            <CheckCircle className="h-5 w-5 text-primary" />
            {checkedInCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email, or company"
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
            {events.map((e) => (
              <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5">
          <Download className="h-4 w-4" /> Export
        </Button>

        <Button size="sm" onClick={() => setGuestModal({ open: true })} className="gap-1.5">
          <Plus className="h-4 w-4" /> Add Guest
        </Button>
      </div>

      {/* Bulk Actions */}
      {bulkSelected.size > 0 && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-lg bg-muted border border-border">
          <span className="text-sm text-foreground">{bulkSelected.size} selected</span>
          <div className="flex gap-2 ml-auto">
            <Button size="sm" variant="outline" onClick={() => bulkUpdateStatus("confirmed")} className="gap-1 text-green-600">
              <CheckCircle className="w-3.5 h-3.5" /> Approve
            </Button>
            <Button size="sm" variant="outline" onClick={() => bulkUpdateStatus("waitlisted")} className="gap-1 text-blue-600">
              <Clock className="w-3.5 h-3.5" /> Waitlist
            </Button>
            <Button size="sm" variant="outline" onClick={() => bulkUpdateStatus("declined")} className="gap-1 text-destructive">
              <XCircle className="w-3.5 h-3.5" /> Decline
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input type="checkbox" checked={bulkSelected.size === filtered.length && filtered.length > 0} onChange={toggleAll}
                  className="rounded border-border" />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No guests found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((g) => (
                <TableRow key={g.id} className={g.status === "pending" ? "bg-yellow-500/5" : ""}>
                  <TableCell>
                    <input type="checkbox" checked={bulkSelected.has(g.id)} onChange={() => toggleBulk(g.id)}
                      className="rounded border-border" />
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{g.first_name} {g.last_name}</p>
                    {g.dietary_requirements && (
                      <p className="text-yellow-600 text-[10px] mt-0.5">{g.dietary_requirements}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{g.email}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {(g as any).events?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{g.company || "—"}</TableCell>
                  <TableCell>
                    <Select value={g.status} onValueChange={(v) => updateStatus(g.id, v)}>
                      <SelectTrigger className="h-7 w-[120px] text-xs">
                        <Badge variant={statusColor(g.status) as any} className="capitalize text-[10px]">
                          {g.status.replace("_", " ")}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.filter((s) => s.value !== "all").map((s) => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {g.status === "pending" && (
                        <>
                          <Button size="icon" variant="ghost" onClick={() => updateStatus(g.id, "confirmed")} title="Approve"
                            className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-500/10">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => updateStatus(g.id, "declined")} title="Decline"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button size="icon" variant="ghost" onClick={() => setGuestModal({ open: true, guest: g })}
                        className="h-7 w-7">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setDeleteModal({ open: true, id: g.id })}
                        className="h-7 w-7 text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">No guests found</p>
        ) : (
          filtered.map((g) => (
            <div key={g.id} className={`rounded-xl border p-4 ${g.status === "pending" ? "border-yellow-500/30 bg-yellow-500/5" : "border-border"}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm">{g.first_name} {g.last_name}</p>
                  <p className="text-muted-foreground text-xs truncate">{g.email}</p>
                  {g.company && <p className="text-muted-foreground text-xs">{g.company}</p>}
                </div>
                <Badge variant={statusColor(g.status) as any} className="capitalize text-[10px] shrink-0">
                  {g.status.replace("_", " ")}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-xs">{(g as any).events?.name ?? "No event"}</p>
                <div className="flex items-center gap-1">
                  {g.status === "pending" && (
                    <>
                      <Button size="icon" variant="ghost" onClick={() => updateStatus(g.id, "confirmed")}
                        className="h-7 w-7 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => updateStatus(g.id, "declined")}
                        className="h-7 w-7 text-destructive">
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <Button size="icon" variant="ghost" onClick={() => setGuestModal({ open: true, guest: g })}
                    className="h-7 w-7">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeleteModal({ open: true, id: g.id })}
                    className="h-7 w-7 text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <GuestForm open={guestModal.open} onClose={() => setGuestModal({ open: false })} guest={guestModal.guest} events={events} />
      <DeleteConfirm open={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: "" })}
        table="guests" id={deleteModal.id} label="Guest" queryKey="admin-guests" />
    </AdminLayout>
  );
};

export default AdminGuests;
