interface CalendarEvent {
  name: string;
  date: string; // YYYY-MM-DD
  time?: string | null; // HH:mm
  endTime?: string | null; // HH:mm
  location?: string | null;
  description?: string | null;
}

export function generateICS(event: CalendarEvent): string {
  const pad = (n: number) => String(n).padStart(2, "0");

  const dateObj = new Date(event.date + "T00:00:00");
  const year = dateObj.getFullYear();
  const month = pad(dateObj.getMonth() + 1);
  const day = pad(dateObj.getDate());

  let dtStart: string;
  let dtEnd: string;

  if (event.time) {
    const [h, m] = event.time.split(":").map(Number);
    dtStart = `${year}${month}${day}T${pad(h)}${pad(m)}00`;

    if (event.endTime) {
      const [eh, em] = event.endTime.split(":").map(Number);
      dtEnd = `${year}${month}${day}T${pad(eh)}${pad(em)}00`;
    } else {
      // Default 2-hour event
      const endH = h + 2;
      dtEnd = `${year}${month}${day}T${pad(endH)}${pad(m)}00`;
    }
  } else {
    // All-day event
    dtStart = `${year}${month}${day}`;
    const nextDay = new Date(dateObj);
    nextDay.setDate(nextDay.getDate() + 1);
    dtEnd = `${nextDay.getFullYear()}${pad(nextDay.getMonth() + 1)}${pad(nextDay.getDate())}`;
  }

  const escapeText = (text: string) =>
    text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Breathe & Bloom//Event//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    event.time ? `DTSTART:${dtStart}` : `DTSTART;VALUE=DATE:${dtStart}`,
    event.time ? `DTEND:${dtEnd}` : `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${escapeText(event.name)}`,
  ];

  if (event.location) lines.push(`LOCATION:${escapeText(event.location)}`);
  if (event.description) lines.push(`DESCRIPTION:${escapeText(event.description)}`);

  lines.push(
    `UID:${Date.now()}@breatheandbloom`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    "END:VEVENT",
    "END:VCALENDAR"
  );

  return lines.join("\r\n");
}

export function downloadICS(event: CalendarEvent) {
  const ics = generateICS(event);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.name.replace(/\s+/g, "_")}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
