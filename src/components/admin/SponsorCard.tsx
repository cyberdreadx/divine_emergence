import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, Crown } from "lucide-react";

interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  is_main: boolean;
  cta_label: string | null;
  cta_link: string | null;
  display_order: number;
}

interface SponsorCardProps {
  sponsor: Sponsor;
  onEdit: (sponsor: Sponsor) => void;
  onDelete: (id: string) => void;
}

const SponsorCard = ({ sponsor, onEdit, onDelete }: SponsorCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sponsor.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 rounded-xl border border-sidebar-border bg-sidebar-accent/30 hover:bg-sidebar-accent/50 transition-colors group"
    >
      <button {...attributes} {...listeners} className="cursor-grab text-sidebar-foreground/30 hover:text-sidebar-foreground/60 touch-none">
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="w-12 h-12 rounded-lg bg-sidebar-accent border border-sidebar-border flex items-center justify-center overflow-hidden shrink-0">
        {sponsor.logo_url ? (
          <img src={sponsor.logo_url} alt={sponsor.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-sidebar-foreground/30 text-xs font-medium">
            {sponsor.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sidebar-foreground font-medium text-sm truncate">{sponsor.name}</p>
          {sponsor.is_main && (
            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
              <Crown className="w-3 h-3" /> Main
            </span>
          )}
        </div>
        {sponsor.website_url && (
          <p className="text-sidebar-foreground/40 text-xs truncate">{sponsor.website_url}</p>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(sponsor); }} className="p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors">
          <Pencil className="w-4 h-4" />
        </button>
        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(sponsor.id); }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-sidebar-foreground/40 hover:text-red-400 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SponsorCard;
export type { Sponsor };
