// Ceremony Intake Form and Waiver content.
//
// Every question, checkbox option, and waiver paragraph lives here so the copy
// can be edited in one place. The page (src/pages/Intake.tsx) renders these
// fields, checks required answers, sends them to INTAKE_ENDPOINT, and builds a
// signed PDF copy (src/lib/intakePdf.ts).

export type Answers = Record<string, string | string[] | boolean | Contact[]>;

export interface Contact {
  name: string;
  relationship: string;
  phone: string;
}

type Condition = (a: Answers) => boolean;

interface BaseField {
  id: string;
  label: string;
  hint?: string;
  /** true, or a rule that decides from the other answers. */
  required?: boolean | Condition;
  /** Only show (and only send) this field when the rule passes. */
  showIf?: Condition;
}

export type Field =
  | (BaseField & { type: "text" | "email" | "tel" | "date" | "textarea" })
  | (BaseField & { type: "choice"; options: string[] })
  | (BaseField & { type: "checkboxes"; options: string[]; noneOption?: string })
  | (BaseField & { type: "confirm" })
  | (BaseField & { type: "contacts"; count: number });

export interface Section {
  id: string;
  title: string;
  intro?: string;
  fields: Field[];
}

export const NONE = "None of the above";

/** The answer to a checkbox field, as a list. */
export const picked = (a: Answers, id: string): string[] =>
  Array.isArray(a[id]) ? (a[id] as string[]) : [];

/** True when something other than "None of the above" is checked. */
const pickedAny = (id: string): Condition => (a) =>
  picked(a, id).some((v) => v !== NONE);

const is = (id: string, ...values: string[]): Condition => (a) =>
  values.includes(a[id] as string);

