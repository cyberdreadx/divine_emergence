// Central content for every offering. Both the Offerings grid and the
// individual offering detail pages read from this list, so a non-developer
// can edit copy in one place. Keep the tone warm, grounded, and reverent.

import { Wind, Flame, Leaf, Compass, GraduationCap, Sparkles, type LucideIcon } from "lucide-react";
import { BOOKING_URL, TRAINING_APPLY_URL } from "@/lib/site";

import meditationImg from "@/assets/de-meditation.webp";
import circleImg from "@/assets/de-circle.webp";
import connectionImg from "@/assets/de-connection.webp";
import waterfallImg from "@/assets/waterfall.jpg";
import floralImg from "@/assets/hero-floral-luxury.jpg";

export type Offering = {
  slug: string;
  title: string;
  Icon: LucideIcon;
  eyebrow: string;
  cardDesc: string;
  headline: string;
  intro: string;
  body: string[];
  listTitle?: string;
  list?: string[];
  image: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
};

export const offerings: Offering[] = [
  {
    slug: "breathwork",
    title: "Breathwork",
    Icon: Wind,
    eyebrow: "Nervous System Healing",
    cardDesc:
      "The simplest tool you have, and one of the most powerful. Facilitated sessions that regulate your nervous system and release what the body has been holding.",
    headline: "The tool for healing your nervous system",
    intro:
      "Stress and trauma can leave the nervous system stuck in survival mode, feeding anxiety, exhaustion, and burnout. Breathwork meets you there. By working directly with the autonomic nervous system, it guides your body back into safety, so you can feel calm, clear, and fully alive again.",
    body: [
      "Your breath is the one tool you always have access to, and it directly affects every system in your body. Facilitated sessions combine relaxing techniques, activating practices that build resilience, and trauma-releasing Divine Emergence Breathwork to move what the body has been carrying.",
      "Whether online or in person, every session is held with care, so you can soften, release, and return to yourself.",
    ],
    listTitle: "What breathwork can do",
    list: [
      "Calm your stress response and regulate your emotions",
      "Improve focus and energy",
      "Release stored tension and trauma",
      "Strengthen your immune system",
      "Increase body awareness and resilience",
    ],
    image: meditationImg,
    imageAlt: "A quiet moment of breath and stillness",
    ctaLabel: "Book a session",
    ctaHref: BOOKING_URL,
  },
  {
    slug: "bufo-alvarius",
    title: "Bufo Alvarius",
    Icon: Flame,
    eyebrow: "Sacred Medicine",
    cardDesc:
      "Psychedelic-assisted support for those ready to move beyond survival, held with safety, integrity, and deep reverence.",
    headline: "Bufo Alvarius",
    intro:
      "The medicine enters the bloodstream immediately. Reality shifts within seconds. The peak lasts only minutes, yet what it opens can change the course of a life.",
    body: [
      "In that space, the mental noise, the stories, and the pain can dissolve completely, leaving a sense of unity and pure awareness. Many experience profound emotional release and a shift in how they see themselves, interrupting cycles of addiction, anxiety, trauma, and depression at depths that talk therapy and medication often cannot reach.",
      "This is serious therapeutic work, not recreation. Lasting transformation asks for three things: intentional preparation, trauma-informed facilitation, and integration afterward. Every journey is held with safety, integrity, and deep reverence.",
    ],
    listTitle: "What people experience",
    list: [
      "Dissolution of mental noise and old stories",
      "A felt sense of unity and pure awareness",
      "Deep emotional release and insight",
      "Relief from cycles of addiction, anxiety, trauma, and depression",
    ],
    image: circleImg,
    imageAlt: "A luminous circle at the edge of dawn",
    ctaLabel: "Schedule an intake call",
    ctaHref: BOOKING_URL,
  },
  {
    slug: "kambo",
    title: "Kambo",
    Icon: Leaf,
    eyebrow: "Sacred Cleanse",
    cardDesc:
      "A traditional Amazonian cleanse using sacred frog medicine to purify the body, strengthen immunity, and clear stagnant energy, held with care and deep respect.",
    headline: "Kambo",
    intro:
      "A traditional Amazonian cleanse using the sacred secretion of the giant monkey frog. For generations, Kambo has been used to purify the body, strengthen the spirit, and clear what no longer serves.",
    body: [
      "Applied to small points on the surface of the skin, Kambo works quickly and completely, moving through the body to release stagnant energy and physical toxins. The experience is short and intense, followed by a deep sense of lightness, clarity, and reset.",
      "Held with care, respect, and trauma-informed facilitation, every session honors the ancient roots of this medicine while keeping your safety and intention at the center.",
    ],
    listTitle: "The traditional gifts of Kambo",
    list: [
      "Purify the body and release physical toxins",
      "Strengthen immunity and vitality",
      "Clear stagnant, heavy energy, known as panema",
      "Sharpen mental clarity and focus",
      "Reset the body and spirit",
    ],
    image: waterfallImg,
    imageAlt: "Fresh water moving over stone",
    ctaLabel: "Book a session",
    ctaHref: BOOKING_URL,
  },
  {
    slug: "coaching",
    title: "Private Coaching",
    Icon: Compass,
    eyebrow: "One on One Guidance",
    cardDesc:
      "One-on-one guidance for navigating trauma, addiction, and anxiety. A holistic path toward clarity, personal power, and true freedom.",
    headline: "Private transformational coaching",
    intro:
      "An integrative alternative to traditional therapy, blending breathwork, mindfulness, somatic practice, and a professional background in mental health into one comprehensive path.",
    body: [
      "Over 6 or 12 weeks, depending on your needs and goals, we focus on integration, ensuring the changes we create together are potent, lasting, and easy to bring into everyday life.",
      "This work is for anyone ready to step into a more integrated, empowered, and fully present version of themselves.",
    ],
    listTitle: "What you can expect",
    list: [
      "True nervous system regulation and emotional resilience",
      "Release of limiting beliefs and unprocessed tension",
      "Deep reconnection to mind, body, and spirit",
      "Sustainable habits that support long-term growth and well-being",
    ],
    image: connectionImg,
    imageAlt: "Two hands reaching toward connection",
    ctaLabel: "Book your free clarity call",
    ctaHref: BOOKING_URL,
  },
  {
    slug: "training",
    title: "Breathwork Training Program",
    Icon: GraduationCap,
    eyebrow: "Certification",
    cardDesc:
      "For those called to carry this work forward. Learn to hold space and facilitate transformational breath.",
    headline: "Become a certified breathwork practitioner",
    intro:
      "An 8-week immersive training that teaches you to safely guide others through trauma-informed breathwork, integration, and transformation.",
    body: [
      "Developed by Laura Kazimer through years of hands-on experience training facilitators and guiding hundreds of private sessions, this program is for those called to hold this work with respect, integrity, and grace: corporate professionals seeking meaning, empaths in service roles, therapists and wellness practitioners expanding their offerings, and anyone drawn to share the transformative power of breath.",
    ],
    listTitle: "What is included",
    list: [
      "Eight weeks of curriculum: history, nervous system science, altered states, facilitation, trauma awareness, business building, and workshop design",
      "Live group calls and breathwork journeys",
      "Facilitation practice with personal feedback",
      "Certification upon completion",
      "Ongoing community support",
    ],
    image: floralImg,
    imageAlt: "Soft floral light",
    ctaLabel: "Apply now",
    ctaHref: TRAINING_APPLY_URL,
  },
  {
    slug: "regulation-is-power",
    title: "Regulation Is Power",
    Icon: Sparkles,
    eyebrow: "Signature Program",
    cardDesc:
      "Practices and teachings to bring you back to yourself in a way that feels aligned, free, and grounded.",
    headline: "Regulation is power",
    intro:
      "A 6-week private program to help you overcome emotional blocks and regulate your autonomic nervous system. In six weeks, you will reconnect to your breath, regulate your nervous system, and release old patterns, so you can feel whole again.",
    body: [
      "Built for driven professionals, entrepreneurs, and high achievers moving through burnout, and for anyone who has tried medication, therapy, or meditation and is ready for a somatic alternative. You will learn to respond from power, not reactivity.",
    ],
    listTitle: "Your six weeks together",
    list: [
      "Week 1: Foundational breathing and parasympathetic activation",
      "Week 2: Activation training and stress resilience",
      "Week 3: A 90-minute guided deep emotional release session",
      "Week 4: Integration and trauma pattern processing",
      "Week 5: Boundaries, self-love, and emotional empowerment",
      "Week 6: Reflection and community",
    ],
    image: meditationImg,
    imageAlt: "Grounded and at ease",
    ctaLabel: "Book your free clarity call",
    ctaHref: BOOKING_URL,
  },
];

export const getOffering = (slug?: string) =>
  offerings.find((o) => o.slug === slug);
