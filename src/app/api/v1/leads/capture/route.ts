import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createDemoSeed } from "@/lib/demo/seed";
import { pickNextOwner } from "@/lib/distribution/lead-distribution";

/**
 * Custom API integration endpoints for capturing leads from external systems.
 * Auth: provide `x-prspct-api-key` header when PRSPCT_API_KEY is configured.
 * In demo mode without the key, requests are accepted with a warning.
 */

function authorize(request: NextRequest): { ok: boolean; demo: boolean; error?: string } {
  const configured = Boolean(process.env.PRSPCT_API_KEY);
  const provided = request.headers.get("x-prspct-api-key");
  if (!configured) {
    return { ok: true, demo: true };
  }
  if (provided !== process.env.PRSPCT_API_KEY) {
    return { ok: false, demo: false, error: "Invalid or missing x-prspct-api-key." };
  }
  return { ok: true, demo: false };
}

const leadCaptureSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  source: z.string().default("API"),
  jobTitle: z.string().optional(),
  distribute: z.boolean().optional().default(true),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  const auth = authorize(request);
  if (!auth.ok) {
    return NextResponse.json({ data: null, error: { message: auth.error } }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = leadCaptureSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: { message: "Invalid payload", issues: parsed.error.issues } },
      { status: 400 },
    );
  }

  const seed = createDemoSeed();
  const agentIds = seed.users.filter((user) => user.role === "rep" || user.role === "manager").map((user) => user.id);
  const distribution = parsed.data.distribute
    ? pickNextOwner(agentIds.length ? agentIds : seed.users.map((user) => user.id), 0)
    : { ownerId: seed.users[0]?.id ?? "user-admin", nextIndex: 0 };

  const lead = {
    id: `api-lead-${Date.now()}`,
    ...parsed.data,
    ownerId: distribution.ownerId,
    createdAt: new Date().toISOString(),
    demo: auth.demo,
  };

  return NextResponse.json(
    {
      data: lead,
      error: null,
      meta: {
        distribution: "round_robin",
        note: auth.demo
          ? "Demo mode: set PRSPCT_API_KEY to require authenticated API capture."
          : "Lead accepted. Persist via connected CRM storage in production.",
      },
    },
    { status: 201 },
  );
}

export async function GET() {
  return NextResponse.json({
    data: {
      endpoint: "/api/v1/leads/capture",
      method: "POST",
      headers: { "x-prspct-api-key": "required when PRSPCT_API_KEY is set" },
      body: {
        firstName: "string",
        lastName: "string",
        email: "string?",
        phone: "string?",
        company: "string?",
        source: "string?",
        distribute: "boolean?",
      },
    },
    error: null,
  });
}
