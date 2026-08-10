import { scoreProspect } from "@/lib/scoring/score-prospect";
import type {
  DemoActivity,
  DemoAutomation,
  DemoCompany,
  DemoDatabase,
  DemoDeal,
  DemoList,
  DemoNotification,
  DemoNote,
  DemoPipelineStage,
  DemoProspect,
  DemoProspectStatus,
  DemoTag,
  DemoTask,
  DemoUserProfile,
} from "./types";

const ORG_ID = "org-demo";
const GENERATED_AT = "2026-08-10T09:00:00.000Z";
const TODAY = Date.UTC(2026, 7, 10, 9, 0, 0);

const ownerIds = ["user-rep-1", "user-rep-2", "user-manager"];

function iso(daysFromToday: number, hour = 9): string {
  const date = new Date(TODAY + daysFromToday * 24 * 60 * 60 * 1000);
  date.setUTCHours(hour, 0, 0, 0);
  return date.toISOString();
}

function id(prefix: string, index: number): string {
  return `${prefix}-${String(index).padStart(3, "0")}`;
}

const users: DemoUserProfile[] = [
  {
    id: "user-admin",
    organizationId: ORG_ID,
    email: "admin@prspct.demo",
    name: "Admin User",
    role: "admin",
    title: "Founder",
    onboardingComplete: true,
    createdAt: iso(-120),
  },
  {
    id: "user-manager",
    organizationId: ORG_ID,
    email: "manager@prspct.demo",
    name: "Sales Manager",
    role: "manager",
    title: "Sales Manager",
    onboardingComplete: true,
    createdAt: iso(-118),
  },
  {
    id: "user-rep-1",
    organizationId: ORG_ID,
    email: "rep1@prspct.demo",
    name: "Sales Rep 1",
    role: "rep",
    title: "Account Executive",
    onboardingComplete: true,
    createdAt: iso(-112),
  },
  {
    id: "user-rep-2",
    organizationId: ORG_ID,
    email: "rep2@prspct.demo",
    name: "Sales Rep 2",
    role: "rep",
    title: "Account Executive",
    onboardingComplete: true,
    createdAt: iso(-110),
  },
];

