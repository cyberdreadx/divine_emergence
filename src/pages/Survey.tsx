import { useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Star, Loader2, CheckCircle } from "lucide-react";
import logoSrc from "@/assets/breathe-bloom-logo.png";

const Survey = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [favoriteMoment, setFavoriteMoment] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [wouldAttend, setWouldAttend] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { data: event, isLoading } = useQuery({
    queryKey: ["survey-event", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id, name, date, location, cover_image")
        .eq("id", eventId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select an overall rating");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("survey_responses" as any).insert({
        event_id: eventId,
        respondent_name: name.trim() || null,
        respondent_email: email.trim() || null,
        overall_rating: rating,
        favorite_moment: favoriteMoment.trim() || null,
        suggestions: suggestions.trim() || null,
        would_attend_again: wouldAttend,
      } as any);
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit survey");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f5f3ed" }}>
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#022701" }} />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f5f3ed" }}>
        <p style={{ color: "#022701", opacity: 0.4 }}>Event not found</p>
      </div>
    );
  }

  const eventDate = event.date
    ? new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : "";

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#f5f3ed" }}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: "#c6d2c1" }}>
            <CheckCircle className="w-8 h-8" style={{ color: "#022701" }} />
          </div>
          <h1 className="font-serif text-3xl mb-3" style={{ color: "#022701" }}>Thank You!</h1>
          <p className="text-sm leading-relaxed" style={{ color: "#022701", opacity: 0.6 }}>
            Your feedback for <strong>{event.name}</strong> has been received. We truly appreciate you taking the time to share your thoughts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f3ed" }}>
      {/* Header */}
      <div className="py-10 text-center" style={{ backgroundColor: "#c6d2c1" }}>
        <img src={logoSrc} alt="Breathe & Bloom" className="h-12 mx-auto mb-4 object-contain" />
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#022701", opacity: 0.5 }}>Post-Event Feedback</p>
        <h1 className="font-serif text-2xl sm:text-3xl" style={{ color: "#022701" }}>{event.name}</h1>
        {eventDate && <p className="text-sm mt-1" style={{ color: "#022701", opacity: 0.5 }}>{eventDate}</p>}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto px-6 py-10 space-y-8">
        {/* Name & Email (optional) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider mb-1.5 block" style={{ color: "#022701", opacity: 0.5 }}>Name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "rgba(2,39,1,0.15)", backgroundColor: "white", color: "#022701", focusRingColor: "#c6d2c1" } as any}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider mb-1.5 block" style={{ color: "#022701", opacity: 0.5 }}>Email (optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "rgba(2,39,1,0.15)", backgroundColor: "white", color: "#022701" } as any}
              placeholder="your@email.com"
            />
          </div>
        </div>

        {/* Overall Rating */}
        <div>
          <label className="text-xs uppercase tracking-wider mb-3 block" style={{ color: "#022701", opacity: 0.5 }}>
            Overall Experience *
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className="w-10 h-10 transition-colors"
                  fill={(hoverRating || rating) >= star ? "#022701" : "transparent"}
                  stroke="#022701"
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-xs mt-2" style={{ color: "#022701", opacity: 0.4 }}>
              {["", "Poor", "Fair", "Good", "Great", "Amazing"][rating]}
            </p>
          )}
        </div>

        {/* Favorite Moment */}
        <div>
          <label className="text-xs uppercase tracking-wider mb-1.5 block" style={{ color: "#022701", opacity: 0.5 }}>
            What was your favorite moment?
          </label>
          <textarea
            value={favoriteMoment}
            onChange={(e) => setFavoriteMoment(e.target.value)}
            maxLength={1000}
            rows={3}
            className="w-full rounded-lg border px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2"
            style={{ borderColor: "rgba(2,39,1,0.15)", backgroundColor: "white", color: "#022701" } as any}
            placeholder="The breathwork session was incredible..."
          />
        </div>

        {/* Suggestions */}
        <div>
          <label className="text-xs uppercase tracking-wider mb-1.5 block" style={{ color: "#022701", opacity: 0.5 }}>
            Any suggestions for future events?
          </label>
          <textarea
            value={suggestions}
            onChange={(e) => setSuggestions(e.target.value)}
            maxLength={1000}
            rows={3}
            className="w-full rounded-lg border px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2"
            style={{ borderColor: "rgba(2,39,1,0.15)", backgroundColor: "white", color: "#022701" } as any}
            placeholder="It would be great if..."
          />
        </div>

        {/* Would Attend Again */}
        <div>
          <label className="text-xs uppercase tracking-wider mb-3 block" style={{ color: "#022701", opacity: 0.5 }}>
            Would you attend another Breathe & Bloom event?
          </label>
          <div className="flex gap-3">
            {[
              { value: true, label: "Absolutely!" },
              { value: false, label: "Maybe not" },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setWouldAttend(opt.value)}
                className="px-5 py-2.5 rounded-lg border text-sm font-medium transition-colors"
                style={{
                  borderColor: wouldAttend === opt.value ? "#022701" : "rgba(2,39,1,0.15)",
                  backgroundColor: wouldAttend === opt.value ? "#022701" : "white",
                  color: wouldAttend === opt.value ? "#f5f3ed" : "#022701",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || rating === 0}
          className="w-full py-3 rounded-lg text-sm font-medium transition-opacity disabled:opacity-40"
          style={{ backgroundColor: "#022701", color: "#f5f3ed" }}
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Submit Feedback"}
        </button>

        <p className="text-center text-[10px]" style={{ color: "#022701", opacity: 0.3 }}>
          Breathe & Bloom · Post-Event Survey
        </p>
      </form>
    </div>
  );
};

export default Survey;
