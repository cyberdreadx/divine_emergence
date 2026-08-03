import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import AdminModal from "./AdminModal";

interface GuestFormProps {
  open: boolean;
  onClose: () => void;
  guest?: any;
  events?: any[];
}

const GuestForm = ({ open, onClose, guest, events = [] }: GuestFormProps) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "", company: "",
    dietary_requirements: "", notes: "", status: "pending", event_id: "",
  });

  useEffect(() => {
    if (guest) {
      setForm({
        first_name: guest.first_name || "", last_name: guest.last_name || "",
        email: guest.email || "", phone: guest.phone || "", company: guest.company || "",
        dietary_requirements: guest.dietary_requirements || "", notes: guest.notes || "",
        status: guest.status || "pending", event_id: guest.event_id || "",
      });
    } else {
      setForm({
        first_name: "", last_name: "", email: "", phone: "", company: "",
        dietary_requirements: "", notes: "", status: "pending", event_id: events[0]?.id || "",
      });
    }
  }, [guest, open, events]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, event_id: form.event_id || null };
      if (guest) {
        const { error } = await supabase.from("guests").update(payload).eq("id", guest.id);
        if (error) throw error;
        toast.success("Guest updated!");
      } else {
        const { error } = await supabase.from("guests").insert(payload);
        if (error) throw error;
        toast.success("Guest added!");
      }
      queryClient.invalidateQueries({ queryKey: ["admin-guests"] });
      onClose();
    } catch (err: any) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-sidebar-accent border border-sidebar-border text-sidebar-foreground text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-ring/50";

  return (
    <AdminModal open={open} onClose={onClose} title={guest ? "Edit Guest" : "Add Guest"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-sidebar-foreground mb-1.5">First Name *</label>
            <input required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-sidebar-foreground mb-1.5">Last Name *</label>
            <input required value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-sidebar-foreground mb-1.5">Email *</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-sidebar-foreground mb-1.5">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-sidebar-foreground mb-1.5">Company</label>
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-sidebar-foreground mb-1.5">Event</label>
          <select value={form.event_id} onChange={(e) => setForm({ ...form, event_id: e.target.value })} className={inputClass}>
            <option value="">No event</option>
            {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-sidebar-foreground mb-1.5">Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="declined">Declined</option>
            <option value="waitlisted">Waitlisted</option>
            <option value="checked_in">Checked In</option>
            <option value="no_show">No Show</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-sidebar-foreground mb-1.5">Notes</label>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className={`${inputClass} resize-none`} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-full border border-sidebar-border text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 bg-sidebar-primary text-sidebar-primary-foreground py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? "Saving..." : guest ? "Update" : "Add Guest"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
};

export default GuestForm;
