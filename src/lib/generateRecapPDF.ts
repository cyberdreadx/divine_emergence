import jsPDF from "jspdf";
import logoSrc from "@/assets/breathe-bloom-logo.png";
import { NotoSerifEthiopicCondensedRegular } from "@/lib/fonts/notoSerifEthiopicCondensed-Regular";
import { NotoSerifEthiopicCondensedBold } from "@/lib/fonts/notoSerifEthiopicCondensed-Bold";

interface RecapData {
  id: string;
  photos_count: number;
  impressions: number;
  engagement_rate: number;
  social_mentions: number;
  notes: string | null;
  recap_url: string | null;
  partners: { company_name: string; contact_name: string };
  events: { name: string; date: string; location: string };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function registerFonts(doc: jsPDF) {
  doc.addFileToVFS("NotoSerifEthiopicCondensed-Regular.ttf", NotoSerifEthiopicCondensedRegular);
  doc.addFont("NotoSerifEthiopicCondensed-Regular.ttf", "NotoSerifEC", "normal");
  doc.addFileToVFS("NotoSerifEthiopicCondensed-Bold.ttf", NotoSerifEthiopicCondensedBold);
  doc.addFont("NotoSerifEthiopicCondensed-Bold.ttf", "NotoSerifEC", "bold");
}

export async function generateRecapPDF(recap: RecapData, assets: any[], siteUrl: string) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  registerFonts(doc);

  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentW = w - margin * 2;
  let y = 0;
  const headerH = 55;
  const font = "NotoSerifEC";

  // --- Page background ---
  doc.setFillColor(245, 243, 237);
  doc.rect(0, 0, w, h, "F");

  // --- Header band (logo only) ---
  doc.setFillColor(198, 210, 193);
  doc.rect(0, 0, w, headerH, "F");

  try {
    const logoImg = await loadImage(logoSrc);
    const logoW = 70;
    const logoH = (logoImg.height / logoImg.width) * logoW;
    const logoY = (headerH - logoH) / 2;
    doc.addImage(logoImg, "PNG", (w - logoW) / 2, logoY, logoW, logoH);
  } catch {
    doc.setTextColor(2, 39, 1);
    doc.setFontSize(18);
    doc.setFont(font, "bold");
    doc.text("BREATHE & BLOOM", w / 2, headerH / 2 + 3, { align: "center" });
  }

  // --- Below header: event info block ---
  y = headerH + 18;
  doc.setTextColor(2, 39, 1);

  doc.setFontSize(9);
  doc.setFont(font, "normal");
  doc.text("POST-EVENT RECAP", w / 2, y, { align: "center" });
  y += 10;

  doc.setFontSize(20);
  doc.setFont(font, "bold");
  doc.text(recap.events?.name || "Event", w / 2, y, { align: "center" });
  y += 8;

  if (recap.events?.date) {
    doc.setFontSize(9);
    doc.setFont(font, "normal");
    const date = new Date(recap.events.date + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
    });
    doc.text(date, w / 2, y, { align: "center" });
    y += 5;
  }

  if (recap.events?.location) {
    doc.setFontSize(8);
    doc.text(recap.events.location, w / 2, y, { align: "center" });
    y += 5;
  }

  // --- Prepared for ---
  y += 8;
  doc.setFontSize(8);
  doc.setFont(font, "normal");
  doc.text("PREPARED FOR", w / 2, y, { align: "center" });
  y += 8;
  doc.setFontSize(18);
  doc.setFont(font, "bold");
  doc.text(recap.partners?.company_name || "Partner", w / 2, y, { align: "center" });
  if (recap.partners?.contact_name) {
    y += 7;
    doc.setFontSize(10);
    doc.setFont(font, "normal");
    doc.text(recap.partners.contact_name, w / 2, y, { align: "center" });
  }

  // --- Metrics ---
  y += 18;
  const metrics = [
    { label: "PHOTOS DELIVERED", value: String(recap.photos_count || 0) },
    { label: "IMPRESSIONS", value: (recap.impressions || 0).toLocaleString() },
    { label: "ENGAGEMENT RATE", value: `${recap.engagement_rate || 0}%` },
    { label: "SOCIAL MENTIONS", value: String(recap.social_mentions || 0) },
  ];

  const boxW = (contentW - 12) / 4;
  const boxH = 30;

  metrics.forEach((m, i) => {
    const x = margin + i * (boxW + 4);
    doc.setFillColor(198, 210, 193);
    doc.roundedRect(x, y, boxW, boxH, 3, 3, "F");

    doc.setTextColor(2, 39, 1);
    doc.setFontSize(16);
    doc.setFont(font, "bold");
    doc.text(m.value, x + boxW / 2, y + 14, { align: "center" });

    doc.setFontSize(6);
    doc.setFont(font, "normal");
    doc.text(m.label, x + boxW / 2, y + 22, { align: "center" });
  });

  // --- Notes ---
  y += boxH + 15;
  if (recap.notes) {
    doc.setFontSize(8);
    doc.setTextColor(2, 39, 1);
    doc.setFont(font, "normal");
    doc.text("NOTES", margin, y);
    y += 6;
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(recap.notes, contentW);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 8;
  }

  // --- Recap URL ---
  if (recap.recap_url) {
    doc.setFontSize(8);
    doc.setTextColor(2, 39, 1);
    doc.setFont(font, "normal");
    doc.text("FULL RECAP", margin, y);
    y += 6;
    doc.setFontSize(10);
    doc.textWithLink(recap.recap_url, margin, y, { url: recap.recap_url });
    y += 10;
  }

  // --- Media Assets ---
  if (assets.length > 0) {
    doc.setFontSize(8);
    doc.setTextColor(2, 39, 1);
    doc.setFont(font, "normal");
    doc.text("MEDIA ASSETS", margin, y);
    y += 8;

    assets.forEach((asset: any) => {
      if (y > h - 30) {
        doc.addPage();
        doc.setFillColor(245, 243, 237);
        doc.rect(0, 0, w, h, "F");
        y = margin;
      }
      doc.setFontSize(9);
      doc.setTextColor(2, 39, 1);
      doc.setFont(font, "normal");
      doc.textWithLink(`- ${asset.file_name}`, margin + 2, y, { url: asset.file_url });
      y += 6;
    });
  }

  // --- Shareable web link ---
  y = Math.max(y + 10, h - 40);
  if (y > h - 20) {
    doc.addPage();
    doc.setFillColor(245, 243, 237);
    doc.rect(0, 0, w, h, "F");
    y = margin;
  }
  doc.setFontSize(8);
  doc.setTextColor(2, 39, 1);
  doc.setFont(font, "normal");
  doc.text("VIEW ONLINE", margin, y);
  y += 5;
  doc.setFontSize(9);
  const webUrl = `${siteUrl}/recap/${recap.id}`;
  doc.textWithLink(webUrl, margin, y, { url: webUrl });

  // --- Footer ---
  doc.setFillColor(198, 210, 193);
  doc.rect(0, h - 12, w, 12, "F");
  doc.setTextColor(2, 39, 1);
  doc.setFontSize(7);
  doc.setFont(font, "normal");
  doc.text("Breathe & Bloom · Post-Event Partnership Recap", w / 2, h - 5, { align: "center" });

  const fileName = `Recap-${recap.partners?.company_name?.replace(/\s/g, "_")}-${recap.events?.name?.replace(/\s/g, "_")}.pdf`;
  doc.save(fileName);
}
