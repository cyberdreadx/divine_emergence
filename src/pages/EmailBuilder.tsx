import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Download, RotateCcw } from "lucide-react";
import { DEFAULT_EMAIL, type WeeklyEmail, buildWeeklyEmail } from "@/lib/weeklyEmail";

const STORAGE_KEY = "de-weekly-email-draft";

const loadDraft = (): WeeklyEmail => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_EMAIL, ...JSON.parse(raw) };
  } catch {
    // Private browsing or blocked storage: start from the template.
  }
  return DEFAULT_EMAIL;
};

const inputClass =
  "w-full rounded-xl border border-white/15 bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold/60 transition-colors";

/**
 * Weekly email builder for Laura. She fills in the title and message, checks
 * the live preview, then copies the finished HTML into GoHighLevel. Not linked
 * from the site and kept out of search results. Nothing is sent anywhere; the
 * draft is only remembered in this browser.
 */
const EmailBuilder = () => {
  const [email, setEmail] = useState<WeeklyEmail>(loadDraft);
  const [copied, setCopied] = useState(false);
  const html = useMemo(() => buildWeeklyEmail(email), [email]);

  useEffect(() => {
    document.title = "Weekly Email Builder | Divine Emergence";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(email));
    } catch {
      // Not saved; the builder still works.
    }
  }, [email]);

  const set = (key: keyof WeeklyEmail) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setEmail((m) => ({ ...m, [key]: e.target.value }));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(html);
    } catch {
      // Older browsers: copy through a temporary text box.
      const t = document.createElement("textarea");
      t.value = html;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `weekly-email-${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    if (window.confirm("Start over from the blank template? Your current draft will be cleared.")) setEmail(DEFAULT_EMAIL);
  };

  const field = (key: keyof WeeklyEmail, label: string, hint?: string, rows?: number) => (
    <label className="block">
      <span className="block text-sm font-medium text-foreground mb-1">{label}</span>
      {hint && <span className="block text-xs text-muted-foreground mb-2">{hint}</span>}
      {rows ? (
        <textarea rows={rows} value={email[key]} onChange={set(key)} className={`${inputClass} resize-y leading-relaxed`} />
      ) : (
        <input type="text" value={email[key]} onChange={set(key)} className={inputClass} />
      )}
    </label>
  );

  return (
    <div className="on-dark-bg de-backdrop min-h-screen px-4 py-10 md:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <span className="text-gold font-sans text-xs uppercase tracking-[0.3em] block mb-3">Divine Emergence</span>
          <h1 className="font-serif text-3xl md:text-4xl text-foreground">Weekly Email Builder</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed">
            Write this week's note on the left and check the preview on the right. When it looks right, tap{" "}
            <span className="text-gold">Copy email</span> and paste it into the Code block of your GoHighLevel email.
            Your draft is saved in this browser.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <section className="rounded-3xl border border-white/10 bg-card p-6 md:p-8 space-y-5">
            {field("title", "Note title", "The big italic headline.")}
            {field("body", "Message", "Leave a blank line between paragraphs. Wrap a word in **double stars** to make it gold.", 12)}
            <details className="rounded-2xl border border-white/10 px-4 py-3">
              <summary className="cursor-pointer text-sm text-muted-foreground">More options (label, greeting, button, closing)</summary>
              <div className="mt-4 space-y-5">
                {field("preheader", "Inbox preview line", "The grey line shown after the subject in the inbox.")}
                {field("eyebrow", "Small label above the title", "For example: Monday Note")}
                {field("greeting", "Greeting", "{{contact.first_name}} is filled in with each person's first name.")}
                {field("buttonLabel", "Button text", "Leave empty for no button this week.")}
                {field("buttonUrl", "Button link")}
                {field("closing", "Closing line", "Shown above “With love, Laura”. Leave empty to skip.")}
              </div>
            </details>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-sans uppercase tracking-[0.18em] text-background hover:opacity-90"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy email"}
              </button>
              <button
                type="button"
                onClick={download}
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-xs uppercase tracking-[0.16em] text-foreground hover:border-gold hover:text-gold"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4" />
                Start over
              </button>
            </div>
          </section>

          <section>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Preview</p>
            <iframe
              title="Email preview"
              srcDoc={`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#110c1d;">${html}</body></html>`}
              className="w-full h-[900px] rounded-2xl border border-white/10 bg-[#110c1d]"
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default EmailBuilder;
