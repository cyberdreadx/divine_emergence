import { useEffect, useRef, useState } from "react";
import { Check, Download, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SignaturePad from "@/components/SignaturePad";
import { BRAND, INTAKE_ENDPOINT, INTAKE_PDF_ENDPOINT } from "@/lib/site";
import {
  type Answers,
  type Contact,
  type Field,
  SECTIONS,
  WAIVER,
  WAIVER_CONFIRMATIONS,
  WAIVER_INTRO,
  WAIVER_TITLE,
  formatAnswer,
  isRequired,
  isShown,
  picked,
  validate,
} from "@/lib/intake";
import { buildIntakePdf, intakeFileName } from "@/lib/intakePdf";

const inputClass =
  "w-full rounded-xl border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold/60 transition-colors";
const border = (bad: boolean) => (bad ? "border-red-400" : "border-white/15");

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const Req = () => <span className="text-gold"> *</span>;
const ErrorText = ({ msg }: { msg?: string }) =>
  msg ? <p className="mt-2 text-sm text-red-300">{msg}</p> : null;

const Box = ({ checked }: { checked: boolean }) => (
  <span
    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
      checked ? "bg-gold border-gold text-background" : "border-white/30 bg-background/40"
    }`}
  >
    {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
  </span>
);

const CheckRow = ({ label, checked, onToggle, round }: { label: string; checked: boolean; onToggle: () => void; round?: boolean }) => (
  <label className="flex items-start gap-3 cursor-pointer text-sm text-foreground/90 leading-relaxed">
    <input type={round ? "radio" : "checkbox"} className="sr-only" checked={checked} onChange={onToggle} />
    {round ? (
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
          checked ? "border-gold" : "border-white/30 bg-background/40"
        }`}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-gold" />}
      </span>
    ) : (
      <Box checked={checked} />
    )}
    <span>{label}</span>
  </label>
);

