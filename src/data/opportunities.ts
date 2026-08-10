import type {
  ExplorerCategory,
  Insight,
  JourneyStep,
  NavItem,
  Opportunity,
  Principle,
  ProcessStage,
  StatItem,
  Testimonial,
} from "@/types";

export const navItems: NavItem[] = [
  { label: "About", href: "/#philosophy" },
  { label: "Opportunities", href: "/#opportunities" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Insights", href: "/#insights" },
  { label: "Contact", href: "/#contact" },
];

/** Placeholder metrics — replace with verified figures before launch. */
export const stats: StatItem[] = [
  {
    id: "investors",
    value: "XX+",
    numericValue: undefined,
    label: "Investors",
    isPlaceholder: true,
  },
  {
    id: "opportunities",
    value: "XX+",
    numericValue: undefined,
    label: "Opportunities",
    isPlaceholder: true,
  },
  {
    id: "capital",
    value: "₹XX Cr+",
    numericValue: undefined,
    label: "Capital Deployed",
    isPlaceholder: true,
  },
  {
    id: "markets",
    value: "XX",
    numericValue: undefined,
    label: "Markets",
    isPlaceholder: true,
  },
];

export const opportunities: Opportunity[] = [
  {
    id: "real-estate",
    number: "01",
    title: "Real Estate",
    category: "real-estate",
    description:
      "Carefully evaluated residential and commercial opportunities selected for location quality, developer discipline and long-term demand drivers.",
    riskLevel: "Moderate",
    investmentHorizon: "3–7 years",
    opportunityType: "Asset-backed",
    status: "open",
    featured: true,
    href: "#explorer",
  },
  {
    id: "private-businesses",
    number: "02",
    title: "Private Businesses",
    category: "businesses",
    description:
      "Select private companies with clear economics, operating leverage and pathways for patient capital to create durable value.",
    riskLevel: "Elevated",
    investmentHorizon: "4–8 years",
    opportunityType: "Private equity",
    status: "open",
    featured: true,
    href: "#explorer",
  },
  {
    id: "startups",
    number: "03",
    title: "Startups & Emerging Companies",
    category: "startups",
    description:
      "Early and growth-stage opportunities where research, founder quality and market structure matter more than narrative.",
    riskLevel: "Elevated",
    investmentHorizon: "5–10 years",
    opportunityType: "Venture / growth",
    status: "open",
    featured: true,
    href: "#explorer",
  },
  {
    id: "alternatives",
    number: "04",
    title: "Alternative Opportunities",
    category: "alternatives",
    description:
      "Selective alternative allocations designed to diversify exposure beyond traditional public and private markets.",
    riskLevel: "Variable",
    investmentHorizon: "Varies",
    opportunityType: "Alternatives",
    status: "coming-soon",
    featured: true,
    href: "#explorer",
  },
];

export const explorerCategories: ExplorerCategory[] = [
  {
    id: "real-estate",
    label: "Real Estate",
    thesis:
      "Allocate to tangible assets where supply discipline, infrastructure and end-user demand create asymmetric long-term outcomes.",
    characteristics: [
      "Asset-backed exposure",
      "Location and developer diligence",
      "Cash flow and appreciation potential",
      "Defined holding periods",
    ],
    typicalHorizon: "3–7 years",
    riskConsiderations:
      "Liquidity, execution timelines, regulatory change and concentration risk require careful underwriting.",
    whyItMatters:
      "Real assets can anchor a portfolio when selected with research rather than momentum.",
  },
  {
    id: "businesses",
    label: "Businesses",
    thesis:
      "Partner with private businesses that demonstrate durable unit economics, governance readiness and room for operational improvement.",
    characteristics: [
      "Revenue quality focus",
      "Operator alignment",
      "Capital structure clarity",
      "Exit pathway awareness",
    ],
    typicalHorizon: "4–8 years",
    riskConsiderations:
      "Illiquidity, key-person dependency and execution risk must be priced into every decision.",
    whyItMatters:
      "Private businesses can compound when capital arrives with patience and information advantage.",
  },
  {
    id: "startups",
    label: "Startups",
    thesis:
      "Support emerging companies where market structure, founder judgment and product-market fit justify higher uncertainty.",
    characteristics: [
      "Founder-led diligence",
      "Market timing assessment",
      "Stage-appropriate sizing",
      "Portfolio construction mindset",
    ],
    typicalHorizon: "5–10 years",
    riskConsiderations:
      "High failure rates, dilution and valuation volatility demand disciplined position sizing.",
    whyItMatters:
      "Emerging companies can reshape markets — but only a minority deserve capital.",
  },
  {
    id: "alternatives",
    label: "Alternatives",
    thesis:
      "Explore selective alternative exposures that improve diversification when correlation, liquidity and complexity are understood.",
    characteristics: [
      "Low correlation potential",
      "Specialist underwriting",
      "Structure transparency",
      "Risk budgeting first",
    ],
    typicalHorizon: "Varies by structure",
    riskConsiderations:
      "Complexity, fees and opacity can erase the diversification benefit if diligence is weak.",
    whyItMatters:
      "Alternatives are useful tools — not automatic upgrades to a portfolio.",
  },
];

export const processStages: ProcessStage[] = [
  {
    id: "discover",
    number: "01",
    title: "Discover",
    description:
      "Surface opportunities through networks, research and continuous market scanning — not public noise.",
  },
  {
    id: "evaluate",
    number: "02",
    title: "Evaluate",
    description:
      "Apply structured diligence across fundamentals, risk, structure and alignment before any capital conversation.",
  },
  {
    id: "invest",
    number: "03",
    title: "Invest",
    description:
      "Allocate with conviction when the thesis, risk and opportunity set are clear — and walk away when they are not.",
  },
  {
    id: "track",
    number: "04",
    title: "Track",
    description:
      "Monitor progress, revisit assumptions and stay oriented around long-term outcomes rather than short-term movement.",
  },
];

export const principles: Principle[] = [
  {
    id: "curated",
    title: "Curated",
    description: "Not everything deserves capital.",
  },
  {
    id: "research",
    title: "Research-led",
    description: "Decisions start with information.",
  },
  {
    id: "risk",
    title: "Risk-aware",
    description: "Upside matters. Downside matters more.",
  },
  {
    id: "long-term",
    title: "Long-term",
    description: "Build for compounding, not speculation.",
  },
];

export const insights: Insight[] = [
  {
    id: "market-trends",
    category: "Market Trends",
    title: "Reading cycles without chasing them",
    summary:
      "[PLACEHOLDER] A framework for separating durable demand signals from temporary market noise.",
    href: "/insights/",
  },
  {
    id: "investment-themes",
    category: "Investment Themes",
    title: "Where patient capital still finds asymmetry",
    summary:
      "[PLACEHOLDER] Themes we are watching across real assets, private businesses and emerging companies.",
    href: "/insights/",
  },
  {
    id: "capital-intelligence",
    category: "Capital Intelligence",
    title: "Diligence questions that change outcomes",
    summary:
      "[PLACEHOLDER] The underwriting questions sophisticated investors ask before committing capital.",
    href: "/insights/",
  },
];

/** Placeholder testimonials — replace with approved quotes only. */
export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote: "Investor testimonial goes here.",
    name: "[Investor Name]",
    role: "[Investor / Founder / Executive]",
    isPlaceholder: true,
  },
  {
    id: "t2",
    quote: "Investor testimonial goes here.",
    name: "[Investor Name]",
    role: "[Investor / Founder / Executive]",
    isPlaceholder: true,
  },
  {
    id: "t3",
    quote: "Investor testimonial goes here.",
    name: "[Investor Name]",
    role: "[Investor / Founder / Executive]",
    isPlaceholder: true,
  },
];

