// Saves a client's signed Ceremony Intake PDF onto their GoHighLevel contact.
//
// The intake page (src/pages/Intake.tsx) posts here before it sends the
// answers to the GoHighLevel webhook. This function:
//   1. creates or updates the contact by email, and
//   2. uploads the PDF into the contact's "Signed Intake PDF" File Upload field.
// The workflow's email alert can then link to it with {{contact.signed_intake_pdf}}.
//
// Netlify environment variables (Site configuration → Environment variables):
//   GHL_PRIVATE_TOKEN  GoHighLevel Private Integration token (keep secret)
//   GHL_LOCATION_ID    sub-account ID (defaults to Divine Emergence's)
//   GHL_PDF_FIELD_KEY  custom field key (defaults to contact.signed_intake_pdf)

import { randomUUID } from "node:crypto";

const API = "https://services.leadconnectorhq.com";
const MAX_PDF_BYTES = 5 * 1024 * 1024;

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

// GoHighLevel's docs now list Version "v3"; older accounts expect
// "2021-07-28". Try v3 first and fall back once if it is rejected.
async function ghl(path, init, token) {
  let last;
  for (const version of ["v3", "2021-07-28"]) {
    const res = await fetch(API + path, {
      ...init,
      headers: { Authorization: `Bearer ${token}`, Version: version, Accept: "application/json", ...init.headers },
    });
    const text = await res.text();
    if (res.ok) return text ? JSON.parse(text) : {};
    last = `${res.status} ${text.slice(0, 300)}`;
    if (res.status === 401 || res.status === 403) break; // a bad token won't be fixed by another version
  }
  throw new Error(`GoHighLevel ${init.method ?? "GET"} ${path.split("?")[0]} failed: ${last}`);
}

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "POST only" });

  const token = process.env.GHL_PRIVATE_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID || "Xf8ncPOdulMSwnurGzU0";
  const fieldKey = process.env.GHL_PDF_FIELD_KEY || "contact.signed_intake_pdf";
  if (!token) return json(503, { error: "GHL_PRIVATE_TOKEN is not set in Netlify" });

  let data;
  try {
    data = await req.json();
  } catch {
    return json(400, { error: "Invalid JSON" });
  }
  const { email, firstName = "", lastName = "", phone = "", fileName = "Intake.pdf", pdfBase64 } = data ?? {};
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return json(400, { error: "Valid email required" });
  if (typeof pdfBase64 !== "string" || !pdfBase64) return json(400, { error: "PDF required" });

  const pdf = Buffer.from(pdfBase64, "base64");
  if (pdf.length > MAX_PDF_BYTES || pdf.subarray(0, 5).toString() !== "%PDF-") return json(400, { error: "Not a valid PDF" });

  try {
    // 1. Find the File Upload field by its key.
    const { customFields = [] } = await ghl(`/locations/${locationId}/customFields?model=contact`, {}, token);
    const field = customFields.find((f) => f.fieldKey === fieldKey);
    if (!field) return json(500, { error: `No contact custom field with key ${fieldKey}` });

    // 2. Create or update the contact by email.
    const upsert = await ghl(
      "/contacts/upsert",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId,
          email: email.trim(),
          firstName: String(firstName).slice(0, 100),
          lastName: String(lastName).slice(0, 100),
          phone: String(phone).slice(0, 40),
          source: "Ceremony Intake Form",
        }),
      },
      token
    );
    const contactId = upsert.contact?.id;
    if (!contactId) throw new Error("Upsert returned no contact id");

    // 3. Upload the PDF into that field. Key format: <customFieldId>_<randomId>.
    const safeName = String(fileName).replace(/[^\w.-]+/g, "-").slice(0, 80) || "Intake.pdf";
    const form = new FormData();
    form.append(`${field.id}_${randomUUID()}`, new Blob([pdf], { type: "application/pdf" }), safeName);
    const query = `contactId=${encodeURIComponent(contactId)}&locationId=${encodeURIComponent(locationId)}`;
    await ghl(`/forms/upload-custom-files?${query}`, { method: "POST", body: form }, token);

    return json(200, { ok: true });
  } catch (err) {
    console.error(err);
    return json(502, { error: "Could not save the PDF to GoHighLevel" });
  }
};

export const config = { path: "/api/intake-pdf" };
