// Builds the Divine Emergence weekly email as HTML that holds up across mail
// apps (Gmail, Apple Mail, Outlook desktop and web, Yahoo, phone apps).
//
// Used by the email builder page (/email-builder) and to generate
// docs/weekly-email-template.html. Email apps ignore most modern CSS, so this
// sticks to the safe subset:
// - layout with tables, colors set with both bgcolor attributes and inline CSS
//   (several apps strip one or the other)
// - solid hex colors only (no rgba, gradients or CSS variables)
// - fluid width up to 600px, plus a fixed 600px table only Outlook sees
// - a button that is a colored table cell, with a VML version for Outlook
// - Georgia and Arial, since web fonts don't load in most mail apps

export interface WeeklyEmail {
  /** Hidden preview line shown in the inbox list. */
  preheader: string;
  /** Small gold label above the title, e.g. "Monday Note". */
  eyebrow: string;
  /** The note title. */
  title: string;
  /** Greeting line. GoHighLevel fills {{contact.first_name}}. */
  greeting: string;
  /** The message. A blank line starts a new paragraph; **word** is gold. */
  body: string;
  /** Optional button. Leave the label empty for no button. */
  buttonLabel: string;
  buttonUrl: string;
  /** Optional closing line before the sign-off. */
  closing: string;
}

export const DEFAULT_EMAIL: WeeklyEmail = {
  preheader: "A note from me to start your week.",
  eyebrow: "Monday Note",
  title: "Your note title here.",
  greeting: "Hi {{contact.first_name}},",
  body:
    "Write this week's message here. Speak the way you would to one person. A single reflection, invitation, or story lands better than a list of announcements.\n\nKeep paragraphs short. Leave a blank line between paragraphs, and wrap a word in **double stars** to make it gold.",
  buttonLabel: "Book your free clarity call",
  buttonUrl: "https://grow.divineemergence.org/widget/booking/8FEdtQqFLFvSMLL4yl4O",
  closing: "Breathe easy. I'll be in touch soon.",
};

const C = {
  page: "#110c1d",
  card: "#1b1430",
  border: "#3a2c4c",
  gold: "#e4b158",
  heading: "#f5f1eb",
  text: "#e2dbcf",
  muted: "#b9b1a3",
  footer: "#8a8399",
  buttonText: "#14101f",
};

const SERIF = "Georgia,'Times New Roman',Times,serif";
const SANS = "Arial,Helvetica,sans-serif";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Escapes text, keeps GoHighLevel merge fields, and turns **word** gold. */
const inline = (s: string) =>
  esc(s.trim()).replace(/\*\*(.+?)\*\*/g, `<strong style="color:${C.gold};font-weight:bold;">$1</strong>`);

const paragraphs = (body: string) =>
  body
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin:0 0 18px 0;font-family:${SANS};font-size:16px;line-height:26px;color:${C.text};">${inline(p).replace(/\n/g, "<br>")}</p>`
    )
    .join("\n              ");

