// Central content for every offering and the women's retreat. The Offerings
// grid, the detail pages at /offerings/:slug, and the /retreat page all read
// from this list, so a non-developer can edit copy in one place. Content is
// mirrored from the live divineemergence.org pages. Keep the tone warm,
// grounded, and reverent, and avoid em dashes.

import {
  Wind,
  Flame,
  Leaf,
  Compass,
  GraduationCap,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { BOOKING_URL, TRAINING_APPLY_URL } from "@/lib/site";

import waterfallImg from "@/assets/waterfall.jpg";
import swimImg from "@/assets/synergy-swim.jpg";

export type Feature = { title: string; text: string };
export type Step = { label: string; title: string; text?: string; items?: string[] };
export type Tier = { name: string; price: string; note?: string };
export type Testimonial = { name: string; quote: string };
export type FaqItem = { q: string; a: string };
export type ProseSection = { heading: string; paragraphs: string[]; items?: string[] };

export type Offering = {
  slug: string;
  title: string;
  Icon: LucideIcon;
  eyebrow: string;
  cardDesc: string;
  headline: string;
  intro: string;
  image: string;
  imageAlt: string;
  gallery?: string[];
  ctaLabel: string;
  ctaHref: string;
  body?: string[];
  approach?: { title: string; features: Feature[] };
  benefits?: { title: string; items: string[] };
  sections?: ProseSection[];
  curriculum?: { title: string; steps: Step[] };
  values?: { title: string; features: Feature[] };
  includes?: { title: string; items: string[] };
  pricing?: { title: string; tiers: Tier[]; note?: string };
  testimonials?: Testimonial[];
  faq?: FaqItem[];
  hideFromGrid?: boolean;
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
      "When stress and trauma overwhelm the body, the nervous system can become stuck in survival mode, feeding anxiety and burnout. Breathwork engages the autonomic nervous system to guide the body back to relaxation.",
    body: [
      "For those managing anxiety or moving off antidepressants, it offers natural support, and it is one of the most effective tools we have for creating neuroplasticity in the brain. Sessions are available online or in person.",
      "Breathwork is for everyone, because your breath is the one tool you always have access to and it directly affects every system in your body. You do not need to be spiritual, flexible, or even into wellness. You just need lungs and a willingness to show up.",
    ],
    approach: {
      title: "What sets this apart",
      features: [
        {
          title: "Relaxing",
          text: "Creating calm and safety to soothe anxiety and ease the nervous system into rest.",
        },
        {
          title: "Activating",
          text: "Building resilience and enhancing immunity through dynamic breath patterns.",
        },
        {
          title: "Trauma Releasing",
          text: "Divine Emergence Breathwork accesses stored trauma layers, processes emotional pain, and supports recovery across mind, body, and spirit.",
        },
      ],
    },
    benefits: {
      title: "What breathwork can do",
      items: [
        "Calm your stress response and regulate your emotions",
        "Improve focus and energy",
        "Release stored tension and trauma",
        "Strengthen your immune system",
        "Increase body awareness and resilience",
      ],
    },
    image: "/offerings/breathwork-1.webp",
    imageAlt: "A guided breathwork session",
    gallery: ["/offerings/breathwork-2.webp", "/offerings/breathwork-3.webp"],
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
      "The medicine enters the bloodstream immediately. Reality shifts within seconds. The peak lasts only minutes, yet what happens in that window can be profoundly life-changing.",
    sections: [
      {
        heading: "What is Bufo Alvarius?",
        paragraphs: [
          "Bufo Alvarius is the Sonoran Desert toad, and its skin secretions contain a naturally occurring psychoactive compound called 5-MeO-DMT. When vaporized and inhaled, it enters the bloodstream immediately.",
          "People describe it as a complete dissolution of the mental noise, the stories, and the pain they have been carrying. A sense of unity. Pure awareness. Many walk away with emotional releases and shifts in self-perception that years of traditional therapy never touched.",
        ],
      },
      {
        heading: "Why I use it for mental health and addiction",
        paragraphs: [
          "The research backs what I have seen firsthand. People who work with 5-MeO-DMT report strong mystical experiences, deep psychological insight, and meaningful emotional release with relatively few challenging aftereffects.",
          "For those stuck in cycles of addiction, anxiety, trauma, or depression, this experience has the ability to interrupt patterns at a level that talk therapy and medication simply do not reach. What makes it work is not just the experience itself. It is the intentional preparation, a trauma-informed facilitator holding the space, and real integration work afterward that turn a powerful moment into lasting change. This is not recreational. This is healing.",
        ],
      },
      {
        heading: "My experience and approach",
        paragraphs: [
          "I began working with Bufo in 2022, and my background in breathwork, somatic practices, and psychology prepared me to safely and effectively guide others through psychedelic-assisted experiences.",
          "In 2024, I traveled to Tulum, Mexico to train with Madhu Anand and the Family of Light, where I received formal initiation and advanced training in working safely and ethically with Kambo, Bufo, and Psilocybin. Since completing my training, I have facilitated group sessions, private journeys, and retreats, supporting participants before, during, and after their experiences.",
          "Every session begins with a thorough intake process to assess readiness, ensure safety, and align intentions with the medicine and the container, because true transformation is rooted in preparation, consent, and care.",
        ],
      },
      {
        heading: "Integration and safety",
        paragraphs: [
          "Integration is the process that happens after the experience, when the insights, emotional release, and shifts in awareness begin to find meaning in everyday life. It is not just reflection, it is about translating inner experience into real, lasting change.",
          "In my work, I focus on intentional, trauma-informed integration support: guided reflection, somatic awareness, breath-based practices, and strategies for embodying insights in everyday life. Integration is where the experience becomes real life.",
        ],
      },
    ],
    image: "/offerings/bufo-alvarius-1.webp",
    imageAlt: "Ceremony and community",
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
      "Held with care, respect, and trauma-informed facilitation, every session honors the ancient roots of this medicine while keeping your safety and intention at the center. My training in Tulum with Madhu Anand and the Family of Light included formal initiation in working with Kambo safely and ethically.",
    ],
    benefits: {
      title: "The traditional gifts of Kambo",
      items: [
        "Purify the body and release physical toxins",
        "Strengthen immunity and vitality",
        "Clear stagnant, heavy energy, known as panema",
        "Sharpen mental clarity and focus",
        "Reset the body and spirit",
      ],
    },
    image: waterfallImg,
    imageAlt: "Fresh water moving over stone",
    ctaLabel: "Schedule an intake call",
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
      "If traditional talk therapy has not given you the results you are looking for, or if you are searching for a more integrative, holistic approach, private coaching may be the solution you have been seeking.",
    body: [
      "I combine breathwork, mindfulness, somatic practices, and my professional background in mental health to create a mind-body-spirit approach that is both practical and transformative. The core focus is integration, ensuring that the changes we create in our sessions are potent, lasting, and easily applied to your everyday life.",
      "Coaching runs over 6 or 12 weeks, personalized to your needs and goals. It is for anyone ready to step into a more integrated, empowered, and fully present version of themselves.",
    ],
    benefits: {
      title: "Things you will experience in this work",
      items: [
        "True nervous system regulation and emotional resilience",
        "Release of limiting beliefs and unprocessed tension",
        "Deep reconnection to your mind, body, and spirit",
        "Sustainable habits that support your long-term growth and well-being",
      ],
    },
    sections: [
      {
        heading: "Business coaching for health and wellness entrepreneurs",
        paragraphs: [
          "Launching a wellness business can feel overwhelming, especially when you want to create something authentic, impactful, and sustainable. I help new and emerging health and wellness entrepreneurs navigate the challenges of building a purpose-driven business without burning out.",
          "Drawing on two years at Awakened Breath, where I trained hundreds of breathwork students and entrepreneurs, my coaching provides the guidance, accountability, and strategy you need to succeed without sacrificing your health or peace of mind.",
        ],
        items: [
          "Clarify your vision and values so your business reflects your authentic self",
          "Develop practical, sustainable strategies to attract clients and generate consistent income",
          "Stay connected to your well-being and creativity while scaling your business",
          "Navigate the common challenges of launching and growing a wellness business",
          "Land high-ticket clients in 6 weeks or less",
        ],
      },
    ],
    image: "/offerings/coaching-1.webp",
    imageAlt: "A one on one coaching conversation",
    gallery: ["/offerings/coaching-2.webp"],
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
      "Learn how to safely guide others through trauma-informed breathwork, integration, and transformation. This is an 8-week immersive training for those called to hold this work with respect, integrity, and grace.",
    body: [
      "Laura Kazimer established Divine Emergence, LLC after years of hands-on experience. She has trained dozens of facilitators as a Master Trainer with Awakened Breath, conducted hundreds of private sessions, and led sold-out workshops and international retreats.",
      "The training emphasizes trauma-informed breathwork supported by modern science. Intentional breathing has been shown to help process stress and emotion, trauma, anxiety, depression, addictive patterns, OCD, and so much more. It is for corporate professionals seeking meaningful careers, empaths called to service, therapists, yoga instructors, coaches, and anyone drawn to teach breathwork transformation.",
    ],
    curriculum: {
      title: "The 8-week curriculum",
      steps: [
        { label: "Week 1", title: "Introduction to Breathwork", text: "History and techniques across cultures, including Pranayama, Wim Hof, and Holotropic breathing." },
        { label: "Week 2", title: "The Autonomic Nervous System", text: "Somatics and the mind-body connection." },
        { label: "Week 3", title: "Altered States of Consciousness", text: "Deep breathwork journeys and circular breathing." },
        { label: "Week 4", title: "The Art of Facilitation", text: "Creating safe spaces, active listening, and energetic processing." },
        { label: "Week 5", title: "Trauma Awareness", text: "Contraindications, integration, and client assessment." },
        { label: "Week 6", title: "Growing Your Practice", text: "Business structuring, branding, and marketing strategies." },
        { label: "Week 7", title: "Creating Your Offerings", text: "Designing workshops and 1:1 sessions using Canva, Eventbrite, AI tools, and CRM systems." },
        { label: "Week 8", title: "Integration and Certification", text: "Final assessment, workshop launch, and certification ceremony." },
      ],
    },
    values: {
      title: "Core values",
      features: [
        { title: "Authenticity", text: "Show up as your true self in every session." },
        { title: "Safety", text: "Create a container of trust and protection." },
        { title: "Integrity", text: "Honor the nature and history of this work." },
      ],
    },
    includes: {
      title: "What is included",
      items: [
        "8 weeks of immersive training",
        "Live group calls and breathwork journeys",
        "Facilitation practice with feedback",
        "Business-building strategies",
        "Weekly individual and group check-ins",
        "Certification upon completion",
        "Curated reading and resource library",
        "Ongoing Voxer and WhatsApp community support",
      ],
    },
    testimonials: [
      { name: "Juno", quote: "Laura is an exceptional coach and facilitator. She has a rare ability to transform daunting situations into achievable goals." },
      { name: "Danielle", quote: "Laura is an amazing instructor. You can feel her authentic energy and love towards you when teaching." },
      { name: "Catherine", quote: "Laura is an incredibly kind, intuitive leader who created safety enabling deep connection." },
    ],
    image: "/offerings/training-4.webp",
    imageAlt: "A breathwork facilitation workshop",
    gallery: [
      "/offerings/training-2.webp",
      "/offerings/training-1.webp",
      "/offerings/training-5.webp",
      "/offerings/training-3.webp",
    ],
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
      "A one of a kind 6-week private journey designed to help you overcome emotional blocks and regulate your autonomic nervous system. In six weeks, you will reconnect to your breath, regulate your nervous system, and release old patterns, so you can feel whole again.",
    benefits: {
      title: "Who this is for",
      items: [
        "Those feeling stuck, overwhelmed, or disconnected",
        "Driven professionals, entrepreneurs, and high achievers feeling burnt out despite their success",
        "Anyone who has tried medication, therapy, or meditation and desires a real mind-body approach",
        "People craving true transformation through somatic practice",
        "Anyone ready to release stored trauma and emotion and master lifelong nervous system regulation",
      ],
    },
    curriculum: {
      title: "Your six weeks together",
      steps: [
        {
          label: "Week 1",
          title: "Foundational and Calming Breathwork",
          items: [
            "Baseline breath test and assessment",
            "Diaphragmatic and foundational breathing",
            "Nervous system awareness and parasympathetic activation",
            "Core relaxing breath techniques",
            "Creating a simple daily structure to support your practice",
          ],
        },
        {
          label: "Week 2",
          title: "Activation and Hormetic Stress Training",
          items: [
            "Activating breath techniques to move energy and build resiliency",
            "Hormetic stress breathing, learning to create your own natural stress response",
            "Somatic release practices to safely express and move emotion",
          ],
        },
        {
          label: "Week 3",
          title: "Full Release: Divine Emergence Breathwork Session",
          items: [
            "Conscious circular breathing",
            "Deep emotional access and full release",
            "Applying somatic tools for support throughout the session",
            "Integration practices to help you settle and stay present afterward",
          ],
        },
        {
          label: "Week 4",
          title: "Integration and Processing",
          items: [
            "Reflecting on what came up in the Week 3 session",
            "Working with trauma patterns and parts of yourself that need attention",
            "Learning how the body holds onto experience, and how to help it let go",
            "Embodied practices that build a felt sense of safety and self compassion",
          ],
        },
        {
          label: "Week 5",
          title: "Self-Love, Boundaries, and Emotional Empowerment",
          items: [
            "Defining your boundaries and values, and learning to honor them",
            "Sensing when your energy is being drained versus uplifted",
            "The Yes/No framework for fast, honest decision making",
            "Simple renewal habits like mindful walks and creative projects",
          ],
        },
        {
          label: "Week 6",
          title: "Reflection and Community",
          items: [
            "Reflecting on and celebrating your transformation across the six weeks",
            "Refining your personal practice so it continues beyond the program",
            "Community connection, finding the people who support your continued growth",
          ],
        },
      ],
    },
    includes: {
      title: "The program includes",
      items: [
        "Weekly 1:1 breathwork focused coaching sessions, 60 to 90 minutes",
        "Guided somatic practices and nervous system regulation tools",
        "Deep emotional release and trauma integration support",
        "Embodied self-love, boundary work, and empowerment practices",
        "Personalized strategies and practices for lasting transformation",
        "Access to recordings, exercises, and ongoing check-ins",
      ],
    },
    pricing: {
      title: "Investment",
      tiers: [
        { name: "Pay in full", price: "$2,000", note: "Total value $5,000" },
      ],
    },
    testimonials: [
      { name: "Robin Smyth", quote: "Laura has a beautiful gift and is enthusiastic to share it with others. She is very involved in what she practices and has an abundance of knowledge to share." },
      { name: "William Savoie", quote: "I have been working with Laura for two years and have benefitted immensely from her services. She has been a huge part of my healing journey." },
      { name: "Shannon Weston", quote: "When I began my six weeks of one-on-one coaching, I was in a very dark headspace. She was a true source of light, realness, and connection." },
    ],
    faq: [
      { q: "Do I need prior experience with breathwork or somatic practices?", a: "Nope. This container works whether you are brand new or already experienced. I will guide you gently from foundational techniques up." },
      { q: "How much time will this require each week?", a: "Each week we have one, one-hour call. The third week runs 90 minutes. In between sessions, plan for 3 to 5 hours a week to dedicate to your self help and breathwork practices." },
      { q: "Will this work if I am already on medication or in therapy?", a: "Yes. This is complementary work, not a substitute for medical or mental health treatment. Always check with your provider." },
      { q: "What makes Regulation Is Power different from other coaching programs?", a: "It integrates somatic work, release, reflection, and long-term growth, rebuilding the nervous system through responsive tools rather than reactive patterns." },
      { q: "How do I know if this is the right time for me?", a: "If you feel stuck, overwhelmed, or disconnected, or you sense there is more to your breath and emotional system than what you are currently accessing, this is for you." },
      { q: "What support can I expect after the program?", a: "Lifetime access to breathwork and somatic practices, plus exclusive future discounts and promotions for Divine Emergence events and programs." },
    ],
    image: "/offerings/regulation-is-power-12.webp",
    imageAlt: "Rising into your power",
    gallery: [
      "/offerings/regulation-is-power-5.webp",
      "/offerings/regulation-is-power-4.webp",
      "/offerings/regulation-is-power-7.webp",
      "/offerings/regulation-is-power-2.webp",
      "/offerings/regulation-is-power-3.webp",
      "/offerings/regulation-is-power-6.webp",
    ],
    ctaLabel: "Reserve your spot",
    ctaHref: BOOKING_URL,
  },
  {
    slug: "womens-retreat",
    title: "Women's Reset Retreat",
    Icon: Users,
    eyebrow: "Immersive Retreat",
    cardDesc:
      "A few days away from the noise: breath, ceremony, and community in an intimate lakeside setting.",
    headline: "Women's Reset Retreat",
    intro:
      "Ladies, this is for you. A five-day mind, body, and soul reset at a private Michigan lake house, co-hosted by Laura Kazimer of Divine Emergence and Monique Kasper of Rise Within. Over 60 beautiful women have already said yes.",
    body: [
      "Over five days, you will experience healing modalities, somatic practices, gentle plant medicine, and integration, woven together with fireside discussions, laughter, play, rest, and connection with like-minded women. A phone detox is encouraged, so you can be fully present.",
    ],
    approach: {
      title: "What to expect",
      features: [
        { title: "Daily Breathwork", text: "Relaxation for nervous system regulation, functional breathing for stress and hormone balance, and trauma release sessions." },
        { title: "Workshops and Adventure", text: "Somatic workshops, sound healing, journaling, mindfulness meditation, and nature hikes." },
        { title: "Gentle Plant Medicine", text: "Cacao ceremony, hapé, sananga, and rose, all non-psychoactive. Optional magic mushroom microdosing, with full participant autonomy." },
        { title: "Private Lake House and Chef", text: "A private, comfortable setting with fresh, nourishing meals prepared on-site." },
        { title: "Lifelong Friends and Integration", text: "You come in as strangers and leave as sisters, with an online integration call two weeks after the retreat." },
      ],
    },
    sections: [
      {
        heading: "Why an all women's retreat?",
        paragraphs: [
          "Women have been holding it down for everyone else, and they deserve a dedicated space to heal. When women gather with intention, healing happens faster, deeper, and more honestly.",
          "You will come in as strangers and leave as sisters. Bring a female friend or family member to share the experience, or come on your own and find your people.",
        ],
      },
    ],
    pricing: {
      title: "Investment",
      tiers: [
        { name: "Twin Shared Space", price: "$2,000", note: "Per person" },
        { name: "Bestie Package", price: "$3,600", note: "Two rooms, split between two women" },
      ],
      note: "A $500 non-refundable deposit secures your spot, with the balance due before the retreat.",
    },
    faq: [
      { q: "Where is the retreat?", a: "A private lake house in Watervliet, Michigan. The full address is shared after your spot is confirmed." },
      { q: "Is it really women only?", a: "Yes. It is intentionally designed as a women-only experience to preserve the specific group dynamic and safety." },
      { q: "Do I need any experience?", a: "None. Most participants are exploring breathwork, plant medicine, or retreats for the very first time." },
      { q: "What is the booking and cancellation policy?", a: "A $500 non-refundable deposit secures your booking, with full payment due by a specified date before the retreat. Cancellations should be reported as soon as possible, and refund options vary by timing, with potential partial refunds or future credits." },
      { q: "How does travel work?", a: "Fly into Kalamazoo Airport, with pickup and dropoff included. Arrival is required by 4 PM on the first day. Flights are not included, and travel insurance is recommended." },
      { q: "Tell me about the plant medicine.", a: "Offerings include cacao ceremony, hapé, sananga, and rose, none of which are psychoactive. Optional magic mushroom microdosing is available. Everything is fully explained before you decide, and all of it is optional." },
    ],
    image: swimImg,
    imageAlt: "Stillness by the water",
    ctaLabel: "Book your retreat clarity call",
    ctaHref: BOOKING_URL,
    hideFromGrid: true,
  },
];

export const getOffering = (slug?: string) =>
  offerings.find((o) => o.slug === slug);

export const gridOfferings = offerings.filter((o) => !o.hideFromGrid);
