import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, X, Loader2 } from "lucide-react";

interface QrScannerProps {
  onScan: (guestId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const QrScanner = ({ onScan, isOpen, onClose }: QrScannerProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const containerId = "qr-reader";

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    setStarting(true);
    setError(null);

    const scanner = new Html5Qrcode(containerId);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // Expect format: bb-checkin:<guest-uuid>
          const match = decodedText.match(/^bb-checkin:(.+)$/);
          if (match) {
            onScan(match[1]);
            // Stop after successful scan
            scanner.stop().catch(() => {});
            onClose();
          }
        },
        () => {} // ignore scan failures
      )
      .then(() => {
        if (!cancelled) setStarting(false);
      })
      .catch((err) => {
        if (!cancelled) {
          setStarting(false);
          setError(
            err?.toString().includes("NotAllowed")
              ? "Camera access denied. Please allow camera permissions."
              : "Could not start camera. Make sure no other app is using it."
          );
        }
      });

    return () => {
      cancelled = true;
      scanner.stop().catch(() => {});
      scannerRef.current = null;
    };
  }, [isOpen, onScan, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="text-center mb-6">
        <Camera className="w-8 h-8 text-white/60 mx-auto mb-2" />
        <p className="text-white text-lg font-serif">Scan Guest QR Code</p>
        <p className="text-white/40 text-sm mt-1">Point camera at the guest's QR code</p>
      </div>

      {/* Scanner viewport */}
      <div className="w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-black relative">
        <div id={containerId} className="w-full h-full" />
        {starting && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="w-8 h-8 animate-spin text-white/60" />
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-sm mt-4 text-center max-w-sm">{error}</p>
      )}

      <p className="text-white/30 text-xs mt-6">
        Or close to search manually
      </p>
    </div>
  );
};

export default QrScanner;
