import { useEffect, useRef } from "react";

interface Props {
  /** PNG data URL of the signature, or "" when empty. */
  value: string;
  onChange: (dataUrl: string) => void;
  invalid?: boolean;
}

/**
 * A draw-to-sign box that works with a finger, stylus, or mouse. The ink is
 * dark on a white card so the exported PNG reads well on a printed PDF.
 */
const SignaturePad = ({ value, onChange, invalid }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const hasInk = useRef(false);

  // Size the canvas to its box at device resolution so lines stay crisp.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let lastWidth = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Phones fire resize when the address bar hides on scroll; only redraw
      // when the box width really changes.
      if (Math.round(rect.width) === lastWidth) return;
      lastWidth = Math.round(rect.width);
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(ratio, ratio);
      ctx.lineWidth = 2.2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#1c1530";
      // Resizing wipes the canvas, so the saved signature no longer matches it.
      if (hasInk.current) {
        hasInk.current = false;
        onChange("");
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const ctx = e.currentTarget.getContext("2d")!;
    const { x, y } = point(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    // A tap leaves a dot.
    ctx.lineTo(x + 0.1, y + 0.1);
    ctx.stroke();
    hasInk.current = true;
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = e.currentTarget.getContext("2d")!;
    const { x, y } = point(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (hasInk.current && canvasRef.current) onChange(canvasRef.current.toDataURL("image/png"));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    hasInk.current = false;
    onChange("");
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        aria-label="Signature box. Draw your signature here."
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onPointerLeave={end}
        className={`block w-full h-40 rounded-2xl bg-white touch-none cursor-crosshair border-2 ${
          invalid ? "border-red-400" : "border-white/15"
        }`}
      />
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{value ? "Signed" : "Sign with your finger or mouse"}</span>
        <button type="button" onClick={clear} className="uppercase tracking-[0.18em] hover:text-foreground">
          Clear
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
