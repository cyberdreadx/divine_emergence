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
  CalendarHeart,
  type LucideIcon,
} from "lucide-react";
import { BOOKING_URL, TRAINING_APPLY_URL, BUFO_INTAKE_URL } from "@/lib/site";

import waterfallImg from "@/assets/waterfall.jpg";
import circleImg from "@/assets/de-circle.webp";

export type Feature = { title: string; text: string };
export type Step = { label: string; title: string; text?: string; items?: string[] };
export type Tier = { name: string; price: string; note?: string };
export type Testimonial = { name: string; quote: string };
export type FaqItem = { q: string; a: string };
export type ProseSection = { heading: string; paragraphs: string[]; items?: string[] };
export type SecondaryCta = { heading: string; text: string; label: string; href: string };

export type Offering = {
  slug: string;
  title: string;
  cardTitle?: string; // shorter label for the homepage offerings grid
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
  embedEbook?: boolean; // render the free page-turning ebook on the detail page
  secondaryCta?: SecondaryCta; // an extra call-to-action block above the main CTA
  hideFromGrid?: boolean;
};

export const offerings: Offering[] = [
  {
    slug: "breathwork",
    title: "Breathwork",
    Icon: Wind,
    eyebrow: "Nervous System Regulation",
    cardDesc:
      "The most direct tool you have for regulating your nervous system. Science-backed sessions that calm the stress response and release what the body has been holding.",
    headline: "Breathwork for a regulated nervous system",
    intro:
      "When stress and trauma overwhelm the body, the nervous system can become stuck in survival mode, feeding anxiety and burnout. Breathwork engages the autonomic nervous system to guide the body back to relaxation.",
    body: [
      "For those managing anxiety or moving off antidepressants, it offers natural support, and it is one of the most effective tools we have for creating neuroplasticity in the brain. Sessions are available online or in person.",
      "Breathwork is for everyone, because your breath is the one tool you always have access to and it directly affects every system in your body. You do not need to be spiritual, flexible, or even into wellness. You just need lungs and a willingness to show up.",
    ],
    sections: [
      {
        heading: "The three realms of breathwork",
        paragraphs: [
          "I work with three distinct realms of breathwork, each serving a different purpose. Together, they create a comprehensive approach to working with the nervous system, the body, and emotional patterns.",
          "The first realm is relaxation and nervous system regulation. Drawing from ancient yogic traditions and pranayama practices, these techniques are designed to support parasympathetic activation and help the body move out of states of chronic stress, anxiety, overwhelm, and hyperarousal. You learn how to intentionally use your breath to create a greater sense of calm, safety, balance, and regulation.",
          "The second realm is functional and activating breathwork. This work focuses on improving the way you breathe and using specific techniques to support energy, physical performance, recovery, circulation, and overall physiological function. Functional breathing can be particularly valuable when working with chronic stress, fatigue, hormone imbalance, autoimmune, inflammation, and other physical challenges.",
          "The third realm is full-release trauma breathwork. Inspired by Holotropic-style breathing, this is the deeper, more intensive work, almost similar to having a psychedelic experience. Through sustained, conscious breathing, we create an opportunity to access emotions, physical sensations, memories, and patterns that may be held within the body and nervous system. This work is approached progressively and intentionally, with preparation, proper guidance, and integration being essential.",
          "Typically, I teach all three realms to my clients. We don't begin with the most intense form of breathwork. We first build your ability to regulate and relax, then develop your capacity to activate and work with your physiology, and eventually, when appropriate, explore deeper release and altered states work.",
        ],
      },
      {
        heading: "The science of breath and the nervous system",
        paragraphs: [
          "Your breath is one of the few physiological processes that is both automatic and consciously controllable, making it a powerful tool for influencing the autonomic nervous system. Your breathing rate, rhythm, depth, and the relationship between your inhale and exhale can directly influence heart rate, blood pressure, carbon dioxide levels, and your body's level of arousal.",
          "Slower, controlled breathing can increase parasympathetic activity and support a calmer physiological state, while activating breath patterns can increase energy and alertness. With consistent practice, you're training your nervous system to become more flexible and better able to move between activation and recovery.",
        ],
      },
      {
        heading: "Breath, trauma, and the body",
        paragraphs: [
          "Trauma isn't literally stored in one specific part of the body. Instead, overwhelming experiences can create lasting changes in the nervous system, stress response, brain, and body. This can show up as chronic tension, depression, altered breathing, hypervigilance, emotional reactivity, shutdown, or difficulty regulating stress.",
          "Breathwork gives you a direct way to work with these physiological patterns. Through intentional breathing and increased awareness of bodily sensations, you can learn to recognize, regulate, and respond differently to what your nervous system is experiencing.",
          "The goal isn't to force a release or relive trauma. It's to build greater nervous-system flexibility, regulation, and capacity. Your breath becomes a tool you can use every day to understand your body, shift your physiological state, and support deeper emotional integration.",
        ],
      },
    ],
    approach: {
      title: "What sets this apart",
      features: [
        {
          title: "Relaxing",
          text: "Pranayama and yogic techniques that downshift the autonomic nervous system, quiet the stress response, and ease anxiety into rest.",
        },
        {
          title: "Activating",
          text: "Functional breathwork that builds CO2 tolerance, resilience, and clean energy, training your system to meet stress without tipping into overwhelm.",
        },
        {
          title: "Trauma releasing",
          text: "Influenced by holotropic breathing, deep conscious connected breath accesses stored trauma layers and moves emotion the thinking mind cannot reach.",
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
    cardTitle: "Bufo",
    Icon: Flame,
    eyebrow: "Sacred Medicine",
    cardDesc:
      "Natural medicine for those ready to move beyond survival, held with safety, integrity, and deep reverence. Read the free ebook and schedule an intake.",
    headline: "Bufo Alvarius",
    intro:
      "The medicine enters the bloodstream immediately. Reality shifts within seconds. The peak lasts only minutes, yet what happens in that window can be profoundly life-changing.",
    sections: [
      {
        heading: "What qualifies me to do this work?",
        paragraphs: [
          "Working with powerful medicines and altered states of consciousness requires experience, preparation, and a deep commitment to safety and integrity. My years of experience guiding people through breathwork, nervous system regulation, and altered states of consciousness have prepared me to facilitate this kind of work with intention and care.",
          "In 2024, I traveled to Tulum, Mexico, where I received formal initiation to serve this medicine from Madhu Anand and the Family of Light. Since then, I have facilitated more than 100 ceremonies, both privately and in group settings.",
          "My approach goes beyond the ceremony itself. I place a strong emphasis on thorough screening, preparation, nervous system awareness, creating a safe container, and integration afterward. Every person responds differently, and I believe this work should never be approached casually.",
          "My role is not simply to administer the medicine. It is to prepare you for the experience, remain present and attentive throughout it, and help you integrate what emerges afterward.",
        ],
      },
      {
        heading: "Why I use it in mental health and addiction work",
        paragraphs: [
          "Early research on 5-MeO-DMT suggests that the experience can produce profound changes in consciousness, mystical-type experiences, emotional processing, and shifts in psychological perspective. Some observational studies have also reported improvements in mood and wellbeing following the experience. However, research into its use for specific mental health conditions and addiction is still developing, and it should not be viewed as a guaranteed treatment or replacement for medical or psychological care.",
          "What interests me most is its potential to interrupt deeply ingrained patterns of thinking, behavior, and self-perception. Addiction, trauma, anxiety, and depression can create powerful feedback loops within the brain and nervous system. People can understand intellectually that they want to change while still feeling unable to break the patterns that keep them stuck.",
          "A profound altered state can sometimes create a temporary interruption in those familiar patterns and provide a different perspective on the self. But the experience itself is not the healing. What happens before and after matters enormously.",
          "That is why my approach places such a strong emphasis on preparation, nervous-system regulation, careful screening, skilled facilitation, and integration. The goal is to create a supported environment in which meaningful insights can emerge and then be translated into changes in everyday life.",
        ],
      },
    ],
    benefits: {
      title: "What people move through with Bufo",
      items: [
        "Interrupting cycles of addiction, anxiety, depression, and trauma",
        "A profound sense of unity, peace, and ego dissolution",
        "Emotional releases that years of talk therapy never reached",
        "Lasting shifts in self-perception and perspective",
        "A felt reconnection to something larger than the self",
      ],
    },
    faq: [
      { q: "What is Bufo?", a: "Bufo refers to a medicine derived from the secretion of the Sonoran Desert toad, which naturally contains the powerful psychedelic compound 5-MeO-DMT. When inhaled, 5-MeO-DMT produces a rapid and profound alteration in consciousness." },
      { q: "How long does it last?", a: "The acute experience is very short, typically 10 to 20 minutes when inhaled, although the emotional and psychological effects can continue long after the medicine has left the body." },
      { q: "What does it feel like?", a: "Everyone experiences it differently. People may experience profound changes in consciousness, emotional release, unity, expanded awareness, or temporary dissolution of their normal sense of identity." },
      { q: "Can Bufo help with trauma, anxiety, depression, or addiction?", a: "Research is still developing, but early findings and clinical observations suggest potential benefits for mood, wellbeing, psychological flexibility, and emotional processing. It is not a guaranteed treatment or replacement for medical or psychological care." },
      { q: "Is Bufo safe?", a: "It can carry significant physical and psychological risks and is not appropriate for everyone. This is why I require thorough screening before anyone participates." },
      { q: "What about medications?", a: "Before moving forward, you must provide me with a complete list of all medications, supplements, and herbal products you take, including dosage and frequency. Some medications can interact with 5-MeO-DMT. Never stop or change a prescribed medication without speaking with your prescribing provider." },
      { q: "Why is preparation important?", a: "I don't believe in simply giving someone a powerful psychedelic and hoping for the best. We prepare your nervous system, establish intentions, develop regulation tools, and make sure you have the support necessary to approach the experience responsibly." },
      { q: "What is integration?", a: "Integration is what happens after the experience. We work with the insights, emotions, and changes that emerge and focus on bringing them into your everyday life through breathwork, reflection, nervous-system practices, and continued support." },
      { q: "Is this recreational?", a: "No. This work is approached with intention, preparation, screening, respect, and integration. The experience may be brief, but the work surrounding it needs to be extensive and safe." },
    ],
    embedEbook: true,
    image: "/offerings/bufo-alvarius-1.webp",
    imageAlt: "Ceremony and community",
    ctaLabel: "Schedule your Bufo intake call",
    ctaHref: BUFO_INTAKE_URL,
  },
  {
    slug: "kambo",
    title: "Kambo",
    Icon: Leaf,
    eyebrow: "Sacred Cleanse",
    cardDesc:
      "A traditional Amazonian cleanse using sacred frog medicine rich in natural peptides, to purify the body, strengthen immunity, and reset. Held with care and deep respect.",
    headline: "Kambo",
    intro:
      "A traditional Amazonian cleanse using the sacred secretion of the giant monkey frog. For generations, Kambo has been used to purify the body, strengthen the spirit, and clear what no longer serves.",
    body: [
      "Applied to small points on the surface of the skin, Kambo works quickly and completely, moving through the body to release stagnant energy and physical toxins. The experience is short and intense, followed by a deep sense of lightness, clarity, and reset.",
      "Held with care, respect, and trauma-informed facilitation, every session honors the ancient roots of this medicine while keeping your safety and intention at the center. My training in Tulum with Madhu Anand and the Family of Light included formal initiation in working with Kambo safely and ethically.",
    ],
    sections: [
      {
        heading: "The natural peptides inside Kambo",
        paragraphs: [
          "Kambo is not a plant and it is not psychedelic. It is the waxy secretion of the giant monkey frog, Phyllomedusa bicolor, and it is one of the richest known natural sources of bioactive peptides. Peptides are short chains of amino acids that act as chemical messengers, telling cells and systems in the body what to do.",
          "This is why Kambo has drawn scientific interest for its effects on the immune system, inflammation, pain, mood, and circulation. Rather than a single active ingredient, it delivers a whole family of these compounds at once, which is part of what makes the experience so deeply physical.",
        ],
        items: [
          "Dermorphin and deltorphin, among the most potent natural pain-modulating peptides known",
          "Phyllomedusin and phyllokinin, which act on the gut and blood vessels to drive the deep purge and reset",
          "Phyllocaerulein and sauvagine, which influence digestion, blood pressure, and the stress response",
          "Adenoregulin and dermaseptins, studied for their effects on cellular resilience and immunity",
        ],
      },
      {
        heading: "What a Kambo session is like",
        paragraphs: [
          "Tiny superficial points are made on the surface of the skin, and small dots of Kambo are applied. It works fast. Most people feel a wave of heat, a flush, and a strong purge that clears stagnant energy and physical toxins, followed within minutes by a deep sense of lightness and clarity.",
          "The intense part is short, usually 20 to 40 minutes, and you remain fully present the entire time. Every session is held with care, respect, and trauma-informed facilitation, honoring the ancient roots of this medicine while keeping your safety and intention at the center.",
        ],
      },
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
    faq: [
      { q: "What is Kambo?", a: "Kambo is a traditional Indigenous medicine made from the skin secretion of the giant monkey frog (Phyllomedusa bicolor), native to the Amazon rainforest. The secretion contains a complex combination of bioactive peptides that interact with several systems in the body." },
      { q: "Why do people use Kambo?", a: "Traditionally, Kambo has been used for cleansing, purification, strength, and preparation. Today, people may seek it for personal transformation, emotional processing, ceremonial work, or as part of a broader wellness practice." },
      { q: "What happens during a Kambo ceremony?", a: "Small amounts of the secretion are traditionally applied to superficial points on the skin. The effects come on quickly and can include sweating, flushing, increased heart rate, nausea, vomiting, dizziness, and changes in blood pressure. The most intense portion is generally short-lived." },
      { q: "Why do people purge?", a: "Vomiting is a common physiological response to Kambo and is traditionally viewed as part of the cleansing process. Scientifically, it is a physiological response to the active peptides in the secretion. There isn't sufficient evidence to say that purging literally removes toxins from the body." },
      { q: "Is Kambo psychedelic?", a: "No. Kambo is not considered a classic psychedelic. Its effects are primarily physiological rather than producing the altered visual and perceptual effects associated with psychedelics." },
      { q: "How long does it last?", a: "The most intense effects generally occur within the first 30 to 60 minutes, although you may feel tired, relaxed, emotionally sensitive, or energized for several hours afterward." },
      { q: "Is Kambo safe for everyone?", a: "No. Kambo can produce significant cardiovascular and physiological effects and is not appropriate for everyone. Thorough health and medication screening is required before participating. You should disclose all medications, supplements, and relevant health conditions, and never stop prescribed medication without consulting your physician." },
      { q: "What is integration?", a: "Integration is the process of giving yourself time to rest, reflect, and process the experience afterward. The ceremony may be brief, but allowing your body and mind time to integrate is an important part of the work." },
    ],
    image: waterfallImg,
    imageAlt: "Fresh water moving over stone",
    ctaLabel: "Schedule an intake call",
    ctaHref: BOOKING_URL,
  },
  {
    slug: "womens-retreat",
    title: "Women's Reset Retreat",
    cardTitle: "Retreats",
    Icon: Users,
    eyebrow: "Immersive Retreat",
    cardDesc:
      "A few days away from the noise: breath, ceremony, and community in an intimate lakeside setting. Come in as strangers, leave as sisters.",
    headline: "Women's Reset Retreat",
    intro:
      "5 days, 4 nights on Lake Michigan. A true reset. Join us for five transformative days and four nights in a beautiful private lake house on Lake Michigan, intentionally designed to give you the space, support, and environment to step away from everyday life and reconnect with yourself.",
    body: [
      "Throughout the retreat, we'll explore multiple breathwork modalities, somatic practices, nervous system regulation, integration work, and intentional community experiences. You'll also be introduced to the world of plant medicine in a grounded, digestible, and approachable way, giving you the opportunity to explore these modalities without feeling overwhelmed or needing any prior experience.",
      "This retreat is about more than what happens during the individual practices. It's about learning how to trust, connect, receive support, and be witnessed by other women. You'll have the opportunity to experience what it feels like to be held in community while also learning practical tools to integrate powerful healing experiences into your everyday life.",
      "This is for the woman who is craving something more. The woman who needs a break from the noise, responsibilities, and demands of everyday life. The woman who knows she needs a reset and is ready to prioritize herself.",
      "And with the holidays approaching, there is no better time to give yourself something that lasts beyond another gift under the tree.",
      "Give yourself five days to breathe, regulate, reconnect, and remember who you are. Come for the reset. Stay for the connection. Leave with tools, memories, and a deeper relationship with yourself.",
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
        { name: "Solo Sister", price: "$1,199", note: "For one woman, all inclusive" },
        { name: "Bestie Package", price: "$1,999", note: "Bring a friend, your mom, or your sister and share the experience" },
      ],
    },
    faq: [
      { q: "Where is the retreat?", a: "A private lake house on Lake Michigan. The full address is shared after your spot is confirmed." },
      { q: "Is it really women only?", a: "Yes. It is intentionally designed as a women-only experience to preserve the specific group dynamic and safety." },
      { q: "Do I need any experience?", a: "None. Most participants are exploring breathwork, plant medicine, or retreats for the very first time." },
      { q: "Tell me about the plant medicine.", a: "Offerings include cacao ceremony, hapé, sananga, and rose, none of which are psychoactive. Optional magic mushroom microdosing is available. Everything is fully explained before you decide, and all of it is optional." },
    ],
    image: "/offerings/retreat-hero.webp",
    imageAlt: "Retreat sisters gathered together, come in as strangers and leave as sisters",
    gallery: [
      "/offerings/retreat-1.webp",
      "/offerings/retreat-2.webp",
      "/offerings/retreat-3.webp",
      "/offerings/retreat-4.webp",
      "/offerings/retreat-5.webp",
      "/offerings/retreat-6.webp",
      "/offerings/retreat-7.webp",
      "/offerings/retreat-8.webp",
      "/offerings/retreat-9.webp",
      "/offerings/retreat-10.webp",
      "/offerings/retreat-11.webp",
      "/offerings/retreat-12.webp",
      "/offerings/retreat-13.webp",
      "/offerings/retreat-14.webp",
      "/offerings/retreat-15.webp",
      "/offerings/retreat-16.webp",
      "/offerings/retreat-17.webp",
      "/offerings/retreat-18.webp",
      "/offerings/retreat-19.webp",
      "/offerings/retreat-20.webp",
      "/offerings/retreat-21.webp",
      "/offerings/retreat-22.webp",
    ],
    ctaLabel: "Book your retreat clarity call",
    ctaHref: BOOKING_URL,
  },
  {
    slug: "workshops-events",
    title: "Local Workshops & Events",
    Icon: CalendarHeart,
    eyebrow: "In Person, South Florida",
    cardDesc:
      "Breathwork circles, sound journeys, and community gatherings across South Florida. Come breathe in person and find your people.",
    headline: "Local workshops & community events",
    intro:
      "For the past five years, I've been hosting transformative group breathwork experiences throughout the South Florida community. Each month, I typically offer one to three group sessions, creating opportunities to experience the power of breathwork in a supportive, connected environment.",
    body: [
      "Alongside breathwork, I also host women's circles, sister circles, community gatherings, and medicine ceremonies, depending on what I feel called to create and share with the community. Each event is designed to bring people together through intentional practices, connection, healing, and shared experience.",
      "These gatherings are an opportunity to step outside of your everyday routine, reconnect with your body, meet like-minded people, and experience the work in community.",
    ],
    image: circleImg,
    imageAlt: "A breathwork circle gathered in person",
    ctaLabel: "See upcoming events",
    ctaHref: "/events",
  },
  {
    slug: "coaching",
    title: "Private Coaching",
    cardTitle: "Private 1:1 Coaching",
    Icon: Compass,
    eyebrow: "Nervous System Reset",
    cardDesc:
      "Breathwork-focused 1:1 coaching. Join the 6-week Regulation Is Power program, a full nervous system reset built around your breath.",
    headline: "Join my 6-week Regulation Is Power program",
    intro:
      "A full nervous system reset. Regulation Is Power is a one-of-a-kind 6-week private, breathwork-focused journey designed to help you overcome emotional blocks and regulate your autonomic nervous system. In six weeks, you will reconnect to your breath, release old patterns, and feel whole again.",
    body: [
      "If traditional talk therapy has not given you the results you are looking for, or if you are searching for a more integrative, holistic approach, this is the container you have been seeking. We combine breathwork, somatic practices, mindfulness, and my professional background in mental health into a mind-body-spirit approach that is both practical and transformative.",
      "The core focus is integration, ensuring the changes we create in our sessions are potent, lasting, and easily applied to your everyday life. This is deep, personalized, one-on-one work for anyone ready to step into a more integrated, empowered, and fully present version of themselves.",
    ],
    benefits: {
      title: "What you will experience in this work",
      items: [
        "True nervous system regulation and emotional resilience",
        "Release of stored trauma, limiting beliefs, and unprocessed tension",
        "Deep reconnection to your mind, body, and spirit",
        "Embodied self-love, boundaries, and emotional empowerment",
        "Sustainable habits and breath practices that support your long-term growth",
      ],
    },
    sections: [
      {
        heading: "Who this is for",
        paragraphs: [
          "This work meets you where you are, whether you are brand new to breathwork or already experienced.",
        ],
        items: [
          "Those feeling stuck, overwhelmed, or disconnected",
          "Driven professionals, entrepreneurs, and high achievers feeling burnt out despite their success",
          "Anyone who has tried medication, therapy, or meditation and desires a real mind-body approach",
          "People craving true transformation through somatic practice",
          "Anyone ready to release stored trauma and emotion and master lifelong nervous system regulation",
        ],
      },
    ],
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
      { name: "Shannon Weston", quote: "When I began my six weeks of one-on-one coaching, I was in a very dark headspace. She was a true source of light, realness, and connection." },
      { name: "William Savoie", quote: "I have been working with Laura for two years and have benefitted immensely from her services. She has been a huge part of my healing journey." },
      { name: "Robin Smyth", quote: "Laura has a beautiful gift and is enthusiastic to share it with others. She is very involved in what she practices and has an abundance of knowledge to share." },
    ],
    faq: [
      { q: "Do I need prior experience with breathwork or somatic practices?", a: "Nope. This container works whether you are brand new or already experienced. I will guide you gently from foundational techniques up." },
      { q: "How much time will this require each week?", a: "Each week we have one, one-hour call. The third week runs 90 minutes. In between sessions, plan for 3 to 5 hours a week to dedicate to your self help and breathwork practices." },
      { q: "Will this work if I am already on medication or in therapy?", a: "Yes. This is complementary work, not a substitute for medical or mental health treatment. Always check with your provider." },
      { q: "What support can I expect after the program?", a: "Lifetime access to breathwork and somatic practices, plus exclusive future discounts and promotions for Divine Emergence events and programs." },
    ],
    secondaryCta: {
      heading: "Called to facilitate this work?",
      text: "If you feel drawn to guide others, my Private Breathwork Facilitator Training Program teaches you to hold space and facilitate trauma-informed transformational breath.",
      label: "Explore the training program",
      href: "/offerings/training",
    },
    image: "/offerings/coaching-1.webp",
    imageAlt: "A one on one coaching conversation",
    gallery: [
      "/offerings/coaching-2.webp",
      "/offerings/regulation-is-power-5.webp",
      "/offerings/regulation-is-power-7.webp",
    ],
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
    hideFromGrid: true,
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
    hideFromGrid: true,
  },
];

export const getOffering = (slug?: string) =>
  offerings.find((o) => o.slug === slug);

export const gridOfferings = offerings.filter((o) => !o.hideFromGrid);
