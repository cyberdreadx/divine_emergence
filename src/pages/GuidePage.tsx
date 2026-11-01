import { useEffect, useRef, useState } from "react";
import { Check, Download, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SignaturePad from "@/components/SignaturePad";
import NotFound from "@/pages/NotFound";
import { BRAND, GUIDE_ENDPOINT, INTAKE_PDF_ENDPOINT } from "@/lib/site";
import { type Block, getGuide } from "@/lib/guides";
import { buildGuidePdf, guideFileName, type GuideSignature } from "@/lib/guidePdf";

const inputClass =
  "w-full rounded-xl border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold/60 transition-colors";
const border = (bad: boolean) => (bad ? "border-red-400" : "border-white/15");

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const ErrorText = ({ msg }: { msg?: string }) => (msg ? <p className="mt-2 text-sm text-red-300">{msg}</p> : null);
const Req = () => <span className="text-gold"> *</span>;

const renderBlock = (b: Block, i: number) => {
  if ("h" in b) return <h2 key={i} className="font-serif text-2xl md:text-3xl text-foreground pt-6">{b.h}</h2>;
  if ("h3" in b) return <h3 key={i} className="font-serif text-xl text-gold pt-2">{b.h3}</h3>;
  if ("note" in b)
    return (
      <p key={i} className="rounded-2xl border border-gold/25 bg-gold/5 px-5 py-4 italic text-foreground/85">
        {b.note}
      </p>
    );
  if ("p" in b) return <p key={i}>{b.p}</p>;
  return (
    <ul key={i} className="list-disc pl-6 space-y-1.5 marker:text-gold/70">
      {b.ul.map((item, j) =>
        typeof item === "string" ? (
          <li key={j}>{item}</li>
        ) : (
          <li key={j}>
            {item.text}
            <ul className="list-[circle] pl-6 mt-1.5 space-y-1">
              {item.sub.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </li>
        )
      )}
    </ul>
  );
};

/** A preparation or integration guide that the client reads, then signs. */
const GuidePage = ({ slug }: { slug: string }) => {
  const guide = getGuide(slug);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", legalName: "", signedDate: todayIso(), signature: "" });
  const [checked, setChecked] = useState<boolean[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null);
  const [botField, setBotField] = useState("");
  const dirty = useRef(false);

  useEffect(() => {
    if (guide) document.title = `${guide.title} | Divine Emergence`;
  }, [guide]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty.current && status !== "done") e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [status]);

  if (!guide) return <NotFound />;

  const set = (key: keyof typeof form, value: string) => {
    dirty.current = true;
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(({ [key]: _, ...rest }) => rest);
  };

  const toggle = (i: number) => {
    dirty.current = true;
    setChecked((c) => {
      const next = [...c];
      next[i] = !next[i];
      return next;
    });
    if (errors[`ack${i}`]) setErrors(({ [`ack${i}`]: _, ...rest }) => rest);
  };

  const sig = (): GuideSignature => ({
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    legalName: form.legalName.trim(),
    signedDate: form.signedDate,
    signature: form.signature,
  });

  const downloadPdf = () => {
    const when = submittedAt ?? new Date();
    buildGuidePdf(guide, sig(), when).save(guideFileName(guide, sig(), when));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    const found: Record<string, string> = {};
    if (!form.firstName.trim()) found.firstName = "Please enter your first name.";
    if (!form.lastName.trim()) found.lastName = "Please enter your last name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) found.email = "Please enter a valid email address.";
    guide.acknowledgments.forEach((_, i) => {
      if (!checked[i]) found[`ack${i}`] = "Please check this box to continue.";
    });
    if (!form.legalName.trim()) found.legalName = "Please type your full legal name.";
    if (!form.signature) found.signature = "Please sign in the box above.";
    if (!form.signedDate) found.signedDate = "Please enter today's date.";
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`field-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const now = new Date();
    if (botField) {
      setSubmittedAt(now);
      setStatus("done");
      return;
    }

    setStatus("submitting");
    const s = sig();
    try {
      // 1. Save the signed PDF onto the client's GoHighLevel contact.
      try {
        const res = await fetch(INTAKE_PDF_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: "guide",
            email: s.email,
            firstName: s.firstName,
            lastName: s.lastName,
            fileName: guideFileName(guide, s, now),
            pdfBase64: buildGuidePdf(guide, s, now).output("datauristring").split(",")[1],
          }),
        });
        if (!res.ok) console.warn("Guide: signed PDF was not saved to GoHighLevel", res.status);
      } catch (err) {
        console.warn("Guide: signed PDF was not saved to GoHighLevel", err);
      }

      // 2. Tell the GoHighLevel workflow (note, tag, email alert).
      if (GUIDE_ENDPOINT) {
        const body = new URLSearchParams({
          guide: guide.title,
          guideSlug: guide.slug,
          guideTag: `signed-${guide.slug}-guide`,
          firstName: s.firstName,
          lastName: s.lastName,
          email: s.email,
          legalName: s.legalName,
          signedDate: s.signedDate,
          acknowledgments: guide.acknowledgments.map((a) => `[X] ${a}`).join("\n"),
          submittedAt: now.toISOString(),
        });
        await fetch(GUIDE_ENDPOINT, { method: "POST", mode: "no-cors", body });
      } else {
        console.warn("Guide: GUIDE_ENDPOINT is empty in src/lib/site.ts, so the workflow was not notified.");
      }
      setSubmittedAt(now);
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const errorCount = Object.keys(errors).length;
  const textInput = (key: "firstName" | "lastName" | "email" | "legalName", label: string, type = "text", auto?: string) => (
    <fieldset id={`field-${key}`}>
      <legend className="block text-sm font-medium text-foreground mb-1">
        {label}
        <Req />
      </legend>
      <input
        type={type}
        autoComplete={auto}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        className={`${inputClass} ${border(!!errors[key])}`}
      />
      <ErrorText msg={errors[key]} />
    </fieldset>
  );

  return (
    <div className="on-dark-bg de-backdrop min-h-screen relative flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16 md:pt-32 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-gold font-sans text-xs uppercase tracking-[0.3em] block mb-4">{guide.eyebrow}</span>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-[1.1]">{guide.title}</h1>
            {status !== "done" && (
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Please read this guide in full. At the end, sign to confirm you have read and understand it.
              </p>
            )}
          </div>

          {status === "done" ? (
            <div className="rounded-3xl border border-white/10 bg-card p-8 md:p-12 text-center">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/15 text-gold ring-1 ring-gold/25 mb-6">
                <ShieldCheck className="w-6 h-6" strokeWidth={1.5} />
              </span>
              <h2 className="font-serif text-3xl text-foreground mb-4">Thank you, {form.firstName.trim()}.</h2>
              {GUIDE_ENDPOINT ? (
                <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
                  Your signed acknowledgment has been received. Please save a copy of the guide for your records,
                  and reach out with any questions.
                </p>
              ) : (
                <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
                  Please download your signed copy below and email it to{" "}
                  <a href={`mailto:${BRAND.email}`} className="text-gold underline underline-offset-4">
                    {BRAND.email}
                  </a>
                  .
                </p>
              )}
              <button
                type="button"
                onClick={downloadPdf}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-sm font-sans uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-90"
              >
                <Download className="w-4 h-4" />
                Download signed copy
              </button>
            </div>
          ) : (
            <>
              <article className="rounded-3xl border border-white/10 bg-card p-6 md:p-10 space-y-4 text-[15px] leading-relaxed text-foreground/85">
                {guide.blocks.map(renderBlock)}
              </article>

              <form onSubmit={submit} noValidate className="mt-8 rounded-3xl border border-gold/25 bg-card p-6 md:p-10">
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={botField}
                  onChange={(e) => setBotField(e.target.value)}
                  className="hidden"
                  aria-hidden="true"
                />
                <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2">Sign to confirm you've read this guide</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Questions marked <span className="text-gold">*</span> are required.
                </p>

                <div className="grid gap-6 sm:grid-cols-2">
                  {textInput("firstName", "First Name", "text", "given-name")}
                  {textInput("lastName", "Last Name", "text", "family-name")}
                  <div className="sm:col-span-2">{textInput("email", "Email", "email", "email")}</div>
                </div>

                <div className="mt-8 space-y-4">
                  <p className="text-sm font-medium text-foreground">
                    Please confirm:
                    <Req />
                  </p>
                  {guide.acknowledgments.map((a, i) => (
                    <div key={a} id={`field-ack${i}`}>
                      <label className="flex items-start gap-3 cursor-pointer text-sm text-foreground/90 leading-relaxed">
                        <input type="checkbox" className="sr-only" checked={!!checked[i]} onChange={() => toggle(i)} />
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                            checked[i] ? "bg-gold border-gold text-background" : "border-white/30 bg-background/40"
                          }`}
                        >
                          {checked[i] && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                        </span>
                        <span>{a}</span>
                      </label>
                      <ErrorText msg={errors[`ack${i}`]} />
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  {textInput("legalName", "Full Legal Name", "text", "name")}
                  <fieldset id="field-signedDate">
                    <legend className="block text-sm font-medium text-foreground mb-1">
                      Date
                      <Req />
                    </legend>
                    <input
                      type="date"
                      value={form.signedDate}
                      onChange={(e) => set("signedDate", e.target.value)}
                      className={`${inputClass} ${border(!!errors.signedDate)}`}
                    />
                    <ErrorText msg={errors.signedDate} />
                  </fieldset>
                  <fieldset id="field-signature" className="sm:col-span-2">
                    <legend className="block text-sm font-medium text-foreground mb-2">
                      Signature
                      <Req />
                    </legend>
                    <SignaturePad value={form.signature} onChange={(v) => set("signature", v)} invalid={!!errors.signature} />
                    <ErrorText msg={errors.signature} />
                  </fieldset>
                </div>

                <div className="mt-8 text-center">
                  {errorCount > 0 && (
                    <p className="mb-4 text-sm text-red-300">
                      {errorCount === 1 ? "One answer needs" : `${errorCount} answers need`} your attention above.
                    </p>
                  )}
                  {status === "error" && (
                    <p className="mb-4 text-sm text-red-300">Something went wrong sending your form. Please try again.</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="inline-flex items-center justify-center rounded-full bg-gold px-10 py-4 text-sm font-sans uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {status === "submitting" ? "Sending..." : "Sign and submit"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GuidePage;