const companyTemplates = [
  ["Vertex Labs", "vertexlabs.example", "SaaS", "AI workflow platform for mid-market operations teams.", 240, 28_000_000, "United States", "California", "San Francisco", ["React", "Node.js", "Snowflake", "HubSpot"], 2017, "LinkedIn"],
  ["Nova Systems", "novasystems.example", "Cloud Infrastructure", "Managed cloud systems integrator for digital enterprises.", 620, 92_000_000, "United States", "Texas", "Austin", ["AWS", "Kubernetes", "Terraform", "Salesforce"], 2011, "Referral"],
  ["Apex Realty", "apexrealty.example", "Real Estate", "Commercial real estate developer focused on mixed-use properties.", 180, 45_000_000, "India", "Telangana", "Hyderabad", ["WordPress", "Zoho", "Google Analytics"], 2008, "Event"],
  ["GrowthForge", "growthforge.example", "Marketing Services", "Revenue marketing studio for D2C and B2B brands.", 95, 12_000_000, "United States", "New York", "New York", ["HubSpot", "Webflow", "Segment"], 2019, "Website"],
  ["CloudMatrix", "cloudmatrix.example", "SaaS", "Cloud cost intelligence for finance and platform teams.", 310, 38_500_000, "India", "Karnataka", "Bengaluru", ["Next.js", "PostgreSQL", "Stripe", "AWS"], 2016, "Webinar"],
  ["ScaleWorks", "scaleworks.example", "Consulting", "GTM advisory firm helping startups scale sales motions.", 74, 9_000_000, "United States", "Colorado", "Denver", ["Pipedrive", "Notion", "Slack"], 2020, "Referral"],
  ["BrightCart", "brightcart.example", "D2C", "Premium home goods brand with omnichannel commerce.", 130, 22_000_000, "India", "Maharashtra", "Mumbai", ["Shopify", "Klaviyo", "Meta Ads"], 2018, "Inbound"],
  ["HarborPoint Capital", "harborpoint.example", "Financial Services", "Growth debt and advisory firm for software companies.", 210, 55_000_000, "United States", "Massachusetts", "Boston", ["Salesforce", "Tableau", "Azure"], 2006, "Conference"],
  ["BluePeak Analytics", "bluepeak.example", "Analytics", "Customer intelligence analytics suite for subscription businesses.", 155, 18_000_000, "India", "Delhi", "New Delhi", ["Python", "BigQuery", "Looker"], 2015, "LinkedIn"],
  ["UrbanNest Builders", "urbannest.example", "Real Estate", "Residential township and senior living developer.", 420, 80_000_000, "India", "Karnataka", "Bengaluru", ["SAP", "Zoho", "Google Workspace"], 2002, "Event"],
  ["PulseRetail", "pulseretail.example", "Retail", "Retail execution software and analytics for regional chains.", 260, 31_000_000, "United States", "Illinois", "Chicago", ["React", "Azure", "Power BI"], 2014, "Website"],
  ["TerraGrid Energy", "terragrid.example", "Energy", "Distributed solar and storage developer for commercial sites.", 390, 70_000_000, "United States", "Arizona", "Phoenix", ["Salesforce", "ArcGIS", "AWS"], 2010, "Referral"],
  ["OmniDesk", "omnidesk.example", "SaaS", "Support operations platform for fast-growing customer success teams.", 145, 16_500_000, "India", "Tamil Nadu", "Chennai", ["Ruby on Rails", "Intercom", "PostgreSQL"], 2019, "Product Hunt"],
  ["FoundryIQ", "foundryiq.example", "Manufacturing", "Smart factory analytics for discrete manufacturers.", 510, 88_000_000, "United States", "Michigan", "Detroit", ["IoT", "Azure", "Databricks"], 2009, "Outbound"],
  ["LuxeLeaf", "luxeleaf.example", "D2C", "Clean beauty brand with direct-to-consumer distribution.", 85, 14_000_000, "India", "Haryana", "Gurugram", ["Shopify", "Klaviyo", "Gorgias"], 2021, "Instagram"],
  ["CivicStack", "civicstack.example", "GovTech", "Citizen services CRM for municipal governments.", 120, 19_000_000, "United States", "Washington", "Seattle", ["Next.js", "PostgreSQL", "AWS GovCloud"], 2018, "Conference"],
  ["MedicaLoop", "medicaloop.example", "Healthcare", "Patient engagement and referral coordination software.", 275, 42_000_000, "India", "Maharashtra", "Pune", ["React", "FHIR", "Azure"], 2013, "Webinar"],
  ["SummitWare", "summitware.example", "SaaS", "Procurement automation for distributed finance teams.", 330, 48_000_000, "United States", "Utah", "Salt Lake City", ["Vue", "Node.js", "NetSuite"], 2016, "LinkedIn"],
  ["MetroHabitat", "metrohabitat.example", "Real Estate", "Urban redevelopment and commercial leasing group.", 260, 67_000_000, "India", "Telangana", "Hyderabad", ["Salesforce", "SAP", "Power BI"], 2005, "Referral"],
  ["QuantumCart", "quantumcart.example", "E-commerce", "Checkout optimization platform for marketplaces.", 190, 29_000_000, "United States", "Georgia", "Atlanta", ["React", "Stripe", "Snowflake"], 2017, "Inbound"],
  ["PrismHRX", "prismhrx.example", "HR Tech", "Talent intelligence for high-volume hiring teams.", 165, 21_000_000, "India", "Karnataka", "Bengaluru", ["Angular", "PostgreSQL", "HubSpot"], 2020, "Website"],
  ["Northstar Foods", "northstarfoods.example", "Food & Beverage", "Packaged foods company expanding into premium snacks.", 560, 110_000_000, "United States", "Minnesota", "Minneapolis", ["SAP", "Shopify", "Tableau"], 1998, "Outbound"],
  ["FinEdge Labs", "finedgelabs.example", "FinTech", "Embedded lending APIs for B2B marketplaces.", 205, 36_000_000, "India", "Maharashtra", "Mumbai", ["Go", "PostgreSQL", "AWS"], 2018, "Webinar"],
  ["Elevate Spaces", "elevatespaces.example", "Real Estate", "Flexible workspace operator for enterprise satellite offices.", 150, 24_000_000, "United States", "Florida", "Miami", ["HubSpot", "Stripe", "Airtable"], 2019, "Event"],
  ["CatalystOps", "catalystops.example", "Consulting", "Operations transformation partner for scaling companies.", 98, 13_000_000, "India", "Delhi", "New Delhi", ["Notion", "HubSpot", "Google Workspace"], 2021, "Referral"],
  ["SignalPath", "signalpath.example", "Telecom", "Network observability for telecom operations centers.", 430, 76_000_000, "United States", "North Carolina", "Raleigh", ["Kubernetes", "Grafana", "Kafka"], 2012, "Conference"],
  ["Mosaic Commerce", "mosaiccommerce.example", "D2C", "Lifestyle apparel brand selling through owned and marketplace channels.", 115, 18_500_000, "India", "Karnataka", "Bengaluru", ["Shopify", "Klaviyo", "Razorpay"], 2020, "Instagram"],
  ["AtlasBridge", "atlasbridge.example", "Logistics", "Cross-border logistics coordination platform.", 360, 64_000_000, "United States", "California", "Los Angeles", ["React", "Node.js", "Snowflake"], 2014, "Outbound"],
  ["Rentora", "rentora.example", "PropTech", "Tenant lifecycle software for property managers.", 125, 17_000_000, "India", "Telangana", "Hyderabad", ["Next.js", "Supabase", "Stripe"], 2022, "Product Hunt"],
  ["Evergreen Robotics", "evergreenrobotics.example", "Robotics", "Warehouse robotics and fleet orchestration software.", 470, 95_000_000, "United States", "Pennsylvania", "Pittsburgh", ["ROS", "Python", "AWS"], 2015, "Conference"],
  ["BeaconLearn", "beaconlearn.example", "EdTech", "Upskilling platform for enterprise frontline teams.", 225, 32_000_000, "India", "Tamil Nadu", "Chennai", ["React", "Node.js", "Mixpanel"], 2017, "Website"],
  ["Meridian Bio", "meridianbio.example", "Biotech", "Research tools and lab workflow software for biotech teams.", 340, 58_000_000, "United States", "California", "San Diego", ["Python", "AWS", "Salesforce"], 2011, "LinkedIn"],
] as const;

