import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createDemoSeed } from "@/lib/demo/seed";
import type { DemoProspect } from "@/lib/demo/types";
import { scoreProspect } from "@/lib/scoring/score-prospect";

const prospectSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  jobTitle: z.string().trim().min(1),
  seniority: z.string().trim().min(1).default("Unknown"),
  department: z.string().trim().min(1).default("Unknown"),
  email: z.string().trim().email(),
  phone: z.string().trim().optional().default(""),
  city: z.string().trim().optional().default(""),
  country: z.string().trim().optional().default(""),
  industry: z.string().trim().optional().default("Unknown"),
  source: z.string().trim().optional().default("API"),
  status: z
    .enum(["new", "contacted", "engaged", "qualified", "meeting", "proposal", "negotiation", "won", "lost", "nurture"])
    .default("new"),
  ownerId: z.string().trim().optional(),
  companyId: z.string().trim().optional(),
  tagIds: z.array(z.string()).optional().default([]),
});

export async function GET(request: NextRequest) {
  const seed = createDemoSeed();
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? 50);

  return NextResponse.json({
    data: seed.prospects.slice(0, Number.isFinite(limit) ? Math.max(1, Math.min(limit, 200)) : 50),
    error: null,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = prospectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        data: null,
        error: {
          message: "Invalid prospect payload.",
          issues: parsed.error.issues,
        },
      },
      { status: 400 },
    );
  }

  const seed = createDemoSeed();
  const company = seed.companies.find((candidate) => candidate.id === parsed.data.companyId) ?? seed.companies[0];
  const scored = scoreProspect({
    jobTitle: parsed.data.jobTitle,
    seniority: parsed.data.seniority,
    department: parsed.data.department,
    source: parsed.data.source,
    status: parsed.data.status,
    country: parsed.data.country || company?.country,
    tagIds: parsed.data.tagIds,
    company,
  });
  const createdAt = new Date().toISOString();
  const prospect: DemoProspect = {
    id: `api-${Date.now()}`,
    organizationId: seed.organization.id,
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
    fullName: `${parsed.data.firstName} ${parsed.data.lastName}`,
    jobTitle: parsed.data.jobTitle,
    seniority: parsed.data.seniority,
    department: parsed.data.department,
    email: parsed.data.email,
    phone: parsed.data.phone,
    city: parsed.data.city || company?.city || "",
    country: parsed.data.country || company?.country || "",
    industry: parsed.data.industry || company?.industry || "Unknown",
    source: parsed.data.source,
    status: parsed.data.status,
    leadScore: scored.leadScore,
    leadTemperature: scored.leadTemperature,
    ownerId: parsed.data.ownerId ?? seed.users[0]?.id ?? "user-admin",
    companyId: parsed.data.companyId ?? company?.id ?? "",
    tagIds: parsed.data.tagIds,
    createdAt,
  };

  return NextResponse.json({ data: prospect, error: null }, { status: 201 });
}
