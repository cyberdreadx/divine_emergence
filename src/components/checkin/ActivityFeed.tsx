import { CheckCircle2, Clock } from "lucide-react";

export interface ActivityEntry {
  id: string;
  name: string;
  time: Date;
  type: "check_in" | "undo";
}

interface ActivityFeedProps {
  entries: ActivityEntry[];
}

const ActivityFeed = ({ entries }: ActivityFeedProps) => {
  if (entries.length === 0) return null;

  const timeAgo = (date: Date) => {
    const secs = Math.floor((Date.now() - date.getTime()) / 1000);
    if (secs < 60) return "just now";
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  return (
    <div className="border-t border-[hsl(var(--sidebar-border))] px-4 sm:px-6 py-3">
      <p className="text-[10px] uppercase tracking-wider text-[hsl(var(--sidebar-foreground))]/30 mb-2">Recent Activity</p>
      <div className="space-y-1.5 max-h-32 overflow-y-auto">
        {entries.slice(0, 10).map((entry) => (
          <div key={entry.id + entry.time.getTime()} className="flex items-center gap-2 text-xs">
            <CheckCircle2
              className={`w-3 h-3 shrink-0 ${entry.type === "check_in" ? "text-green-400" : "text-yellow-400"}`}
            />
            <span className="text-[hsl(var(--sidebar-foreground))]/60 truncate flex-1">
              {entry.name} {entry.type === "check_in" ? "checked in" : "reverted"}
            </span>
            <span className="text-[hsl(var(--sidebar-foreground))]/30 shrink-0 flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />
              {timeAgo(entry.time)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