const pipelineStageTemplates: Array<[string, string, number, number]> = [
  ["stage-new", "New", 1, 10],
  ["stage-contacted", "Contacted", 2, 20],
  ["stage-engaged", "Engaged", 3, 35],
  ["stage-qualified", "Qualified", 4, 50],
  ["stage-meeting", "Meeting", 5, 60],
  ["stage-proposal", "Proposal", 6, 70],
  ["stage-negotiation", "Negotiation", 7, 85],
  ["stage-won", "Won", 8, 100],
  ["stage-lost", "Lost", 9, 0],
];

const pipelineStages: DemoPipelineStage[] = pipelineStageTemplates.map(([stageId, name, order, probability]) => ({
  id: stageId,
  organizationId: ORG_ID,
  name,
  order,
  probability,
  createdAt: iso(-100),
}));

const tagDefinitions: Array<Omit<DemoTag, "prospectIds">> = [
  { id: "tag-hot", organizationId: ORG_ID, name: "Hot", color: "#ef4444", createdAt: iso(-90) },
  { id: "tag-enterprise", organizationId: ORG_ID, name: "Enterprise", color: "#6366f1", createdAt: iso(-90) },
  { id: "tag-d2c", organizationId: ORG_ID, name: "D2C", color: "#ec4899", createdAt: iso(-90) },
  { id: "tag-founder", organizationId: ORG_ID, name: "Founder", color: "#f97316", createdAt: iso(-90) },
  { id: "tag-decision-maker", organizationId: ORG_ID, name: "Decision Maker", color: "#22c55e", createdAt: iso(-90) },
  { id: "tag-follow-up", organizationId: ORG_ID, name: "Follow-up", color: "#eab308", createdAt: iso(-90) },
  { id: "tag-high-intent", organizationId: ORG_ID, name: "High Intent", color: "#14b8a6", createdAt: iso(-90) },
];

