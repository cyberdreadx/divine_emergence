import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const AdminModal = ({ open, onClose, title, children }: AdminModalProps) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative border border-sidebar-border rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#eee8e1' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#022701]/15">
          <h3 className="font-serif text-lg text-[#022701]">{title}</h3>
          <button onClick={onClose} className="text-[#022701]/40 hover:text-[#022701] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
};
export default AdminModal;
