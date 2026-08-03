import { CheckCircle2, Clock, Loader2, UtensilsCrossed, Ticket, StickyNote } from "lucide-react";

interface GuestRowProps {
  guest: any;
  isLoading: boolean;
  onCheckIn: () => void;
  onUndo: () => void;
  selected?: boolean;
  onSelect?: (checked: boolean) => void;
  bulkMode?: boolean;
  ticketTier?: string;
}

const GuestRow = ({ guest, isLoading, onCheckIn, onUndo, selected, onSelect, bulkMode, ticketTier }: GuestRowProps) => {
  const isCheckedIn = guest.status === "checked_in";

  return (
    <div className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
      isCheckedIn
        ? "border-green-500/30 bg-green-500/5"
        : selected
        ? "border-[hsl(var(--sidebar-ring))]/50 bg-[hsl(var(--sidebar-ring))]/5"
        : "border-[hsl(var(--sidebar-border))] hover:bg-[hsl(var(--sidebar-accent))]/50"
    }`}>
      {/* 5. Bulk check-in checkbox */}
      {bulkMode && !isCheckedIn && (
        <input
          type="checkbox"
          checked={selected || false}
          onChange={(e) => onSelect?.(e.target.checked)}
          className="w-5 h-5 rounded border-[hsl(var(--sidebar-border))] accent-[hsl(var(--sidebar-ring))] shrink-0 cursor-pointer"
        />
      )}

      <button
        onClick={() => (isCheckedIn ? onUndo() : onCheckIn())}
        disabled={isLoading}
        className="flex items-center gap-3 flex-1 min-w-0 active:scale-[0.98]"
      >
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
            isCheckedIn ? "bg-green-500/20" : "bg-[hsl(var(--sidebar-accent))]"
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--sidebar-foreground))]/40" />
          ) : isCheckedIn ? (
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          ) : (
            <span className="text-[hsl(var(--sidebar-foreground))] font-serif text-sm">
              {guest.first_name.charAt(0)}{guest.last_name.charAt(0)}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`font-medium text-base ${isCheckedIn ? "text-green-400" : "text-[hsl(var(--sidebar-foreground))]"}`}>
            {guest.first_name} {guest.last_name}
          </p>
          {/* 6. Enriched guest details inline */}
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {guest.company && (
              <span className="text-[hsl(var(--sidebar-foreground))]/40 text-xs truncate">{guest.company}</span>
            )}
            {ticketTier && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--sidebar-ring))]/20 text-[hsl(var(--sidebar-ring))] flex items-center gap-0.5">
                <Ticket className="w-2.5 h-2.5" />{ticketTier}
              </span>
            )}
            {guest.dietary_requirements && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 flex items-center gap-0.5">
                <UtensilsCrossed className="w-2.5 h-2.5" />{guest.dietary_requirements}
              </span>
            )}
            {guest.notes && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 flex items-center gap-0.5" title={guest.notes}>
                <StickyNote className="w-2.5 h-2.5" />Note
              </span>
            )}
          </div>
        </div>

        {isCheckedIn && guest.check_in_time && (
          <div className="text-right shrink-0">
            <p className="text-green-400/60 text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(guest.check_in_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
            </p>
          </div>
        )}

        {!isCheckedIn && !isLoading && !bulkMode && (
          <span className="text-[hsl(var(--sidebar-foreground))]/20 text-xs shrink-0">Tap to check in</span>
        )}
      </button>
    </div>
  );
};

export default GuestRow;