export const journeySteps: JourneyStep[] = [
  {
    id: "discover",
    title: "Discover",
    description: "Explore the Circle and its investment approach.",
  },
  {
    id: "apply",
    title: "Apply",
    description: "Share your profile and investment interests.",
  },
  {
    id: "qualify",
    title: "Qualify",
    description: "A confidential review of fit and readiness.",
  },
  {
    id: "review",
    title: "Review Opportunities",
    description: "Access curated opportunities aligned to your mandate.",
  },
  {
    id: "invest",
    title: "Invest",
    description: "Allocate with clarity after diligence and discussion.",
  },
  {
    id: "track",
    title: "Track",
    description: "Stay informed as opportunities progress over time.",
  },
];

/** Demo / sample data for intelligence visualizations — not live market data. */
export const screeningDemoData = [
  { name: "Real Estate", risk: 45, opportunity: 68, size: 80 },
  { name: "Businesses", risk: 62, opportunity: 74, size: 70 },
  { name: "Startups", risk: 78, opportunity: 82, size: 55 },
  { name: "Alternatives", risk: 58, opportunity: 60, size: 45 },
];

export const allocationDemoData = [
  { name: "Real Estate", value: 35, fill: "#C9A96E" },
  { name: "Businesses", value: 28, fill: "#A1A1AA" },
  { name: "Startups", value: 22, fill: "#71717A" },
  { name: "Alternatives", value: 15, fill: "#3F3F46" },
];

export const philosophyPoints = [
  "Opportunity discovery",
  "Research",
  "Due diligence",
  "Risk assessment",
  "Long-term thinking",
  "Strategic capital allocation",
];