function createCompanies(): DemoCompany[] {
  return companyTemplates.map(
    (
      [
        name,
        domain,
        industry,
        description,
        employeeCount,
        revenue,
        country,
        state,
        city,
        technologies,
        foundedYear,
        source,
      ],
      index,
    ) => ({
      id: id("c", index + 1),
      organizationId: ORG_ID,
      name,
      domain,
      website: `https://${domain}`,
      industry,
      description,
      employeeCount,
      revenue,
      country,
      state,
      city,
      technologies: [...technologies],
      foundedYear,
      source,
      createdAt: iso(-80 + (index % 24)),
    }),
  );
}

const firstNames = [
  "Aarav",
  "Maya",
  "Rohan",
  "Priya",
  "Vikram",
  "Ananya",
  "Neha",
  "Arjun",
  "Isha",
  "Kabir",
  "Liam",
  "Olivia",
  "Noah",
  "Emma",
  "Ava",
  "Ethan",
  "Sophia",
  "Mason",
  "Isabella",
  "Lucas",
];

const lastNames = [
  "Sharma",
  "Reddy",
  "Mehta",
  "Kapoor",
  "Iyer",
  "Patel",
  "Nair",
  "Gupta",
  "Singh",
  "Rao",
  "Carter",
  "Brooks",
  "Mitchell",
  "Parker",
  "Turner",
  "Reed",
  "Morgan",
  "Bennett",
  "Cooper",
  "Hayes",
];

const titles = [
  ["Founder & CEO", "Founder", "Executive"],
  ["Chief Marketing Officer", "C-Level", "Marketing"],
  ["VP Sales", "VP", "Sales"],
  ["Head of Growth", "Head", "Revenue"],
  ["Director of Partnerships", "Director", "Sales"],
  ["Revenue Operations Lead", "Manager", "Revenue"],
  ["Marketing Manager", "Manager", "Marketing"],
  ["Product Lead", "Manager", "Product"],
  ["Chief Technology Officer", "C-Level", "Engineering"],
  ["Managing Director", "C-Level", "Executive"],
] as const;

const statusCycle: DemoProspectStatus[] = [
  "new",
  "contacted",
  "engaged",
  "qualified",
  "meeting",
  "proposal",
  "negotiation",
  "won",
  "lost",
  "nurture",
];

const sourceCycle = ["LinkedIn", "Website", "Referral", "Webinar", "Inbound", "Conference", "Outbound", "Product Hunt"];

function tagIdsFor(index: number, company: DemoCompany, title: string): string[] {
  const tags = new Set<string>();
  const titleLower = title.toLowerCase();

  if (index % 5 === 0) tags.add("tag-hot");
  if (company.employeeCount >= 300) tags.add("tag-enterprise");
  if (["D2C", "Retail", "E-commerce"].includes(company.industry)) tags.add("tag-d2c");
  if (titleLower.includes("founder")) tags.add("tag-founder");
  if (["founder", "chief", "vp", "director", "head"].some((term) => titleLower.includes(term))) {
    tags.add("tag-decision-maker");
  }
  if (index % 4 === 0) tags.add("tag-follow-up");
  if (index % 6 === 0 || sourceCycle[index % sourceCycle.length] === "Website") tags.add("tag-high-intent");

  return Array.from(tags);
}

