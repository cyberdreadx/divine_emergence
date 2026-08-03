import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Star, Users, TrendingUp, ThumbsUp, Copy, ChevronDown, ChevronUp,
  Loader2, MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

const AdminSurveys = () => {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const { data: events = [] } = useQuery({
    queryKey: ["survey-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("id, name, date, status").order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: allResponses = [], isLoading } = useQuery({
    queryKey: ["survey-responses-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("survey_responses" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const copySurveyLink = (eventId: string) => {
    const url = `${window.location.origin}/survey/${eventId}`;
    navigator.clipboard.writeText(url);
    toast.success("Survey link copied!");
  };

  const getEventStats = (eventId: string) => {
    const responses = allResponses.filter((r: any) => r.event_id === eventId);
    if (responses.length === 0) return null;

    const avgRating = responses.reduce((s: number, r: any) => s + r.overall_rating, 0) / responses.length;
    const wouldReturn = responses.filter((r: any) => r.would_attend_again === true).length;
    const returnRate = Math.round((wouldReturn / responses.length) * 100);

    return { count: responses.length, avgRating: avgRating.toFixed(1), returnRate, responses };
  };

  return (
    <AdminLayout title="Surveys">
      <p className="text-sidebar-foreground/50 text-sm mb-6">
        Share survey links with attendees after each event. Results appear here automatically.
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-sidebar-foreground/30" />
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const stats = getEventStats(event.id);
            const isExpanded = expandedEvent === event.id;
            const eventDate = event.date
              ? new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "";

            return (
              <div key={event.id} className="rounded-xl border border-sidebar-border bg-sidebar-accent/20 overflow-hidden">
                {/* Event Header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div>
                      <h3 className="text-sidebar-foreground font-medium text-sm">{event.name}</h3>
                      <p className="text-sidebar-foreground/40 text-xs">{eventDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {stats && (
                      <div className="hidden sm:flex items-center gap-4 mr-4 text-xs text-sidebar-foreground/50">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {stats.count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" /> {stats.avgRating}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" /> {stats.returnRate}%
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => copySurveyLink(event.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-sidebar-border text-[11px] text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
                    >
                      <Copy className="w-3 h-3" /> Copy Link
                    </button>
                    {stats && (
                      <button
                        onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                        className="p-1.5 rounded-lg hover:bg-sidebar-accent/50 transition-colors text-sidebar-foreground/40"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Results */}
                {isExpanded && stats && (
                  <div className="border-t border-sidebar-border p-4">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                      <div className="rounded-lg border border-sidebar-border p-3 text-center bg-sidebar-accent/30">
                        <Users className="w-4 h-4 mx-auto mb-1 text-sidebar-foreground/50" />
                        <p className="text-xl font-serif text-sidebar-foreground">{stats.count}</p>
                        <p className="text-sidebar-foreground/30 text-[9px] uppercase tracking-wider">Responses</p>
                      </div>
                      <div className="rounded-lg border border-sidebar-border p-3 text-center bg-sidebar-accent/30">
                        <Star className="w-4 h-4 mx-auto mb-1 text-yellow-500" />
                        <p className="text-xl font-serif text-sidebar-foreground">{stats.avgRating}</p>
                        <p className="text-sidebar-foreground/30 text-[9px] uppercase tracking-wider">Avg Rating</p>
                      </div>
                      <div className="rounded-lg border border-sidebar-border p-3 text-center bg-sidebar-accent/30">
                        <ThumbsUp className="w-4 h-4 mx-auto mb-1 text-green-500" />
                        <p className="text-xl font-serif text-sidebar-foreground">{stats.returnRate}%</p>
                        <p className="text-sidebar-foreground/30 text-[9px] uppercase tracking-wider">Would Return</p>
                      </div>
                      <div className="rounded-lg border border-sidebar-border p-3 text-center bg-sidebar-accent/30">
                        <TrendingUp className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                        <p className="text-xl font-serif text-sidebar-foreground">
                          {[1,2,3,4,5].map((s) => stats.responses.filter((r: any) => r.overall_rating === s).length).reduce((a, b, i) => (i >= 3 ? a + b : a), 0)}
                        </p>
                        <p className="text-sidebar-foreground/30 text-[9px] uppercase tracking-wider">4-5 Stars</p>
                      </div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="mb-6">
                      <p className="text-sidebar-foreground/40 text-xs uppercase tracking-wider mb-3">Rating Distribution</p>
                      <div className="space-y-1.5">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = stats.responses.filter((r: any) => r.overall_rating === star).length;
                          const pct = stats.count > 0 ? (count / stats.count) * 100 : 0;
                          return (
                            <div key={star} className="flex items-center gap-2 text-xs">
                              <span className="w-4 text-right text-sidebar-foreground/50">{star}</span>
                              <Star className="w-3 h-3 text-sidebar-foreground/30" />
                              <div className="flex-1 h-2 rounded-full bg-sidebar-border overflow-hidden">
                                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: "#022701" }} />
                              </div>
                              <span className="w-6 text-right text-sidebar-foreground/40">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Individual Responses */}
                    <div>
                      <p className="text-sidebar-foreground/40 text-xs uppercase tracking-wider mb-3">Responses</p>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {stats.responses.map((r: any) => (
                          <div key={r.id} className="rounded-lg border border-sidebar-border p-3 bg-sidebar-accent/10">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[1,2,3,4,5].map((s) => (
                                    <Star key={s} className="w-3 h-3" fill={s <= r.overall_rating ? "#022701" : "transparent"} stroke="#022701" strokeWidth={1.5} />
                                  ))}
                                </div>
                                {r.respondent_name && (
                                  <span className="text-sidebar-foreground text-xs font-medium">{r.respondent_name}</span>
                                )}
                              </div>
                              <span className="text-sidebar-foreground/30 text-[10px]">
                                {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </span>
                            </div>
                            {r.favorite_moment && (
                              <p className="text-sidebar-foreground/60 text-xs mb-1">
                                <span className="text-sidebar-foreground/30">Favorite: </span>{r.favorite_moment}
                              </p>
                            )}
                            {r.suggestions && (
                              <p className="text-sidebar-foreground/60 text-xs">
                                <span className="text-sidebar-foreground/30">Suggestion: </span>{r.suggestions}
                              </p>
                            )}
                            {r.would_attend_again !== null && (
                              <p className="text-xs mt-1">
                                <span className="text-sidebar-foreground/30">Would return: </span>
                                <span className={r.would_attend_again ? "text-green-500" : "text-red-400"}>
                                  {r.would_attend_again ? "Yes" : "No"}
                                </span>
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSurveys;
