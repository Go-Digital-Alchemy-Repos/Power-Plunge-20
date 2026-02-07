export interface SectionKitDef {
  name: string;
  description: string;
  category: string;
  blocks: { type: string; data: Record<string, any> }[];
}

export const SECTION_KITS: SectionKitDef[] = [
  {
    name: "Cold Plunge Benefits Kit",
    description: "Benefits stack + science explainer + recovery use cases — covers why cold plunging works and who it's for",
    category: "kit",
    blocks: [
      {
        type: "benefitStack",
        data: {
          title: "Why Cold Plunging Works",
          items: [
            { headline: "Reduced Inflammation", description: "Cold exposure constricts blood vessels, helping reduce swelling and muscle soreness after intense activity.", icon: "Snowflake", emphasis: true },
            { headline: "Improved Circulation", description: "Alternating cold exposure stimulates blood flow, delivering oxygen and nutrients to recovering tissues.", icon: "Activity" },
            { headline: "Mental Clarity", description: "Cold immersion activates the sympathetic nervous system, boosting focus and alertness throughout the day.", icon: "Brain" },
            { headline: "Better Sleep", description: "Regular cold plunging helps regulate your body's core temperature cycle, promoting deeper, more restorative sleep.", icon: "Moon" },
          ],
          layout: "stack",
        },
      },
      {
        type: "scienceExplainer",
        data: {
          title: "The Science Behind Cold Exposure",
          sections: [
            { heading: "Hormetic Stress Response", body: "Brief cold exposure triggers a hormetic stress response — a beneficial adaptation where the body becomes more resilient. This process activates cold-shock proteins and increases norepinephrine levels, which can support mood and attention.", citationLabel: "Shevchuk, 2008", citationUrl: "" },
            { heading: "Inflammation & Recovery", body: "Cold water immersion has been widely studied for its effects on delayed-onset muscle soreness (DOMS). Research suggests that cold exposure may help modulate the inflammatory response following exercise.", citationLabel: "Bleakley et al., 2012", citationUrl: "" },
            { heading: "Metabolic Activation", body: "Cold exposure activates brown adipose tissue (BAT), which generates heat by burning calories. Regular cold plunging may support metabolic health over time.", citationLabel: "van Marken Lichtenbelt et al., 2009", citationUrl: "" },
          ],
          disclaimerText: "This content is for informational purposes only and is not intended as medical advice. Consult a qualified healthcare professional before beginning any cold exposure practice.",
        },
      },
      {
        type: "recoveryUseCases",
        data: {
          title: "Cold Plunging for Every Lifestyle",
          cases: [
            { audience: "athletes", headline: "Train Harder, Recover Faster", bullets: ["Reduce post-workout soreness", "Accelerate muscle recovery between sessions", "Support joint health under heavy training loads"] },
            { audience: "busy professionals", headline: "Sharpen Your Edge", bullets: ["Boost morning alertness without extra caffeine", "Manage daily stress with a reset ritual", "Improve focus and mental resilience"] },
            { audience: "active aging", headline: "Move Better, Feel Younger", bullets: ["Support circulation and joint mobility", "Promote deeper, more restorative sleep", "Build a daily wellness habit with measurable impact"] },
            { audience: "first responders", headline: "Built for Those Who Serve", bullets: ["Manage physical strain from demanding shifts", "Support mental health through cold-water therapy", "Recover faster between back-to-back duties"] },
          ],
        },
      },
    ],
  },
  {
    name: "Safety + Protocol Kit",
    description: "Safety checklist + protocol builder — ensures responsible use with clear guidelines by experience level",
    category: "kit",
    blocks: [
      {
        type: "safetyChecklist",
        data: {
          title: "Safety Guidelines",
          items: [
            { text: "Consult your physician before starting cold water immersion", required: true },
            { text: "Never plunge alone — always have someone nearby", required: true },
            { text: "Start with warmer temperatures (58–60°F) and shorter sessions", required: true },
            { text: "Exit immediately if you feel dizzy, numb, or short of breath", required: true },
            { text: "Avoid cold plunging after consuming alcohol", required: true },
            { text: "Wait at least 30 minutes after a heavy meal", required: false },
            { text: "Keep a warm towel and dry clothes within arm's reach", required: false },
            { text: "Track your sessions to monitor progress and tolerance", required: false },
          ],
          disclaimerText: "Cold water immersion carries inherent risks. Individuals with cardiovascular conditions, Raynaud's disease, or pregnancy should avoid cold plunging. Always consult a qualified healthcare provider.",
        },
      },
      {
        type: "protocolBuilder",
        data: {
          title: "Cold Plunge Protocols",
          protocols: [
            { level: "beginner", tempRange: "58–60°F (14–16°C)", duration: "1–2 minutes", frequency: "2–3× per week", notes: "Focus on controlled breathing. Exit if you feel dizzy or numb." },
            { level: "intermediate", tempRange: "50–57°F (10–14°C)", duration: "2–5 minutes", frequency: "3–5× per week", notes: "Pair with breathwork. Gradually extend session length over weeks." },
            { level: "advanced", tempRange: "37–49°F (3–9°C)", duration: "5–10 minutes", frequency: "Daily or as tolerated", notes: "Monitor body response closely. Never plunge alone at extreme temperatures." },
          ],
          disclaimerText: "Consult a healthcare professional before starting any cold exposure protocol. Individual tolerance varies — start conservatively and progress gradually.",
        },
      },
    ],
  },
  {
    name: "Delivery + Setup Kit",
    description: "Delivery steps + what's included + before/after expectations — covers the full post-purchase experience",
    category: "kit",
    blocks: [
      {
        type: "deliveryAndSetup",
        data: {
          title: "Delivery & Setup",
          steps: [
            { title: "Order Confirmation", description: "Receive your order confirmation and estimated delivery window within 24 hours." },
            { title: "White-Glove Delivery", description: "Our team delivers your unit to the room of your choice — no heavy lifting on your end." },
            { title: "Professional Setup", description: "We handle full assembly, water fill, and initial system calibration on-site." },
            { title: "Walkthrough & Training", description: "A technician walks you through operation, maintenance, and your first plunge session." },
          ],
          includesBullets: [
            "Cold plunge tub and chiller unit",
            "Insulated cover and filtration system",
            "Digital temperature controller",
            "Starter water treatment kit",
            "Quick-start guide and owner's manual",
          ],
          shippingEstimateText: "Free shipping on all orders. Typical delivery within 7–14 business days to most US locations.",
        },
      },
      {
        type: "beforeAfterExpectations",
        data: {
          title: "What to Expect",
          expectations: [
            { label: "First Session", description: "Your first plunge may feel intense — that's normal. Many users report an invigorating rush followed by a sense of calm and alertness." },
            { label: "First Week", description: "With consistent use, most people begin to notice improved tolerance to the cold and may experience better sleep quality and reduced muscle soreness." },
            { label: "First Month", description: "Regular cold plungers often report sustained improvements in energy, mood, and recovery times. Individual results vary based on frequency and protocol." },
            { label: "Ongoing Practice", description: "Cold plunging can become a cornerstone of your wellness routine. Many long-term users describe it as one of their most valued daily habits." },
          ],
        },
      },
    ],
  },
  {
    name: "Warranty + Support Kit",
    description: "Guarantee & warranty details + objection busters — builds trust and handles last-minute concerns",
    category: "kit",
    blocks: [
      {
        type: "guaranteeAndWarranty",
        data: {
          title: "Our Promise to You",
          guaranteeBullets: [
            "30-day money-back guarantee — no questions asked",
            "Free return shipping on all guarantee claims",
            "Full refund or exchange at your choice",
            "Hassle-free process with dedicated support",
          ],
          warrantySummary: "Every Power Plunge unit comes with a comprehensive 2-year manufacturer warranty covering the chiller system, tub construction, and electronic controls. Extended warranty options are available at checkout for up to 5 years of total coverage.",
          supportCtaText: "Contact Our Support Team",
          supportCtaHref: "/contact",
        },
      },
      {
        type: "objectionBusters",
        data: {
          title: "Common Questions & Concerns",
          items: [
            { objection: "Isn't cold plunging dangerous?", response: "When used responsibly and following our safety guidelines, cold plunging is practiced safely by millions of people worldwide. We include comprehensive safety documentation and recommend consulting your physician before starting." },
            { objection: "I can't handle cold water.", response: "Most people start at warmer temperatures (58–60°F) for just 1–2 minutes and gradually build tolerance. Our digital controller lets you set the exact temperature that's right for you." },
            { objection: "It seems too expensive.", response: "A Power Plunge pays for itself compared to ongoing cryotherapy sessions, spa memberships, or ice deliveries. We also offer flexible financing options to fit your budget." },
            { objection: "I don't have room for it.", response: "Our units have a compact footprint similar to a standard bathtub and can be placed indoors or outdoors. Many customers set up in garages, patios, or spare bathrooms." },
          ],
        },
      },
    ],
  },
  {
    name: "Financing Kit",
    description: "Financing options + social proof stats — reduces price objections with payment flexibility and credibility",
    category: "kit",
    blocks: [
      {
        type: "financingAndPayment",
        data: {
          title: "Flexible Payment Options",
          bullets: [
            "All major credit and debit cards accepted",
            "Split your purchase into 3–12 monthly installments",
            "0% APR financing available on qualifying orders",
            "Apple Pay and Google Pay supported at checkout",
            "Business purchase orders and net-30 terms available",
          ],
          financingProviderName: "Affirm",
          financingDisclaimer: "Financing is subject to credit approval. Terms and rates may vary based on creditworthiness. 0% APR available on select terms for qualified buyers.",
        },
      },
      {
        type: "socialProofStats",
        data: {
          title: "By the Numbers",
          stats: [
            { value: "10,000+", label: "Units Sold" },
            { value: "4.9/5", label: "Customer Rating" },
            { value: "50+", label: "Pro Teams" },
            { value: "2 Year", label: "Warranty" },
          ],
          disclaimer: "Statistics reflect cumulative data as of the most recent reporting period.",
        },
      },
    ],
  },
];
