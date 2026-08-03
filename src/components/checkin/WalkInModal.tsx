import { useState } from "react";
import { X, UserPlus } from "lucide-react";

interface WalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (guest: { first_name: string; last_name: string; email: string; phone?: string; company?: string; notes?: string }) => void;
  isLoading?: boolean;
}

const WalkInModal = ({ isOpen, onClose, onAdd, isLoading }: WalkInModalProps) => {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", company: "", notes: "" });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email) return;
    onAdd(form);
    setForm({ first_name: "", last_name: "", email: "", phone: "", company: "", notes: "" });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[hsl(var(--sidebar-background))] rounded-2xl border border-[hsl(var(--sidebar-border))] w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[hsl(var(--sidebar-ring))]" />
            <h2 className="font-serif text-lg text-[hsl(var(--sidebar-foreground))]">Add Walk-in Guest</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))]/40">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="First name *"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              required
              className="px-3 py-2.5 rounded-lg bg-[hsl(var(--sidebar-accent))] border border-[hsl(var(--sidebar-border))] text-[hsl(var(--sidebar-foreground))] text-sm placeholder:text-[hsl(var(--sidebar-foreground))]/20 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sidebar-ring))]/50"
            />
            <input
              placeholder="Last name *"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              required
              className="px-3 py-2.5 rounded-lg bg-[hsl(var(--sidebar-accent))] border border-[hsl(var(--sidebar-border))] text-[hsl(var(--sidebar-foreground))] text-sm placeholder:text-[hsl(var(--sidebar-foreground))]/20 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sidebar-ring))]/50"
            />
          </div>
          <input
            placeholder="Email *"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-3 py-2.5 rounded-lg bg-[hsl(var(--sidebar-accent))] border border-[hsl(var(--sidebar-border))] text-[hsl(var(--sidebar-foreground))] text-sm placeholder:text-[hsl(var(--sidebar-foreground))]/20 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sidebar-ring))]/50"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="px-3 py-2.5 rounded-lg bg-[hsl(var(--sidebar-accent))] border border-[hsl(var(--sidebar-border))] text-[hsl(var(--sidebar-foreground))] text-sm placeholder:text-[hsl(var(--sidebar-foreground))]/20 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sidebar-ring))]/50"
            />
            <input
              placeholder="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="px-3 py-2.5 rounded-lg bg-[hsl(var(--sidebar-accent))] border border-[hsl(var(--sidebar-border))] text-[hsl(var(--sidebar-foreground))] text-sm placeholder:text-[hsl(var(--sidebar-foreground))]/20 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sidebar-ring))]/50"
            />
          </div>
          <input
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg bg-[hsl(var(--sidebar-accent))] border border-[hsl(var(--sidebar-border))] text-[hsl(var(--sidebar-foreground))] text-sm placeholder:text-[hsl(var(--sidebar-foreground))]/20 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sidebar-ring))]/50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[hsl(var(--sidebar-ring))] text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Add & Check In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WalkInModal;
