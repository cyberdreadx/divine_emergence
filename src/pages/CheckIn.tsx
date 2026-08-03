import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Users, Loader2, WifiOff, Wifi, CheckSquare, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CheckInHeader from "@/components/checkin/CheckInHeader";
import GuestRow from "@/components/checkin/GuestRow";
import QrScanner from "@/components/checkin/QrScanner";
import ActivityFeed, { type ActivityEntry } from "@/components/checkin/ActivityFeed";
import WalkInModal from "@/components/checkin/WalkInModal";
import { useRequireAuth } from "@/hooks/useAuth";

// 9. Sound feedback helper
const playCheckInSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  } catch {}
};

type FilterTab = "all" | "checked_in" | "not_arrived" | "vip";

const CheckIn = () => {
  useRequireAuth("admin");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [checkingIn, setCheckingIn] = useState<string | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [walkInOpen, setWalkInOpen] = useState(false);
  const [walkInLoading, setWalkInLoading] = useState(false);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set());

  // 8. Offline mode detection
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Sync offline queue when back online
  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      offlineQueue.forEach((id) => performCheckIn(id));
      setOfflineQueue([]);
      toast.success(`Synced ${offlineQueue.length} queued check-ins`);
    }
  }, [isOnline]);

  // 1. Fetch all active events for dropdown
  const { data: allEvents = [] } = useQuery({
    queryKey: ["checkin-all-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id, name, date, max_guests")
        .eq("status", "active")
        .order("date", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  // Auto-select first event
  useEffect(() => {
    if (allEvents.length > 0 && !selectedEventId) {
      setSelectedEventId(allEvents[0].id);
    }
  }, [allEvents, selectedEventId]);

  const activeEvent = useMemo(
    () => allEvents.find((e: any) => e.id === selectedEventId) || allEvents[0],
    [allEvents, selectedEventId]
  );

  const { data: guests = [], isLoading } = useQuery({
    queryKey: ["checkin-guests", activeEvent?.id],
    queryFn: async () => {
      if (!activeEvent?.id) return [];
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .eq("event_id", activeEvent.id)
        .order("last_name", { ascending: true })
        .order("first_name", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!activeEvent?.id,
    refetchInterval: 10000,
  });

  // Fetch ticket tiers for enriched guest info
  const { data: ticketTiers = [] } = useQuery({
    queryKey: ["checkin-tiers", activeEvent?.id],
    queryFn: async () => {
      if (!activeEvent?.id) return [];
      const { data } = await supabase.from("ticket_tiers").select("id, name").eq("event_id", activeEvent.id);
      return data || [];
    },
    enabled: !!activeEvent?.id,
  });

  // Fetch orders to map guests to ticket tiers
  const { data: orders = [] } = useQuery({
    queryKey: ["checkin-orders", activeEvent?.id],
    queryFn: async () => {
      if (!activeEvent?.id) return [];
      const { data } = await supabase.from("orders").select("guest_id, ticket_type").eq("event_id", activeEvent.id);
      return data || [];
    },
    enabled: !!activeEvent?.id,
  });

  const guestTicketMap = useMemo(() => {
    const m: Record<string, string> = {};
    orders.forEach((o: any) => { if (o.guest_id) m[o.guest_id] = o.ticket_type; });
    return m;
  }, [orders]);

  useEffect(() => {
    if (!activeEvent?.id) return;
    const channel = supabase
      .channel("checkin-realtime")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "guests", filter: `event_id=eq.${activeEvent.id}` }, () => {
        queryClient.invalidateQueries({ queryKey: ["checkin-guests", activeEvent.id] });
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "guests", filter: `event_id=eq.${activeEvent.id}` }, () => {
        queryClient.invalidateQueries({ queryKey: ["checkin-guests", activeEvent.id] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeEvent?.id, queryClient]);

  const stats = useMemo(() => {
    const checkedIn = guests.filter((g: any) => g.status === "checked_in").length;
    const confirmed = guests.filter((g: any) => g.status === "confirmed").length;
    return { checkedIn, confirmed, total: guests.length, capacity: activeEvent?.max_guests || 100 };
  }, [guests, activeEvent]);

  // 4. Filter tabs
  const filtered = useMemo(() => {
    let list = guests;
    if (filterTab === "checked_in") list = list.filter((g: any) => g.status === "checked_in");
    else if (filterTab === "not_arrived") list = list.filter((g: any) => g.status !== "checked_in");
    else if (filterTab === "vip") list = list.filter((g: any) => guestTicketMap[g.id]?.toLowerCase().includes("vip"));

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((g: any) =>
        `${g.first_name} ${g.last_name} ${g.email} ${g.company || ""}`.toLowerCase().includes(q)
      );
    }
    return list;
  }, [guests, search, filterTab, guestTicketMap]);

  const addActivity = useCallback((name: string, type: "check_in" | "undo") => {
    setActivityLog((prev) => [{ id: crypto.randomUUID(), name, time: new Date(), type }, ...prev].slice(0, 50));
  }, []);

  const performCheckIn = useCallback(async (guestId: string) => {
    const guest = guests.find((g: any) => g.id === guestId);
    if (!guest || guest.status === "checked_in") {
      if (guest?.status === "checked_in") toast.info(`${guest.first_name} is already checked in`);
      return;
    }

    // 8. Offline queue
    if (!navigator.onLine) {
      setOfflineQueue((prev) => [...prev, guestId]);
      toast.info(`Queued ${guest.first_name} for check-in (offline)`);
      return;
    }

    setCheckingIn(guestId);
    try {
      const { error } = await supabase
        .from("guests")
        .update({ status: "checked_in", check_in_time: new Date().toISOString() })
        .eq("id", guestId);
      if (error) throw error;
      playCheckInSound(); // 9. Sound feedback
      toast.success(`${guest.first_name} ${guest.last_name} checked in!`);
      addActivity(`${guest.first_name} ${guest.last_name}`, "check_in");
      queryClient.invalidateQueries({ queryKey: ["checkin-guests", activeEvent?.id] });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCheckingIn(null);
    }
  }, [guests, activeEvent?.id, queryClient, addActivity]);

  const handleUndoCheckIn = useCallback(async (guest: any) => {
    setCheckingIn(guest.id);
    try {
      const { error } = await supabase
        .from("guests")
        .update({ status: "confirmed", check_in_time: null })
        .eq("id", guest.id);
      if (error) throw error;
      toast.success(`Reverted ${guest.first_name}'s check-in`);
      addActivity(`${guest.first_name} ${guest.last_name}`, "undo");
      queryClient.invalidateQueries({ queryKey: ["checkin-guests", activeEvent?.id] });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCheckingIn(null);
    }
  }, [activeEvent?.id, queryClient, addActivity]);

  const handleQrScan = useCallback((guestId: string) => {
    performCheckIn(guestId);
  }, [performCheckIn]);

  // 2. Walk-in add
  const handleAddWalkIn = useCallback(async (guestData: any) => {
    if (!activeEvent?.id) return;
    setWalkInLoading(true);
    try {
      const { data, error } = await supabase
        .from("guests")
        .insert({
          ...guestData,
          event_id: activeEvent.id,
          status: "checked_in",
          check_in_time: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      playCheckInSound();
      toast.success(`${guestData.first_name} added & checked in!`);
      addActivity(`${guestData.first_name} ${guestData.last_name}`, "check_in");
      queryClient.invalidateQueries({ queryKey: ["checkin-guests", activeEvent.id] });
      setWalkInOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setWalkInLoading(false);
    }
  }, [activeEvent?.id, queryClient, addActivity]);

  // 5. Bulk check-in
  const handleBulkCheckIn = useCallback(async () => {
    if (bulkSelected.size === 0) return;
    const ids = Array.from(bulkSelected);
    setCheckingIn("bulk");
    try {
      const { error } = await supabase
        .from("guests")
        .update({ status: "checked_in", check_in_time: new Date().toISOString() })
        .in("id", ids);
      if (error) throw error;
      playCheckInSound();
      toast.success(`${ids.length} guests checked in!`);
      ids.forEach((id) => {
        const g = guests.find((g: any) => g.id === id);
        if (g) addActivity(`${g.first_name} ${g.last_name}`, "check_in");
      });
      queryClient.invalidateQueries({ queryKey: ["checkin-guests", activeEvent?.id] });
      setBulkSelected(new Set());
      setBulkMode(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCheckingIn(null);
    }
  }, [bulkSelected, guests, activeEvent?.id, queryClient, addActivity]);

  if (allEvents.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--sidebar-background))] flex items-center justify-center p-6">
        <div className="text-center">
          <Users className="w-12 h-12 text-[hsl(var(--sidebar-foreground))]/20 mx-auto mb-4" />
          <p className="text-[hsl(var(--sidebar-foreground))]/40 text-lg">No active event</p>
          <button onClick={() => navigate("/admin")} className="mt-4 text-sm text-[hsl(var(--sidebar-ring))] hover:underline">
            Go to Admin
          </button>
        </div>
      </div>
    );
  }

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: guests.length },
    { key: "checked_in", label: "Checked In", count: stats.checkedIn },
    { key: "not_arrived", label: "Not Arrived", count: guests.length - stats.checkedIn },
    { key: "vip", label: "VIP", count: guests.filter((g: any) => guestTicketMap[g.id]?.toLowerCase().includes("vip")).length },
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--sidebar-background))] flex flex-col">
      {/* 8. Offline indicator */}
      {!isOnline && (
        <div className="bg-yellow-500/20 border-b border-yellow-500/30 px-4 py-2 flex items-center gap-2 text-yellow-400 text-xs">
          <WifiOff className="w-4 h-4" />
          <span>Offline — check-ins will be queued and synced when reconnected</span>
          {offlineQueue.length > 0 && (
            <span className="ml-auto font-medium">{offlineQueue.length} queued</span>
          )}
        </div>
      )}

      <CheckInHeader
        eventName={activeEvent?.name || ""}
        stats={stats}
        search={search}
        onSearchChange={setSearch}
        onOpenScanner={() => setScannerOpen(true)}
        events={allEvents}
        selectedEventId={selectedEventId || ""}
        onEventChange={(id) => {
          setSelectedEventId(id);
          setSearch("");
          setFilterTab("all");
          setBulkMode(false);
          setBulkSelected(new Set());
        }}
        onAddWalkIn={() => setWalkInOpen(true)}
      />

      {/* 4. Filter tabs */}
      <div className="px-4 sm:px-6 pt-3 flex items-center gap-2 overflow-x-auto">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key)}
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
              filterTab === tab.key
                ? "bg-[hsl(var(--sidebar-ring))] text-white"
                : "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))]/50 hover:text-[hsl(var(--sidebar-foreground))]"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
        <div className="flex-1" />
        {/* 5. Bulk mode toggle */}
        <button
          onClick={() => {
            setBulkMode(!bulkMode);
            setBulkSelected(new Set());
          }}
          className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors flex items-center gap-1 ${
            bulkMode
              ? "bg-[hsl(var(--sidebar-ring))] text-white"
              : "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))]/50"
          }`}
        >
          <CheckSquare className="w-3 h-3" />
          Bulk
        </button>
      </div>

      {/* 5. Bulk action bar */}
      {bulkMode && bulkSelected.size > 0 && (
        <div className="px-4 sm:px-6 pt-2 flex items-center gap-2">
          <button
            onClick={handleBulkCheckIn}
            disabled={checkingIn === "bulk"}
            className="text-xs px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            Check In {bulkSelected.size} Guest{bulkSelected.size > 1 ? "s" : ""}
          </button>
          <button
            onClick={() => setBulkSelected(new Set())}
            className="text-xs px-3 py-2 rounded-lg text-[hsl(var(--sidebar-foreground))]/40 hover:text-[hsl(var(--sidebar-foreground))]"
          >
            Clear
          </button>
          <button
            onClick={() => {
              const notCheckedIn = filtered.filter((g: any) => g.status !== "checked_in").map((g: any) => g.id);
              setBulkSelected(new Set(notCheckedIn));
            }}
            className="text-xs px-3 py-2 rounded-lg text-[hsl(var(--sidebar-foreground))]/40 hover:text-[hsl(var(--sidebar-foreground))]"
          >
            Select All
          </button>
        </div>
      )}

      <main className="flex-1 overflow-auto px-4 sm:px-6 py-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[hsl(var(--sidebar-foreground))]/30" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[hsl(var(--sidebar-foreground))]/30">
              {search ? "No guests match your search" : "No guests for this event"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((guest: any) => (
              <GuestRow
                key={guest.id}
                guest={guest}
                isLoading={checkingIn === guest.id || checkingIn === "bulk"}
                onCheckIn={() => performCheckIn(guest.id)}
                onUndo={() => handleUndoCheckIn(guest)}
                bulkMode={bulkMode}
                selected={bulkSelected.has(guest.id)}
                onSelect={(checked) => {
                  setBulkSelected((prev) => {
                    const next = new Set(prev);
                    checked ? next.add(guest.id) : next.delete(guest.id);
                    return next;
                  });
                }}
                ticketTier={guestTicketMap[guest.id]}
              />
            ))}
          </div>
        )}
      </main>

      {/* 7. Activity feed */}
      <ActivityFeed entries={activityLog} />

      <QrScanner isOpen={scannerOpen} onScan={handleQrScan} onClose={() => setScannerOpen(false)} />
      <WalkInModal isOpen={walkInOpen} onClose={() => setWalkInOpen(false)} onAdd={handleAddWalkIn} isLoading={walkInLoading} />
    </div>
  );
};

export default CheckIn;
