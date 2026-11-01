import jsPDF from "jspdf";
import type { Guide } from "@/lib/guides";

export interface GuideSignature {
  firstName: string;
  lastName: string;
  email: string;
  legalName: string;
  signedDate: string;
  /** PNG data URL. */
  signature: string;
}

// jsPDF's built-in fonts only cover Latin-1, so swap smart punctuation for
// plain characters that render reliably.
const clean = (s: string) =>
  s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .split("")
    .filter((ch) => {
      const c = ch.charCodeAt(0);
      return c === 10 || (c >= 32 && c <= 126) || (c >= 160 && c <= 255);
    })
    .join("");

/** The whole guide plus the client's signed acknowledgment, as a PDF. */
export function buildGuidePdf(guide: Guide, s: GuideSignature, submittedAt: Date): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 54;
  const width = pageW - margin * 2;
  let y = margin;

  const ensure = (h: number) => {
    if (y + h > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const write = (text: string, o: { size?: number; bold?: boolean; italic?: boolean; gap?: number; indent?: number; color?: number } = {}) => {
    const { size = 10, bold = false, italic = false, gap = 4, indent = 0, color = 30 } = o;
    doc.setFont("helvetica", bold ? "bold" : italic ? "italic" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color);
    const lineH = size * 1.35;
    for (const line of doc.splitTextToSize(clean(text), width - indent) as string[]) {
      ensure(lineH);
      doc.text(line, margin + indent, y + size);
      y += lineH;
    }
    y += gap;
  };

  write(guide.title, { size: 18, bold: true, gap: 2 });
  write("Divine Emergence, LLC", { size: 10, color: 110, gap: 12 });

  for (const b of guide.blocks) {
    if ("h" in b) {
      y += 6;
      write(b.h, { size: 13, bold: true, gap: 4 });
    } else if ("h3" in b) {
      y += 2;
      write(b.h3, { size: 11, bold: true, gap: 3 });
    } else if ("p" in b) {
      write(b.p, { size: 9.5, gap: 5 });
    } else if ("note" in b) {
      write(b.note, { size: 9.5, italic: true, gap: 6, indent: 10 });
    } else {
      for (const item of b.ul) {
        if (typeof item === "string") write(`- ${item}`, { size: 9.5, gap: 1, indent: 12 });
        else {
          write(`- ${item.text}`, { size: 9.5, gap: 1, indent: 12 });
          item.sub.forEach((t) => write(`- ${t}`, { size: 9.5, gap: 1, indent: 26 }));
        }
      }
      y += 4;
    }
  }

  // Signed acknowledgment.
  y += 10;
  ensure(220);
  doc.setDrawColor(200);
  doc.line(margin, y, pageW - margin, y);
  y += 14;
  write("Acknowledgment", { size: 13, bold: true, gap: 6 });
  for (const a of guide.acknowledgments) write(`[X] ${a}`, { size: 10, gap: 2 });
  y += 10;
  write("Full Legal Name", { size: 9.5, bold: true, gap: 1 });
  write(s.legalName, { size: 11, gap: 2, indent: 8 });
  write(`Email: ${s.email}`, { size: 9.5, gap: 8, indent: 8, color: 90 });
  write("Signature", { size: 9.5, bold: true, gap: 4 });
  const h = 70;
  const w = 210;
  ensure(h + 8);
  doc.addImage(s.signature, "PNG", margin + 8, y, w, h);
  y += h + 2;
  doc.setDrawColor(150);
  doc.line(margin + 8, y, margin + 8 + w, y);
  y += 12;
  write("Date", { size: 9.5, bold: true, gap: 1 });
  write(s.signedDate, { size: 11, gap: 6, indent: 8 });
  write(`Signed online ${submittedAt.toLocaleString()}`, { size: 8.5, color: 120 });
  return doc;
}

/** File name like "Kambufo-Prep-Guide-Jane-Doe-2026-11-01.pdf". */
export function guideFileName(guide: Guide, s: GuideSignature, date: Date): string {
  const label = { kambufo: "Kambufo-Prep-Guide", microdose: "Microdose-Prep-Guide", integration: "Integration-Guide" }[guide.slug] ?? guide.slug;
  const name = `${s.firstName}-${s.lastName}`.replace(/[^A-Za-z0-9-]+/g, "");
  return `${label}-${name || "Client"}-${date.toISOString().slice(0, 10)}.pdf`;
}