function createProspects(companies: DemoCompany[]): DemoProspect[] {
  return Array.from({ length: 120 }, (_, index) => {
    const company = companies[index % companies.length];
    const [jobTitle, seniority, department] = titles[index % titles.length];
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[(index * 3) % lastNames.length];
    const prospectId = id("p", index + 1);
    const status = statusCycle[index % statusCycle.length];
    const source = sourceCycle[index % sourceCycle.length];
    const tagIds = tagIdsFor(index, company, jobTitle);
    const lastContactedAt = status === "new" ? undefined : iso(-((index % 21) + 1), 10 + (index % 5));
    const nextFollowupAt =
      status === "won" || status === "lost" ? undefined : iso((index % 14) - 4, 11 + (index % 4));
    const scored = scoreProspect({
      jobTitle,
      seniority,
      department,
      source,
      status,
      country: company.country,
      tagIds,
      company,
    });

    return {
      id: prospectId,
      organizationId: ORG_ID,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      jobTitle,
      seniority,
      department,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${String(index + 1).padStart(3, "0")}@example.com`,
      phone:
        company.country === "India"
          ? `+91 90000 ${String(10000 + index).slice(-5)}`
          : `+1 555 01${String(index).padStart(2, "0")}`,
      city: company.city,
      country: company.country,
      industry: company.industry,
      source,
      status,
      leadScore: scored.leadScore,
      leadTemperature: scored.leadTemperature,
      ownerId: ownerIds[index % ownerIds.length],
      companyId: company.id,
      tagIds,
      lastContactedAt,
      nextFollowupAt,
      createdAt: iso(-70 + (index % 60), 8 + (index % 8)),
    };
  });
}

function createTags(prospects: DemoProspect[]): DemoTag[] {
  return tagDefinitions.map((tag) => ({
    ...tag,
    prospectIds: prospects.filter((prospect) => prospect.tagIds.includes(tag.id)).map((prospect) => prospect.id),
  }));
}

function createLists(prospects: DemoProspect[], companies: DemoCompany[]): DemoList[] {
  const companyById = new Map(companies.map((company) => [company.id, company]));
  const hasIndustry = (prospect: DemoProspect, industries: string[]) =>
    industries.includes(companyById.get(prospect.companyId)?.industry ?? "");

  return [
    {
      id: "list-hyderabad-founders",
      organizationId: ORG_ID,
      name: "Hyderabad Founders",
      description: "Founder and executive prospects based in Hyderabad.",
      prospectIds: prospects
        .filter((prospect) => prospect.city === "Hyderabad" && prospect.tagIds.includes("tag-founder"))
        .map((prospect) => prospect.id),
      createdBy: "user-manager",
      createdAt: iso(-45),
    },
    {
      id: "list-real-estate-developers",
      organizationId: ORG_ID,
      name: "Real Estate Developers",
      description: "Developers, PropTech operators, and property groups.",
      prospectIds: prospects.filter((prospect) => hasIndustry(prospect, ["Real Estate", "PropTech"])).map((prospect) => prospect.id),
      createdBy: "user-rep-1",
      createdAt: iso(-40),
    },
    {
      id: "list-d2c-cmos",
      organizationId: ORG_ID,
      name: "D2C CMOs",
      description: "Marketing leaders at D2C, retail, and e-commerce brands.",
      prospectIds: prospects
        .filter(
          (prospect) =>
            prospect.department === "Marketing" && hasIndustry(prospect, ["D2C", "Retail", "E-commerce"]),
        )
        .map((prospect) => prospect.id),
      createdBy: "user-rep-2",
      createdAt: iso(-37),
    },
    {
      id: "list-saas-ceos",
      organizationId: ORG_ID,
      name: "SaaS CEOs",
      description: "C-level SaaS prospects for founder-led outbound.",
      prospectIds: prospects
        .filter((prospect) => prospect.seniority === "C-Level" && hasIndustry(prospect, ["SaaS"]))
        .map((prospect) => prospect.id),
      createdBy: "user-manager",
      createdAt: iso(-30),
    },
    {
      id: "list-hot-leads",
      organizationId: ORG_ID,
      name: "Hot Leads",
      description: "Highest scoring prospects across every rep.",
      prospectIds: prospects.filter((prospect) => prospect.leadTemperature === "hot").map((prospect) => prospect.id),
      createdBy: "user-admin",
      createdAt: iso(-18),
    },
    {
      id: "list-needs-follow-up",
      organizationId: ORG_ID,
      name: "Needs Follow-up",
      description: "Open prospects with follow-up due soon.",
      prospectIds: prospects
        .filter((prospect) => prospect.nextFollowupAt && new Date(prospect.nextFollowupAt).getTime() <= TODAY + 2 * 24 * 60 * 60 * 1000)
        .map((prospect) => prospect.id),
      createdBy: "user-manager",
      createdAt: iso(-12),
    },
  ];
}

function createDeals(prospects: DemoProspect[], companies: DemoCompany[]): DemoDeal[] {
  const stageIds = pipelineStages.map((stage) => stage.id);
  const stageById = new Map(pipelineStages.map((stage) => [stage.id, stage]));

  return Array.from({ length: 18 }, (_, index) => {
    const prospect = prospects[index * 4];
    const company = companies.find((candidate) => candidate.id === prospect.companyId) ?? companies[0];
    const stageId = stageIds[index % stageIds.length];
    const stage = stageById.get(stageId) ?? pipelineStages[0];

    return {
      id: id("d", index + 1),
      organizationId: ORG_ID,
      name: `${company.name} revenue platform rollout`,
      prospectId: prospect.id,
      companyId: company.id,
      ownerId: prospect.ownerId,
      stageId,
      value: 12_000 + (index % 6) * 7_500 + (company.employeeCount >= 300 ? 20_000 : 0),
      currency: "USD",
      probability: stage.probability,
      expectedCloseDate: iso(10 + index * 3),
      status: stage.name === "Won" ? "won" : stage.name === "Lost" ? "lost" : "open",
      createdAt: iso(-35 + index),
    };
  });
}

function createTasks(prospects: DemoProspect[], deals: DemoDeal[]): DemoTask[] {
  const taskTitles = [
    "Send intro email",
    "Call decision maker",
    "Prepare discovery notes",
    "Confirm budget range",
    "Share product walkthrough",
    "Follow up on proposal",
    "Book stakeholder meeting",
    "Update CRM fields",
  ];

  return Array.from({ length: 24 }, (_, index) => {
    const completed = index >= 18;
    const dueOffset = index < 6 ? -6 + index : index < 12 ? 0 : index < 18 ? index - 10 : -index;
    const prospect = prospects[index * 3];
    const deal = deals[index % deals.length];

    return {
      id: id("task", index + 1),
      organizationId: ORG_ID,
      title: taskTitles[index % taskTitles.length],
      description: `Demo task for ${prospect.fullName} at account ${prospect.companyId}.`,
      status: completed ? "completed" : index % 3 === 0 ? "in_progress" : "todo",
      priority: index % 5 === 0 ? "high" : index % 2 === 0 ? "medium" : "low",
      dueDate: iso(dueOffset, 15),
      assignedTo: ownerIds[index % ownerIds.length],
      prospectId: prospect.id,
      companyId: prospect.companyId,
      dealId: index % 2 === 0 ? deal.id : undefined,
      completedAt: completed ? iso(-index, 17) : undefined,
      createdAt: iso(-28 + index),
    };
  });
}

function createNotes(prospects: DemoProspect[], deals: DemoDeal[]): DemoNote[] {
  const noteBodies = [
    "Prospect is evaluating tools to centralize outbound research and handoff.",
    "Strong pain around stale lead data and slow territory planning.",
    "Asked for examples specific to India and US expansion motions.",
    "Budget owner wants clear ROI model before a wider pilot.",
    "Current workflow relies on spreadsheets and manual enrichment.",
    "Interested in alerts for high-intent accounts entering the market.",
  ];

  return Array.from({ length: 24 }, (_, index) => {
    const prospect = prospects[index * 2];
    const deal = deals[index % deals.length];

    return {
      id: id("note", index + 1),
      organizationId: ORG_ID,
      body: noteBodies[index % noteBodies.length],
      authorId: ownerIds[index % ownerIds.length],
      prospectId: prospect.id,
      companyId: prospect.companyId,
      dealId: index % 3 === 0 ? deal.id : undefined,
      createdAt: iso(-25 + index, 13),
    };
  });
}

function createActivities(prospects: DemoProspect[], companies: DemoCompany[], deals: DemoDeal[]): DemoActivity[] {
  const activityTypes: DemoActivity["type"][] = ["created", "emailed", "called", "meeting", "note", "task", "deal", "stage_changed"];

  return Array.from({ length: 72 }, (_, index) => {
    const prospect = prospects[index % prospects.length];
    const company = companies.find((candidate) => candidate.id === prospect.companyId) ?? companies[0];
    const deal = deals[index % deals.length];
    const type = activityTypes[index % activityTypes.length];

    return {
      id: id("act", index + 1),
      organizationId: ORG_ID,
      actorId: ownerIds[index % ownerIds.length],
      type,
      subjectType: type === "deal" || type === "stage_changed" ? "deal" : "prospect",
      subjectId: type === "deal" || type === "stage_changed" ? deal.id : prospect.id,
      summary:
        type === "stage_changed"
          ? `Moved ${deal.name} through the pipeline.`
          : `${prospect.fullName} at ${company.name}: ${type.replace("_", " ")} activity logged.`,
      prospectId: prospect.id,
      companyId: company.id,
      dealId: type === "deal" || type === "stage_changed" ? deal.id : undefined,
      metadata: {
        source: prospect.source,
        score: prospect.leadScore,
      },
      createdAt: iso(-35 + (index % 35), 9 + (index % 9)),
    };
  });
}

function createNotifications(): DemoNotification[] {
  return [
    {
      id: "notif-001",
      organizationId: ORG_ID,
      userId: "user-admin",
      title: "Demo workspace ready",
      body: "PRSPCT Demo has been seeded with companies, prospects, lists, and activity.",
      read: false,
      link: "/dashboard",
      createdAt: iso(-1, 9),
    },
    {
      id: "notif-002",
      organizationId: ORG_ID,
      userId: "user-manager",
      title: "8 hot leads need review",
      body: "Several high-intent prospects were added to the Hot Leads list.",
      read: false,
      link: "/prospects?temperature=hot",
      createdAt: iso(-1, 11),
    },
    {
      id: "notif-003",
      organizationId: ORG_ID,
      userId: "user-rep-1",
      title: "Follow-up due today",
      body: "You have tasks due today for Apex Realty and MetroHabitat.",
      read: false,
      link: "/tasks",
      createdAt: iso(0, 8),
    },
    {
      id: "notif-004",
      organizationId: ORG_ID,
      userId: "user-rep-2",
      title: "Proposal viewed",
      body: "A stakeholder opened the GrowthForge proposal.",
      read: true,
      link: "/deals/d-006",
      createdAt: iso(-2, 14),
    },
    {
      id: "notif-005",
      organizationId: ORG_ID,
      userId: "user-manager",
      title: "Automation triggered",
      body: "High intent routing assigned new inbound leads to the reps.",
      read: true,
      link: "/automations",
      createdAt: iso(-3, 10),
    },
    {
      id: "notif-006",
      organizationId: ORG_ID,
      userId: "user-admin",
      title: "Free plan usage",
      body: "The demo workspace is using sample FREE plan limits.",
      read: true,
      link: "/settings/billing",
      createdAt: iso(-4, 16),
    },
  ];
}

const automations: DemoAutomation[] = [
  {
    id: "auto-001",
    organizationId: ORG_ID,
    name: "Route high intent leads",
    description: "Assign inbound high-intent prospects to the next available sales rep.",
    enabled: true,
    trigger: "Prospect created",
    conditions: ["leadTemperature = hot", "source in Website, Inbound, Webinar"],
    actions: ["Assign owner round-robin", "Create follow-up task due today", "Notify manager"],
    createdBy: "user-manager",
    createdAt: iso(-20),
  },
  {
    id: "auto-002",
    organizationId: ORG_ID,
    name: "Follow-up reminder",
    description: "Create a reminder when no activity is logged after a meeting.",
    enabled: true,
    trigger: "Meeting activity logged",
    conditions: ["No nextFollowupAt exists"],
    actions: ["Set next follow-up in 2 days", "Create task for owner"],
    createdBy: "user-admin",
    createdAt: iso(-18),
  },
  {
    id: "auto-003",
    organizationId: ORG_ID,
    name: "Won deal celebration",
    description: "Notify the team when a deal moves to Won.",
    enabled: false,
    trigger: "Deal stage changed",
    conditions: ["stage = Won"],
    actions: ["Notify organization", "Create onboarding handoff task"],
    createdBy: "user-admin",
    createdAt: iso(-14),
  },
];

export function createDemoSeed(): DemoDatabase {
  const companies = createCompanies();
  const prospects = createProspects(companies);
  const tags = createTags(prospects);
  const lists = createLists(prospects, companies);
  const deals = createDeals(prospects, companies);
  const tasks = createTasks(prospects, deals);
  const notes = createNotes(prospects, deals);
  const activities = createActivities(prospects, companies, deals);
  const notifications = createNotifications();

  return {
    meta: {
      version: 1,
      generatedAt: GENERATED_AT,
      passwordHint: "demo1234",
    },
    organization: {
      id: ORG_ID,
      name: "PRSPCT Demo",
      createdAt: iso(-120),
    },
    users,
    companies,
    prospects,
    lists,
    tags,
    pipelineStages,
    deals,
    tasks,
    notes,
    activities,
    notifications,
    automations,
    icpProfile: {
      id: "icp-default",
      organizationId: ORG_ID,
      name: "Default PRSPCT ICP",
      industries: ["SaaS", "D2C", "Real Estate", "FinTech", "Healthcare"],
      employeeCountMin: 50,
      employeeCountMax: 1_000,
      revenueMin: 5_000_000,
      revenueMax: 120_000_000,
      regions: ["India", "United States"],
      seniorities: ["Founder", "C-Level", "VP", "Head", "Director"],
      departments: ["Executive", "Marketing", "Sales", "Revenue"],
      technologies: ["HubSpot", "Salesforce", "Shopify", "AWS", "PostgreSQL"],
      createdAt: iso(-90),
    },
    subscription: {
      organizationId: ORG_ID,
      plan: "FREE",
      usage: {
        prospects: prospects.length,
        companies: companies.length,
        exports: 2,
        enrichmentCredits: 120,
        seats: users.length,
      },
      limits: {
        prospects: 250,
        companies: 50,
        exports: 5,
        enrichmentCredits: 500,
        seats: 5,
      },
      currentPeriodStart: iso(-10),
      currentPeriodEnd: iso(20),
    },
  };
}