const Intake = () => {
  const [answers, setAnswers] = useState<Answers>({ signedDate: todayIso() });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null);
  const [botField, setBotField] = useState("");
  const dirty = useRef(false);

  useEffect(() => {
    document.title = "Ceremony Intake Form | Divine Emergence";
  }, []);

  // Warn before leaving with a half-finished form. Answers are not saved on the
  // device, since this is private health information.
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty.current && status !== "done") e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [status]);

  const set = (id: string, value: Answers[string]) => {
    dirty.current = true;
    setAnswers((a) => ({ ...a, [id]: value }));
    if (errors[id]) setErrors(({ [id]: _, ...rest }) => rest);
  };

  const toggle = (f: Extract<Field, { type: "checkboxes" }>, option: string) => {
    const current = picked(answers, f.id);
    let next: string[];
    if (current.includes(option)) next = current.filter((o) => o !== option);
    else if (option === f.noneOption) next = [option];
    else next = [...current.filter((o) => o !== f.noneOption), option];
    set(f.id, next);
  };

  const setContact = (i: number, key: keyof Contact, value: string) => {
    const list = [...((answers.emergencyContacts as Contact[]) ?? [])];
    list[i] = { name: "", relationship: "", phone: "", ...list[i], [key]: value };
    set("emergencyContacts", list);
  };

  const downloadPdf = () => {
    const when = submittedAt ?? new Date();
    buildIntakePdf(answers, when).save(intakeFileName(answers, when));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    const found = validate(answers);
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
    try {
      // Save the signed PDF onto the client's GoHighLevel contact first (via
      // netlify/functions/intake-pdf.mjs), so it is already there when the
      // webhook below sets off the workflow's email alert. If this fails the
      // answers still go through; the client also keeps their own copy.
      try {
        const pdfBase64 = buildIntakePdf(answers, now).output("datauristring").split(",")[1];
        const res = await fetch(INTAKE_PDF_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: (answers.email as string).trim(),
            firstName: (answers.firstName as string).trim(),
            lastName: (answers.lastName as string).trim(),
            phone: (answers.phone as string).trim(),
            fileName: intakeFileName(answers, now),
            pdfBase64,
          }),
        });
        if (!res.ok) console.warn("Intake: signed PDF was not saved to GoHighLevel", res.status);
      } catch (err) {
        console.warn("Intake: signed PDF was not saved to GoHighLevel", err);
      }

      if (INTAKE_ENDPOINT) {
        // Each answer is sent as its own form field (named by its id in
        // src/lib/intake.ts) so it can be mapped to a contact field in
        // GoHighLevel, plus one readable `summary` of the whole form.
        const body = new URLSearchParams();
        const lines: string[] = [];
        for (const section of SECTIONS) {
          lines.push(`== ${section.title} ==`);
          for (const f of section.fields) {
            if (!isShown(f, answers)) continue;
            const text = formatAnswer(f, answers);
            body.set(f.id, text);
            lines.push(`${f.label}\n${text || "-"}\n`);
          }
        }
        for (const c of WAIVER_CONFIRMATIONS) body.set(c.id, answers[c.id] === true ? "Yes" : "No");
        body.set("legalName", (answers.legalName as string).trim());
        body.set("signedDate", answers.signedDate as string);
        body.set("signature", answers.signature as string);
        body.set("submittedAt", now.toISOString());
        body.set("summary", lines.join("\n"));
        // GHL's webhook host sends no CORS headers, so the response can't be
        // read; a completed request counts as delivered.
        await fetch(INTAKE_ENDPOINT, { method: "POST", mode: "no-cors", body });
      } else {
        console.warn("Intake: INTAKE_ENDPOINT is empty in src/lib/site.ts, so this form was not sent.");
      }
      setSubmittedAt(now);
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const renderField = (f: Field) => {
    if (!isShown(f, answers)) return null;
    const err = errors[f.id];
    const req = isRequired(f, answers);
    const value = answers[f.id];

    if (f.type === "confirm") {
      return (
        <div key={f.id} id={`field-${f.id}`}>
          <CheckRow label={f.label + (req ? " *" : "")} checked={value === true} onToggle={() => set(f.id, value !== true)} />
          <ErrorText msg={err} />
        </div>
      );
    }

    const label = (
      <legend className="block text-sm font-medium text-foreground mb-1 leading-relaxed">
        {f.label}
        {req && <Req />}
      </legend>
    );
    const hint = f.hint && <p className="text-xs text-muted-foreground mb-3">{f.hint}</p>;

    let control: React.ReactNode;
    if (f.type === "contacts") {
      const list = (value as Contact[]) ?? [];
      control = (
        <div className="space-y-4">
          {Array.from({ length: f.count }, (_, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-3">
              <p className="sm:col-span-3 text-xs uppercase tracking-[0.2em] text-gold/80">Contact {i + 1}</p>
              {(["name", "relationship", "phone"] as const).map((k) => (
                <input
                  key={k}
                  type={k === "phone" ? "tel" : "text"}
                  placeholder={k[0].toUpperCase() + k.slice(1)}
                  aria-label={`Contact ${i + 1} ${k}`}
                  value={list[i]?.[k] ?? ""}
                  onChange={(e) => setContact(i, k, e.target.value)}
                  className={`${inputClass} ${border(!!err && !list[i]?.[k]?.trim())}`}
                />
              ))}
            </div>
          ))}
        </div>
      );
    } else if (f.type === "checkboxes") {
      const list = picked(answers, f.id);
      control = (
        <div className="grid gap-3 mt-2">
          {f.options.map((o) => (
            <CheckRow key={o} label={o} checked={list.includes(o)} onToggle={() => toggle(f, o)} />
          ))}
        </div>
      );
    } else if (f.type === "choice") {
      control = (
        <div className="flex flex-wrap gap-6 mt-2" role="radiogroup">
          {f.options.map((o) => (
            <CheckRow key={o} round label={o} checked={value === o} onToggle={() => set(f.id, o)} />
          ))}
        </div>
      );
    } else if (f.type === "textarea") {
      control = (
        <textarea
          rows={4}
          value={(value as string) ?? ""}
          onChange={(e) => set(f.id, e.target.value)}
          className={`${inputClass} ${border(!!err)} resize-y`}
        />
      );
    } else {
      control = (
        <input
          type={f.type}
          value={(value as string) ?? ""}
          max={f.type === "date" ? todayIso() : undefined}
          autoComplete={
            { firstName: "given-name", lastName: "family-name", email: "email", phone: "tel", dob: "bday" }[f.id]
          }
          onChange={(e) => set(f.id, e.target.value)}
          className={`${inputClass} ${border(!!err)}`}
        />
      );
    }

    const wide = f.type !== "text" && f.type !== "email" && f.type !== "tel" && f.type !== "date";
    return (
      <fieldset key={f.id} id={`field-${f.id}`} className={wide ? "sm:col-span-2" : undefined}>
        {label}
        {hint}
        {control}
        <ErrorText msg={err} />
      </fieldset>
    );
  };

  const errorCount = Object.keys(errors).length;

  return (
    <div className="on-dark-bg de-backdrop min-h-screen relative flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 md:pt-32 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-gold font-sans text-xs uppercase tracking-[0.3em] block mb-4">
              Divine Emergence, LLC
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-[1.1]">
              Ceremony Intake Form and Waiver
            </h1>
            {status !== "done" && (
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Please complete every section honestly. Your answers are kept private and are used only
                to keep you safe. Questions marked <span className="text-gold">*</span> are required.
              </p>
            )}
          </div>

          {status === "done" ? (
            <div className="rounded-3xl border border-white/10 bg-card p-8 md:p-12 text-center">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/15 text-gold ring-1 ring-gold/25 mb-6">
                <ShieldCheck className="w-6 h-6" strokeWidth={1.5} />
              </span>
              <h2 className="font-serif text-3xl text-foreground mb-4">Thank you, {answers.firstName as string}.</h2>
              {INTAKE_ENDPOINT ? (
                <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
                  Your intake form and signed waiver have been received. Laura will review your answers
                  personally and reach out before your ceremony. Please save a copy for your records.
                </p>
              ) : (
                <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
                  Please download your signed copy below and email it to{" "}
                  <a href={`mailto:${BRAND.email}`} className="text-gold underline underline-offset-4">
                    {BRAND.email}
                  </a>{" "}
                  so Laura can review it before your ceremony.
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
            <form onSubmit={submit} noValidate className="space-y-8">
              {/* Honeypot: hidden from people, often filled by bots. */}
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

              {SECTIONS.map((section) => (
                <section key={section.id} className="rounded-3xl border border-white/10 bg-card p-6 md:p-10">
                  <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-6">{section.title}</h2>
                  <div className="grid gap-6 sm:grid-cols-2">{section.fields.map(renderField)}</div>
                </section>
              ))}

              <section className="rounded-3xl border border-white/10 bg-card p-6 md:p-10">
                <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">{WAIVER_TITLE}</h2>
                <p className="text-muted-foreground mb-6">{WAIVER_INTRO}</p>
                <ol className="space-y-4 text-sm text-foreground/85 leading-relaxed max-h-[28rem] overflow-y-auto rounded-2xl border border-white/10 bg-background/40 p-5 md:p-6">
                  {WAIVER.map((c, i) => (
                    <li key={c.title}>
                      <span className="font-semibold text-foreground">
                        {i + 1}. {c.title}.
                      </span>{" "}
                      {c.body}
                      {c.bullets && (
                        <ul className="list-disc pl-6 my-2 space-y-1">
                          {c.bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      )}
                      {c.after && <p>{c.after}</p>}
                    </li>
                  ))}
                </ol>

                <div className="mt-8 space-y-4">
                  <p className="text-sm font-medium text-foreground">
                    Please confirm:<Req />
                  </p>
                  {WAIVER_CONFIRMATIONS.map((c) => (
                    <div key={c.id} id={`field-${c.id}`}>
                      <CheckRow label={c.label} checked={answers[c.id] === true} onToggle={() => set(c.id, answers[c.id] !== true)} />
                      <ErrorText msg={errors[c.id]} />
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <fieldset id="field-legalName">
                    <legend className="block text-sm font-medium text-foreground mb-1">
                      Full Legal Name<Req />
                    </legend>
                    <input
                      type="text"
                      autoComplete="name"
                      value={(answers.legalName as string) ?? ""}
                      onChange={(e) => set("legalName", e.target.value)}
                      className={`${inputClass} ${border(!!errors.legalName)}`}
                    />
                    <ErrorText msg={errors.legalName} />
                  </fieldset>
                  <fieldset id="field-signedDate">
                    <legend className="block text-sm font-medium text-foreground mb-1">
                      Date<Req />
                    </legend>
                    <input
                      type="date"
                      value={(answers.signedDate as string) ?? ""}
                      onChange={(e) => set("signedDate", e.target.value)}
                      className={`${inputClass} ${border(!!errors.signedDate)}`}
                    />
                    <ErrorText msg={errors.signedDate} />
                  </fieldset>
                  <fieldset id="field-signature" className="sm:col-span-2">
                    <legend className="block text-sm font-medium text-foreground mb-2">
                      Signature<Req />
                    </legend>
                    <SignaturePad
                      value={(answers.signature as string) ?? ""}
                      onChange={(v) => set("signature", v)}
                      invalid={!!errors.signature}
                    />
                    <ErrorText msg={errors.signature} />
                  </fieldset>
                </div>
              </section>

              <div className="text-center">
                {errorCount > 0 && (
                  <p className="mb-4 text-sm text-red-300">
                    {errorCount === 1 ? "One answer needs" : `${errorCount} answers need`} your attention above.
                  </p>
                )}
                {status === "error" && (
                  <p className="mb-4 text-sm text-red-300">
                    Something went wrong sending your form. Please check your connection and try again.
                  </p>
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Intake;
