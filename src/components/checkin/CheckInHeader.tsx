import { Search, CheckCircle2, Users, UserCheck, ArrowLeft, QrCode, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CheckInHeaderProps {
  eventName: string;
  stats: { checkedIn: number; confirmed: number; total: number; capacity: number };
  search: string;
  onSearchChange: (val: string) => void;
  onOpenScanner: () => void;
  events?: { id: string; name: string; date: string | null }[];
  selectedEventId?: string;
  onEventChange?: (id: string) => void;
  onAddWalkIn?: () => void;
}

const CheckInHeader = ({
  eventName, stats, search, onSearchChange, onOpenScanner,
  events = [], selectedEventId, onEventChange, onAddWalkIn,
}: CheckInHeaderProps) => {
  const navigate = useNavigate();
  const progressPercent = stats.capacity > 0 ? Math.min((stats.checkedIn / stats.capacity) * 100, 100) : 0;

  return (
    <header className="shrink-0 px-4 sm:px-6 py-4 border-b border-[hsl(var(--sidebar-border))]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin")} className="p-2 rounded-lg hover:bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))]/40">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-serif text-lg text-[hsl(var(--sidebar-foreground))]">Check-In</h1>
            {/* 1. Event selector dropdown */}
            {events.length > 1 && onEventChange ? (
              <div className="relative">
                <select
                  value={selectedEventId || ""}
                  onChange={(e) => onEventChange(e.target.value)}
                  className="appearance-none bg-transparent text-[hsl(var(--sidebar-foreground))]/60 text-xs pr-5 cursor-pointer focus:outline-none hover:text-[hsl(var(--sidebar-foreground))]"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name} {ev.date ? `(${new Date(ev.date + "T12:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })})` : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[hsl(var(--sidebar-foreground))]/30" />
              </div>
            ) : (
              <p className="text-[hsl(var(--sidebar-foreground))]/40 text-xs">{eventName}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* 2. Walk-in button */}
          {onAddWalkIn && (
            <button
              onClick={onAddWalkIn}
              className="text-xs px-3 py-1.5 rounded-lg bg-[hsl(var(--sidebar-ring))] text-white hover:opacity-90 transition-opacity font-medium"
            >
              + Walk-in
            </button>
          )}
          <div className="text-right">
            <p className="text-2xl font-serif text-[hsl(var(--sidebar-foreground))]">
              {stats.checkedIn}<span className="text-[hsl(var(--sidebar-foreground))]/30">/{stats.capacity}</span>
            </p>
            <p className="text-[hsl(var(--sidebar-foreground))]/40 text-[10px] uppercase tracking-wider">Checked In</p>
          </div>
        </div>
      </div>

      {/* 3. Real-time progress bar with percentage label */}
      <div className="relative">
        <div className="w-full h-3 rounded-full bg-[hsl(var(--sidebar-accent))] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: progressPercent > 90 ? "hsl(0, 72%, 51%)" : progressPercent > 70 ? "hsl(45, 93%, 47%)" : "hsl(142, 71%, 45%)",
            }}
          />
        </div>
        <span className="absolute right-0 -top-4 text-[10px] text-[hsl(var(--sidebar-foreground))]/40">
          {Math.round(progressPercent)}%
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mt-3">
        {[
          { label: "Checked In", value: stats.checkedIn, icon: UserCheck, color: "hsl(142, 71%, 45%)" },
          { label: "Confirmed", value: stats.confirmed, icon: CheckCircle2, color: "hsl(217, 91%, 60%)" },
          { label: "Total RSVPs", value: stats.total, icon: Users, color: "hsl(var(--sidebar-foreground))" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-[hsl(var(--sidebar-accent))] p-3 text-center">
            <s.icon className="w-4 h-4 mx-auto mb-1" style={{ color: s.color }} />
            <p className="text-xl font-serif text-[hsl(var(--sidebar-foreground))]">{s.value}</p>
            <p className="text-[hsl(var(--sidebar-foreground))]/30 text-[10px] uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + QR button */}
      <div className="flex gap-2 mt-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--sidebar-foreground))]/30" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, or company..."
            autoFocus
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[hsl(var(--sidebar-accent))] border border-[hsl(var(--sidebar-border))] text-[hsl(var(--sidebar-foreground))] text-base placeholder:text-[hsl(var(--sidebar-foreground))]/20 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sidebar-ring))]/50"
          />
        </div>
        <button
          onClick={onOpenScanner}
          className="shrink-0 w-14 rounded-xl bg-[hsl(var(--sidebar-accent))] border border-[hsl(var(--sidebar-border))] flex items-center justify-center text-[hsl(var(--sidebar-foreground))]/60 hover:text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))]/80 transition-colors"
          title="Scan QR Code"
        >
          <QrCode className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default CheckInHeader;