export const SECTIONS: Section[] = [
  {
    id: "about",
    title: "Part 1: About You",
    fields: [
      { id: "firstName", label: "First Name", type: "text", required: true },
      { id: "lastName", label: "Last Name", type: "text", required: true },
      { id: "dob", label: "Date of Birth", type: "date", required: true },
      { id: "email", label: "Email", type: "email", required: true },
      { id: "phone", label: "Phone", type: "tel", required: true },
      { id: "height", label: "Height", type: "text", required: true, hint: "e.g. 5'6\"" },
      { id: "weight", label: "Weight", type: "text", required: true, hint: "e.g. 140 lbs" },
      { id: "occupation", label: "Occupation", type: "text" },
      { id: "is18", label: "I confirm I am 18 years of age or older.", type: "confirm", required: true },
      {
        id: "emergencyContacts",
        label: "Emergency Contacts (please provide 2)",
        type: "contacts",
        count: 2,
        required: true,
      },
    ],
  },
  {
    id: "life",
    title: "Part 2: Your Life and Support",
    fields: [
      { id: "hobbies", label: "What are your hobbies and interests?", type: "textarea" },
      { id: "challenges", label: "What challenges are you facing right now?", type: "textarea", required: true },
      { id: "goals", label: "What are your current goals?", type: "textarea", required: true },
      {
        id: "supportNetwork",
        label: "Who is in your support network? (friends, family, spiritual teachers, therapists)",
        hint: "This matters for integration.",
        type: "textarea",
        required: true,
      },
      {
        id: "feelUnsupported",
        label: "Is there an area where you feel unsupported?",
        type: "choice",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "feelUnsupportedDetails",
        label: "If yes, tell me more.",
        type: "textarea",
        showIf: is("feelUnsupported", "Yes"),
      },
      {
        id: "beforeAfterSupport",
        label: "Who will support you before and after this experience?",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "health",
    title: "Part 3: Health and Medications",
    fields: [
      {
        id: "medications",
        label: "Are you currently taking any of the following? Check all that apply.",
        type: "checkboxes",
        required: true,
        noneOption: NONE,
        options: [
          "SSRIs: (Prozac, Zoloft, Lexapro, Celexa, Paxil)",
          "SNRIs: (Effexor, Cymbalta, Pristiq)",
          "Other antidepressants: (Wellbutrin, Trazodone, Remeron)",
          "Tricyclic antidepressants: (Elavil (amitriptyline), Pamelor (nortriptyline))",
          "MAOIs: (Nardil, Parnate, Marplan, Emsam patch)",
          "Lithium or other mood stabilizers: (Lithium, Lamictal, Depakote, Tegretol)",
          "Antipsychotics: (Seroquel, Abilify, Risperdal, Zyprexa, Latuda)",
          "Benzodiazepines or sleep medication: (Xanax, Klonopin, Ativan, Valium, Ambien)",
          "ADHD medication or stimulants: (Adderall, Vyvanse, Ritalin, Concerta)",
          "Opioids or strong pain medication: (Tramadol, oxycodone, hydrocodone, methadone, Suboxone)",
          "Migraine medication (triptans): (Imitrex, Maxalt, Zomig)",
          "Blood pressure or heart medication: (Lisinopril, Metoprolol, Amlodipine, Losartan, Propranolol)",
          "Serotonin supplements or over the counter: (St. John's Wort, 5 HTP, SAMe, cough medicine with DXM such as Delsym, Robitussin DM)",
          "Other",
          NONE,
        ],
      },
      {
        id: "medicationList",
        label: "Please list ALL medications and supplements you take, with dosages. Include over the counter.",
        hint: "If you take none, write \"None\".",
        type: "textarea",
        required: true,
      },
      {
        id: "stoppedAntidepressant",
        label:
          "Have you stopped any antidepressant or mood stabilizer in the last 3 months? If yes, which one and when was your last dose?",
        type: "textarea",
        required: true,
      },
      {
        id: "recentMaoi",
        label: "Have you taken ayahuasca, Syrian rue, or any MAOI in the last 30 days?",
        type: "choice",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "recentMaoiDetails",
        label: "If yes, what and when?",
        type: "textarea",
        showIf: is("recentMaoi", "Yes"),
        required: is("recentMaoi", "Yes"),
      },
      { id: "allergies", label: "Are you allergic to any medications?", type: "textarea", required: true },
      {
        id: "recentSurgery",
        label: "Have you had surgery in the last 6 months? If yes, please explain.",
        type: "textarea",
        required: true,
      },
      {
        id: "lifeThreateningIllness",
        label: "Have you ever been diagnosed with a life threatening illness? Please share details.",
        type: "textarea",
        required: true,
      },
      {
        id: "mentalHealth",
        label: "Mental Health: Have you ever been diagnosed with or experienced any of the following?",
        type: "checkboxes",
        required: true,
        noneOption: NONE,
        options: [
          "Depression",
          "Anxiety",
          "PTSD",
          "Bipolar Disorder",
          "Schizophrenia",
          "Psychosis",
          "Personality Disorder",
          "Addiction",
          "Compulsive Behavior",
          "Suicidal Thoughts",
          NONE,
        ],
      },
      {
        id: "mentalHealthDetails",
        label:
          "If you checked any above, please share more. When were you diagnosed? Are you currently working with a therapist or psychiatrist?",
        type: "textarea",
        showIf: pickedAny("mentalHealth"),
        required: pickedAny("mentalHealth"),
      },
      {
        id: "familyHistory",
        label:
          "Has anyone in your immediate family (parents, siblings, children) been diagnosed with schizophrenia, bipolar disorder, or psychosis?",
        type: "choice",
        options: ["Yes", "No", "Not sure"],
        required: true,
      },
      {
        id: "familyHistoryDetails",
        label: "If yes or not sure, please share what you know.",
        type: "textarea",
        showIf: is("familyHistory", "Yes", "Not sure"),
      },
      {
        id: "heartBrainBreathing",
        label: "Heart, Brain, and Breathing: Have you ever been diagnosed with or experienced any of the following?",
        type: "checkboxes",
        required: true,
        noneOption: NONE,
        options: [
          "Heart Disease",
          "Heart Attack",
          "Heart Murmur",
          "Arrhythmia",
          "High Blood Pressure",
          "Low Blood Pressure",
          "Stroke",
          "Aneurysm",
          "Seizures or Epilepsy",
          "Fainting or Unexplained Loss of Consciousness",
          "Other Cerebrovascular Disorder",
          "Asthma, COPD, or other breathing or lung condition",
          "Other",
          NONE,
        ],
      },
      {
        id: "heartBrainBreathingDetails",
        label: "If you checked any above, please share details.",
        type: "textarea",
        showIf: pickedAny("heartBrainBreathing"),
      },
      {
        id: "pregnancy",
        label:
          "For women: Are you pregnant, trying to become pregnant, or breastfeeding? When was your last menstrual cycle?",
        type: "textarea",
      },
    ],
  },
  {
    id: "trauma",
    title: "Part 4: Trauma History",
    fields: [
      {
        id: "trauma",
        label: "Have you experienced any of the following?",
        type: "checkboxes",
        required: true,
        noneOption: NONE,
        options: [
          "Childhood trauma or adverse childhood experiences",
          "Emotional Abuse",
          "Physical Abuse",
          "Sexual Abuse or Assault",
          "War, Displacement, or Refugee experiences",
          "Domestic Violence",
          "Medical Trauma (surgeries, chronic illness, invasive procedures)",
          "Loss of Parent or Partner",
          "Accidents or Serious Injuries",
          "Natural Disasters or Environmental Trauma",
          "Religious or Spiritual Trauma",
          "Workplace Trauma or Harassment",
          NONE,
        ],
      },
      {
        id: "traumaDetails",
        label: "If you checked any above, please share more. The more detail, the better.",
        hint: "Some levels of trauma must be assessed before working with Bufo Alvarius.",
        type: "textarea",
        showIf: pickedAny("trauma"),
        required: pickedAny("trauma"),
      },
    ],
  },
  {
    id: "substances",
    title: "Part 5: Substance Use and Experience",
    fields: [
      {
        id: "currentUse",
        label: "Do you currently use any of the following?",
        type: "checkboxes",
        required: true,
        noneOption: NONE,
        options: ["Alcohol", "Cannabis", "Caffeine", "Cocaine", "Amphetamines", "MDMA", "2CB", "Ayahuasca", NONE],
      },
      {
        id: "currentUseDetails",
        label: "If yes, how often and how much?",
        type: "textarea",
        showIf: pickedAny("currentUse"),
        required: pickedAny("currentUse"),
      },
      {
        id: "pastWork",
        label: "Have you worked with any of the following?",
        type: "checkboxes",
        required: true,
        noneOption: NONE,
        options: [
          "N,N DMT",
          "5 MeO DMT (synthetic)",
          "Bufo Alvarius (natural)",
          "Kambo",
          "Magic Mushrooms",
          "Peyote",
          "Iboga",
          NONE,
        ],
      },
      {
        id: "pastWorkDetails",
        label: "If yes, how many times, when, and at what dosages?",
        type: "textarea",
        showIf: pickedAny("pastWork"),
        required: pickedAny("pastWork"),
      },
    ],
  },
  {
    id: "intention",
    title: "Part 6: Your Intention",
    fields: [
      { id: "anythingElse", label: "Is there anything else I should know?", type: "textarea", required: true },
      {
        id: "intention",
        label: "What is your intention for working with this medicine at this time?",
        type: "textarea",
        required: true,
      },
    ],
  },
];

export const WAIVER_TITLE = "Part 7: Informed Consent and Release of Liability";
export const WAIVER_INTRO =
  "Please read this agreement carefully. By signing, you confirm you understand it and agree to it.";

export interface WaiverClause {
  title: string;
  body: string;
  bullets?: string[];
  after?: string;
}

export const WAIVER: WaiverClause[] = [
  {
    title: "Voluntary Participation",
    body: "I am choosing to take part in a ceremony with Divine Emergence, LLC, which may include Bufo Alvarius, Kambo, breathwork, and related practices. I am doing this of my own free will. I am 18 years of age or older.",
  },
  {
    title: "Not Medical Treatment",
    body: "This is a spiritual and ceremonial practice. It is not medical, psychiatric, or psychological treatment, and it does not replace care from a licensed doctor or therapist. No promise has been made to me about any specific result.",
  },
  {
    title: "Legal Status",
    body: "I understand that some substances involved in this ceremony may be regulated or controlled under federal or state law. I am choosing to participate with that understanding, and I accept full responsibility for my decision.",
  },
  {
    title: "Effects and Risks of Bufo Alvarius",
    body: "Bufo Alvarius is extremely powerful and acts quickly. Effects may include:",
    bullets: [
      "Brief loss of awareness or consciousness",
      "Being temporarily unable to speak, move, or respond on purpose",
      "Involuntary movements, shaking, crying, or loud sounds",
      "Nausea or vomiting",
      "Changes in heart rate, blood pressure, and breathing",
      "Intense fear, confusion, or overwhelming emotions",
      "Emotional or physical reactivations in the days or weeks after",
    ],
    after:
      "In rare cases, serious reactions can occur, including seizures, heart complications, or lasting psychological distress. These risks are higher with certain medications, health conditions, or a personal or family history of psychosis or bipolar disorder.",
  },
  {
    title: "Effects and Risks of Kambo",
    body: "Kambo may cause strong nausea and vomiting, swelling of the face, lips, or body, a rapid heartbeat, flushing, dizziness, fainting, and changes in blood pressure. Kambo is applied through small burn points on the skin, which may leave permanent marks. Kambo requires drinking water beforehand. Drinking too much water can be dangerous, and I will follow the facilitator's water instructions exactly.",
  },
  {
    title: "Consent to Physical Support",
    body: "I give permission for the facilitator and assistants to physically support me during the ceremony. This may include holding my head or hands, placing a hand on my body, helping me sit or lie down, or moving me into a safe position.",
  },
  {
    title: "Honest Disclosure",
    body: "Everything I shared on this form is true and complete. I have not left out any medication, supplement, substance, health condition, or personal or family history. I will tell the facilitator right away if anything changes before my ceremony. I understand that leaving out information can put me in serious danger.",
  },
  {
    title: "Medications",
    body: "I will not stop, start, or change any prescription medication without guidance from my doctor. I will tell the facilitator about any change before my ceremony.",
  },
  {
    title: "Medical Clearance",
    body: "The facilitator may ask for a note from my doctor before my ceremony if anything on this form raises a safety concern. The facilitator may also decline, postpone, or stop my session at any time if they believe it is not safe for me.",
  },
  {
    title: "Preparation and Aftercare",
    body: "I will follow all preparation instructions, including fasting and avoiding listed foods, substances, and medications. I will follow the facilitator's guidance during the ceremony. I will not drive or operate machinery for the rest of the day after my ceremony.",
  },
  {
    title: "Integration",
    body: "Strong emotions, memories, or insights may come up during and after the ceremony. Integration is my own responsibility, with support offered by the facilitator. If I feel unsafe or in crisis afterward, I will reach out to the facilitator, a medical professional, or emergency services.",
  },
  {
    title: "Emergency Care",
    body: "If needed, I give permission for the facilitator to contact my emergency contacts and to seek medical care for me, including calling 911. I am responsible for any costs of that care.",
  },
  {
    title: "Photos and Recording",
    body: "Ceremonies are not photographed or recorded without my written permission.",
  },
  {
    title: "Confidentiality",
    body: "The information I share is kept private and used only to keep me safe. It will not be shared, except with emergency personnel if my safety requires it.",
  },
  {
    title: "Assumption of Risk and Release",
    body: "I voluntarily assume all risks, known and unknown, connected to my participation. I release and agree not to sue Divine Emergence, LLC, Laura Kazimer, and any assisting facilitators for any claims, injuries, losses, or damages that may arise from my participation, to the fullest extent allowed by law.",
  },
  {
    title: "Governing Law",
    body: "This agreement is governed by the laws of the State of Florida. If any part of it is found invalid, the rest still applies.",
  },
  {
    title: "Acknowledgment",
    body: "I have read this agreement in full. I have had the chance to ask questions, and they have been answered. I am signing freely.",
  },
];

export const WAIVER_CONFIRMATIONS: { id: string; label: string }[] = [
  { id: "agreeUnderstand", label: "I have read and fully understand this agreement." },
  { id: "agreeHonest", label: "I confirm all information on this form is honest and complete." },
  { id: "agreePhysicalSupport", label: "I give consent to physical support during the ceremony." },
  { id: "agreePrepGuide", label: "I have read the preparation guide." },
];

export const isRequired = (f: BaseField, a: Answers) =>
  typeof f.required === "function" ? f.required(a) : !!f.required;

export const isShown = (f: BaseField, a: Answers) => (f.showIf ? f.showIf(a) : true);

/** Age in whole years on `today` for an ISO yyyy-mm-dd date of birth. */
export function ageOn(dob: string, today = new Date()): number {
  const [y, m, d] = dob.split("-").map(Number);
  if (!y || !m || !d) return NaN;
  let age = today.getFullYear() - y;
  const beforeBirthday = today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d);
  if (beforeBirthday) age -= 1;
  return age;
}

/** Returns a map of field id → error message for every unanswered required field. */
export function validate(a: Answers): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const section of SECTIONS) {
    for (const f of section.fields) {
      if (!isShown(f, a) || !isRequired(f, a)) continue;
      const v = a[f.id];
      if (f.type === "contacts") {
        const list = (v as Contact[] | undefined) ?? [];
        const complete = Array.from({ length: f.count }, (_, i) => list[i]).every(
          (c) => c && c.name.trim() && c.relationship.trim() && c.phone.trim()
        );
        if (!complete) errors[f.id] = `Please fill in name, relationship, and phone for both contacts.`;
      } else if (f.type === "checkboxes") {
        if (picked(a, f.id).length === 0) errors[f.id] = "Please check at least one option.";
      } else if (f.type === "confirm") {
        if (v !== true) errors[f.id] = "Please confirm to continue.";
      } else if (typeof v !== "string" || !v.trim()) {
        errors[f.id] = "This answer is required.";
      }
    }
  }

  const email = a.email as string | undefined;
  if (email && !errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  const dob = a.dob as string | undefined;
  if (dob && !errors.dob) {
    const age = ageOn(dob);
    if (Number.isNaN(age) || age > 120) errors.dob = "Please enter a valid date of birth.";
    else if (age < 18) errors.dob = "You must be 18 or older to take part.";
  }

  for (const c of WAIVER_CONFIRMATIONS) {
    if (a[c.id] !== true) errors[c.id] = "Please check this box to continue.";
  }
  if (!(a.legalName as string)?.trim()) errors.legalName = "Please type your full legal name.";
  if (!a.signature) errors.signature = "Please sign in the box above.";
  if (!(a.signedDate as string)?.trim()) errors.signedDate = "Please enter today's date.";
  return errors;
}

/** Turns an answer into readable text for the PDF and the webhook. */
export function formatAnswer(f: Field, a: Answers): string {
  const v = a[f.id];
  if (f.type === "contacts") {
    return ((v as Contact[] | undefined) ?? [])
      .map((c, i) => `Contact ${i + 1}: ${c.name} (${c.relationship}), ${c.phone}`)
      .join("\n");
  }
  if (f.type === "checkboxes") return picked(a, f.id).join("; ");
  if (f.type === "confirm") return v === true ? "Yes" : "No";
  return typeof v === "string" ? v.trim() : "";
}