const safeUrl = (u: string) => (/^(https?:|mailto:|tel:|\{\{)/i.test(u.trim()) ? esc(u.trim()) : "#");

function button(label: string, url: string): string {
  if (!label.trim()) return "";
  const href = safeUrl(url);
  const text = esc(label.trim());
  return `
          <tr>
            <td align="center" bgcolor="${C.card}" style="padding:12px 40px 8px 40px;background-color:${C.card};">
              <!--[if mso]>
              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:48px;v-text-anchor:middle;width:320px;" arcsize="50%" stroke="f" fillcolor="${C.gold}">
                <w:anchorlock/>
                <center style="color:${C.buttonText};font-family:${SANS};font-size:13px;font-weight:bold;letter-spacing:2px;">${text.toUpperCase()}</center>
              </v:roundrect>
              <![endif]-->
              <!--[if !mso]><!-->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;">
                <tr>
                  <td align="center" bgcolor="${C.gold}" style="background-color:${C.gold};border-radius:999px;">
                    <a href="${href}" target="_blank" style="display:inline-block;padding:15px 34px;font-family:${SANS};font-size:13px;line-height:18px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;color:${C.buttonText};text-decoration:none;border-radius:999px;">${text}</a>
                  </td>
                </tr>
              </table>
              <!--<![endif]-->
            </td>
          </tr>`;
}

/** The full email, ready to paste into a GoHighLevel "Code / Custom HTML" block. */
export function buildWeeklyEmail(e: WeeklyEmail): string {
  return `<!-- Divine Emergence weekly email. Made with divineemergence.org/email-builder -->
<div style="margin:0;padding:0;background-color:${C.page};">
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;color:${C.page};">${esc(e.preheader.trim())}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.page}" style="width:100%;background-color:${C.page};border-collapse:collapse;">
    <tr>
      <td align="center" bgcolor="${C.page}" style="padding:32px 12px;background-color:${C.page};">
        <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td><![endif]-->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.card}" style="width:100%;max-width:600px;background-color:${C.card};border:1px solid ${C.border};border-radius:24px;border-collapse:separate;">
          <tr>
            <td align="center" bgcolor="${C.card}" style="padding:44px 32px 8px 32px;background-color:${C.card};border-radius:24px 24px 0 0;">
              <p style="margin:0;font-family:${SANS};font-size:13px;line-height:18px;letter-spacing:6px;text-transform:uppercase;color:${C.gold};">Divine Emergence</p>
              <p style="margin:8px 0 0 0;font-family:${SANS};font-size:12px;line-height:16px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};">Awaken Your Inner Light</p>
            </td>
          </tr>
          <tr>
            <td align="center" bgcolor="${C.card}" style="padding:24px 32px 0 32px;background-color:${C.card};">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                <td width="56" height="2" bgcolor="${C.gold}" style="width:56px;height:2px;background-color:${C.gold};font-size:0;line-height:0;">&nbsp;</td>
              </tr></table>
            </td>
          </tr>
          <tr>
            <td align="center" bgcolor="${C.card}" style="padding:28px 32px 4px 32px;background-color:${C.card};">
              ${e.eyebrow.trim() ? `<p style="margin:0;font-family:${SANS};font-size:12px;line-height:16px;letter-spacing:4px;text-transform:uppercase;color:${C.gold};">${esc(e.eyebrow.trim())}</p>` : ""}
              <p style="margin:14px 0 0 0;font-family:${SERIF};font-size:32px;line-height:40px;font-style:italic;font-weight:normal;color:${C.heading};">${inline(e.title)}</p>
            </td>
          </tr>
          <tr>
            <td bgcolor="${C.card}" style="padding:24px 40px 4px 40px;background-color:${C.card};">
              ${e.greeting.trim() ? `<p style="margin:0 0 18px 0;font-family:${SANS};font-size:16px;line-height:26px;color:${C.text};">${inline(e.greeting)}</p>` : ""}
              ${paragraphs(e.body)}
            </td>
          </tr>${button(e.buttonLabel, e.buttonUrl)}
          <tr>
            <td bgcolor="${C.card}" style="padding:20px 40px 40px 40px;background-color:${C.card};border-radius:0 0 24px 24px;">
              ${e.closing.trim() ? `<p style="margin:0 0 18px 0;font-family:${SANS};font-size:16px;line-height:26px;color:${C.text};">${inline(e.closing)}</p>` : ""}
              <p style="margin:0;font-family:${SANS};font-size:15px;line-height:22px;color:${C.muted};">With love,</p>
              <p style="margin:2px 0 0 0;font-family:${SERIF};font-size:22px;line-height:30px;font-style:italic;color:${C.heading};">Laura</p>
              <p style="margin:0;font-family:${SANS};font-size:13px;line-height:20px;letter-spacing:1px;color:${C.muted};">Divine Emergence</p>
            </td>
          </tr>
        </table>
        <!--[if mso]></td></tr></table><![endif]-->
        <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td><![endif]-->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
          <tr>
            <td align="center" style="padding:22px 24px 8px 24px;font-family:${SANS};font-size:12px;line-height:19px;color:${C.footer};">
              Divine Emergence &middot; South Florida<br>
              You're receiving this because you joined the community at <a href="https://divineemergence.org" target="_blank" style="color:${C.footer};text-decoration:underline;">divineemergence.org</a>.<br>
              <a href="{{unsubscribe_link}}" style="color:${C.footer};text-decoration:underline;">Unsubscribe</a>
            </td>
          </tr>
        </table>
        <!--[if mso]></td></tr></table><![endif]-->
      </td>
    </tr>
  </table>
</div>`;
}
