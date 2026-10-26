import jsPDF from "jspdf";
import {
  type Answers,
  SECTIONS,
  WAIVER,
  WAIVER_CONFIRMATIONS,
  WAIVER_INTRO,
  WAIVER_TITLE,
  formatAnswer,
  isShown,
} from "@/lib/intake";

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
      return c === 9 || c === 10 || c === 13 || (c >= 32 && c <= 126) || (c >= 160 && c <= 255);
    })
    .join("");

/** Builds the signed intake form and waiver as a PDF. */
export function buildIntakePdf(a: Answers, submittedAt: Date): jsPDF {
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

  const write = (text: string, opts: { size?: number; bold?: boolean; gap?: number; indent?: number; color?: number } = {}) => {
    const { size = 10, bold = false, gap = 4, indent = 0, color = 30 } = opts;
    doc.setFont("helvetica", bold ? "bold" : "normal");
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

  const rule = () => {
    ensure(12);
    doc.setDrawColor(200);
    doc.line(margin, y, pageW - margin, y);
    y += 12;
  };

  write("Ceremony Intake Form and Waiver", { size: 18, bold: true, gap: 2 });
  write("Divine Emergence, LLC - Confidential", { size: 10, color: 110, gap: 2 });
  write(`Submitted ${submittedAt.toLocaleString()}`, { size: 9, color: 110, gap: 10 });
  rule();

  for (const section of SECTIONS) {
    write(section.title, { size: 13, bold: true, gap: 6 });
    for (const f of section.fields) {
      if (!isShown(f, a)) continue;
      write(f.label, { size: 9.5, bold: true, gap: 1 });
      write(formatAnswer(f, a) || "-", { size: 10, gap: 8, indent: 8 });
    }
    rule();
  }

  write(WAIVER_TITLE, { size: 13, bold: true, gap: 4 });
  write(WAIVER_INTRO, { size: 9.5, gap: 8 });
  WAIVER.forEach((c, i) => {
    write(`${i + 1}. ${c.title}. ${c.body}`, { size: 9.5, gap: 3 });
    c.bullets?.forEach((b) => write(`- ${b}`, { size: 9.5, gap: 1, indent: 14 }));
    if (c.after) write(c.after, { size: 9.5, gap: 3 });
    y += 3;
  });
  y += 4;

  for (const c of WAIVER_CONFIRMATIONS) {
    write(`[${a[c.id] === true ? "X" : " "}] ${c.label}`, { size: 10, gap: 2 });
  }
  y += 10;

  write("Full Legal Name", { size: 9.5, bold: true, gap: 1 });
  write((a.legalName as string) ?? "", { size: 11, gap: 8, indent: 8 });

  write("Signature", { size: 9.5, bold: true, gap: 4 });
  const sig = a.signature as string | undefined;
  if (sig) {
    const h = 70;
    const w = 210;
    ensure(h + 8);
    doc.addImage(sig, "PNG", margin + 8, y, w, h);
    y += h + 2;
    doc.setDrawColor(150);
    doc.line(margin + 8, y, margin + 8 + w, y);
    y += 12;
  }

  write("Date", { size: 9.5, bold: true, gap: 1 });
  write((a.signedDate as string) ?? "", { size: 11, gap: 8, indent: 8 });

  return doc;
}

/** File name like "Intake-Jane-Doe-2026-10-26.pdf". */
export function intakeFileName(a: Answers, date: Date): string {
  const name = `${a.firstName ?? ""}-${a.lastName ?? ""}`.replace(/[^A-Za-z0-9-]+/g, "");
  return `Intake-${name || "Client"}-${date.toISOString().slice(0, 10)}.pdf`;
}
