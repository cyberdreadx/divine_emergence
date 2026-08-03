import { forwardRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import AdminModal from "./AdminModal";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmProps {
  open: boolean;
  onClose: () => void;
  table: string;
  id: string;
  label: string;
  queryKey: string;
}

const DeleteConfirm = forwardRef<HTMLDivElement, DeleteConfirmProps>(({ open, onClose, table, id, label, queryKey }, ref) => {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    const { error } = await supabase.from(table as any).delete().eq("id", id);
    if (error) {
      toast.error(`Failed to delete: ${error.message}`);
      return;
    }
    toast.success(`${label} deleted`);
    queryClient.invalidateQueries({ queryKey: [queryKey] });
    onClose();
  };

  return (
    <div ref={ref}>
      <AdminModal open={open} onClose={onClose} title="Confirm Delete">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-sidebar-foreground mb-2">Are you sure you want to delete this {label.toLowerCase()}?</p>
          <p className="text-sidebar-foreground/40 text-sm mb-6">This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-full border border-sidebar-border text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
              Cancel
            </button>
            <button onClick={handleDelete} className="flex-1 bg-destructive text-destructive-foreground py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
              Delete
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
});

DeleteConfirm.displayName = "DeleteConfirm";

export default DeleteConfirm;
