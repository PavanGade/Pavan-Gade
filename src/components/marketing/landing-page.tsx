"use client";

import Link from "next/link";
import * as React from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Lock,
  Sparkles,
  Star,
  Target,
  Workflow,
  Zap,
} from "lucide-react";
import { useDemoStore } from "@/stores/demo-store";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const trusted = ["Vertex", "Nova", "Apex", "GrowthForge", "CloudMatrix", "ScaleWorks"];

const faqs = [
  {
    q: "How does PRSPCT help manage prospect data?",
    a: "PRSPCT centralizes prospects, companies, lists, and activity into one workspace so your team can search, score, and act without jumping between tools.",
  },
  {
    q: "Does PRSPCT include automated workflow features?",
    a: "Yes. Trigger automations when leads are created, statuses change, deals move stages, or follow-ups go overdue — create tasks, assign owners, tag records, and notify the team.",
  },
  {
    q: "How do personalized alerts and notifications work?",
    a: "You get reminders for due tasks, overdue follow-ups, assigned leads, deal stage changes, and automation events — all inside the notification center.",
  },
  {
    q: "Can I try PRSPCT without a credit card?",
    a: "Yes. Start in demo mode instantly, or connect Supabase later. No payment is required to explore the product.",
  },
];

const plans = [
  {
    name: "Starter",
    price: 29,
    description: "Ideal for founders and small teams getting started with prospecting.",
    features: [
      "Contact and lead management",
      "Task and follow-up scheduling",
      "Basic reporting and analytics",
      "CSV import and export",
    ],
    featured: false,
  },
  {
    name: "Business",
    price: 59,
    description: "Growing teams that need pipelines, automation, and collaboration.",
    features: [
      "Customizable pipelines and workflows",
      "Team collaboration tools",
      "Advanced analytics",
      "AI outreach drafts",
    ],
    featured: false,
  },
  {
    name: "Enterprise",
    price: 99,
    description: "Larger organizations that need scale, roles, and AI-driven insight.",
    features: [
      "Unlimited users and custom roles",
      "Multi-workspace controls",
      "AI prospect intelligence",
      "Custom integrations",
    ],
    featured: true,
  },
];

function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white shadow-sm">
        <Sparkles className="h-4 w-4" />
      </span>
      <span className="text-[1.35rem] font-extrabold tracking-tight text-black">PRSPCT</span>
    </Link>
  );
}

function PillButton({
  href,
  children,
  variant = "black",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "black" | "white" | "blue" | "ghost";
  className?: string;
}) {
  const styles = {
    black: "bg-black text-white hover:bg-neutral-800",
    white: "bg-white text-black hover:bg-neutral-100",
    blue: "bg-[#2B6EF6] text-white hover:bg-[#1f5de0]",
    ghost: "bg-transparent text-black hover:bg-black/5",
  } as const;

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition",
        styles[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className="w-full rounded-[22px] bg-[#F3F4F6] px-5 py-4 text-left transition hover:bg-[#ECEEF2]"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-[15px] font-semibold text-neutral-900">{q}</span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white">
          <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
        </span>
      </div>
      {open ? <p className="mt-3 text-sm leading-relaxed text-neutral-600">{a}</p> : null}
    </button>
  );
}

export function LandingPage() {
  const session = useDemoStore((s) => s.session);
  const [annual, setAnnual] = React.useState(true);
  const primaryHref = session
    ? session.onboardingComplete
      ? "/app/dashboard"
      : "/onboarding"
    : "/signup";
  const secondaryHref = session ? "/app/dashboard" : "/login";

  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased [font-family:var(--font-dm-sans),ui-sans-serif,system-ui,sans-serif]">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Logo />
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-neutral-500 transition hover:text-black"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {!session ? (
              <Link href="/login" className="hidden text-sm font-semibold text-neutral-700 sm:inline">
                Log in
              </Link>
            ) : null}
            <PillButton href={primaryHref} className="!px-5 !py-2.5 text-sm">
              {session ? "Open app" : "Contact"}
            </PillButton>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.045) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at center, black 35%, transparent 75%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-5 pb-10 pt-16 text-center sm:pt-24">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-black/8 bg-white/80 px-3 py-1.5 shadow-sm">
            <div className="flex -space-x-2">
              {["AU", "SM", "R1"].map((initials) => (
                <span
                  key={initials}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#2B6EF6] to-[#1d4ed8] text-[10px] font-bold text-white"
                >
                  {initials}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
            <span className="text-sm font-medium text-neutral-700">12,480 revenue teams exploring PRSPCT</span>
          </div>

          <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-[#2B6EF6]">PRSPCT</p>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-black sm:text-6xl sm:leading-[1.05]">
            Stay organized & efficient with AI prospecting.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-500 sm:text-lg">
            Discover, qualify, and close — one workspace for prospects, pipeline motion, follow-ups, and AI-assisted selling.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PillButton href={primaryHref}>
              Get PRSPCT For Free <ArrowRight className="h-4 w-4" />
            </PillButton>
            <PillButton href={secondaryHref} variant="ghost" className="underline-offset-4 hover:underline">
              {session ? "Go to dashboard" : "Book A Demo"}
            </PillButton>
          </div>
          <p className="mt-4 text-sm text-neutral-500">* No credit card required. Free demo workspace included.</p>
        </div>

        {/* Product showcase cards */}
        <div className="relative mx-auto grid max-w-6xl gap-5 px-5 pb-20 md:grid-cols-2">
          <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#2B6EF6] p-6 shadow-xl shadow-blue-900/10">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Total Prospects</p>
                <p className="mt-1 text-4xl font-extrabold text-white">120</p>
              </div>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">Live demo</span>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <div className="mb-3 flex items-center justify-between text-xs text-white/70">
                <span>Pipeline velocity</span>
                <span className="text-emerald-300">+18%</span>
              </div>
              <div className="flex h-24 items-end gap-1.5">
                {[40, 55, 48, 70, 62, 80, 75, 90, 85, 95, 88, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-white/30 to-white"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            <p className="mt-5 text-sm text-white/80">Prospect database for effortless data access across your whole team.</p>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-black/5 bg-[#F7F8FA] p-6 shadow-xl shadow-black/5">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500">Open Pipeline</p>
                <p className="mt-1 text-4xl font-extrabold text-black">$455,500</p>
              </div>
              <span className="rounded-full bg-[#FF8A3D]/15 px-3 py-1 text-xs font-semibold text-[#C45A12]">
                +12 deals
              </span>
            </div>
            <div className="space-y-3">
              {[
                { name: "Vertex Labs rollout", value: "$48,000", stage: "Qualified" },
                { name: "Nova growth retainer", value: "$24,000", stage: "Meeting" },
                { name: "Apex Realty suite", value: "$61,500", stage: "Proposal" },
              ].map((deal) => (
                <div
                  key={deal.name}
                  className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm"
                >
                  <div>
                    <p className="text-sm font-semibold text-black">{deal.name}</p>
                    <p className="text-xs text-neutral-500">{deal.stage}</p>
                  </div>
                  <p className="text-sm font-bold text-black">{deal.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="border-y border-black/5 bg-[#FAFAFA] py-10">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <p className="text-sm font-medium text-neutral-500">Trusted by 10,000+ founders & revenue teams.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {trusted.map((name) => (
              <span key={name} className="text-lg font-bold tracking-tight text-neutral-300">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#2B6EF6]">Prospect database</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-black sm:text-5xl sm:leading-[1.1]">
              Customer database for effortless data access.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-neutral-500 sm:text-lg">
              Bring every prospect and company into one place — complete profiles, scores, ownership, and activity — so your team stops hunting across spreadsheets.
            </p>
            <PillButton href={primaryHref} className="mt-8">
              Get PRSPCT For Free
            </PillButton>
          </div>
          <div className="rounded-[28px] border border-black/5 bg-[#F7F8FA] p-6 shadow-lg shadow-black/5">
            <div className="space-y-3">
              {[
                { name: "Aarav Sharma", title: "Founder & CEO · Vertex Labs", score: 82, tone: "hot" },
                { name: "Priya Nair", title: "CMO · Nova Systems", score: 74, tone: "warm" },
                { name: "Jordan Lee", title: "VP Sales · Apex Realty", score: 61, tone: "warm" },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                      {p.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{p.name}</p>
                      <p className="text-xs text-neutral-500">{p.title}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-bold",
                      p.tone === "hot" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700",
                    )}
                  >
                    {p.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pipeline" className="bg-[#FAFAFA] py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2">
          <div className="order-2 rounded-[28px] bg-white p-6 shadow-lg shadow-black/5 lg:order-1">
            <div className="grid grid-cols-3 gap-3">
              {["New", "Qualified", "Proposal"].map((stage, idx) => (
                <div key={stage} className="rounded-2xl bg-[#F3F4F6] p-3">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-neutral-500">{stage}</p>
                  <div className="space-y-2">
                    {[0, 1].map((n) => (
                      <div key={n} className="rounded-xl bg-white p-2.5 shadow-sm">
                        <div className="mb-2 h-2 w-16 rounded bg-neutral-200" />
                        <div className="h-2 w-10 rounded bg-[#2B6EF6]/30" />
                        <p className="mt-2 text-[11px] font-semibold text-neutral-700">
                          ${(idx + 1) * 12 + n * 5}k
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FF8A3D]">Sales pipeline</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-black sm:text-5xl sm:leading-[1.1]">
              Monitor, manage and maximize your sales pipeline.
            </h2>
            <ul className="mt-6 space-y-3 text-neutral-600">
              {[
                "Visualize every stage from New to Won",
                "Customizable pipeline management",
                "Reduce lead leakage and accelerate growth",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#2B6EF6] text-white">
                    <Check className="h-3 w-3" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <PillButton href={primaryHref} className="mt-8">
              Get PRSPCT For Free
            </PillButton>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-black sm:text-5xl">
            All your team’s workflow in a single place.
          </h2>
          <p className="mt-4 text-neutral-500">
            Prospecting, CRM, follow-ups, and AI assistance — without the clutter of five disconnected tools.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Sales automation",
              body: "Automate repetitive follow-ups, assignments, and status changes so reps stay in motion.",
              color: "bg-[#2B6EF6]",
            },
            {
              icon: Target,
              title: "Lead scoring",
              body: "Rules-based HOT / WARM / COLD scoring with transparent ICP breakdowns — not black-box claims.",
              color: "bg-[#FF8A3D]",
            },
            {
              icon: Workflow,
              title: "AI sales assistant",
              body: "Analyze prospects, draft outreach, and get next-best-actions through a secure provider layer.",
              color: "bg-emerald-500",
            },
          ].map((card) => (
            <div key={card.title} className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
              <span className={cn("mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-white", card.color)}>
                <card.icon className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-bold text-black">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">{card.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: BarChart3,
              title: "Sales pipeline management",
              body: "Visualize opportunities, forecast revenue, and move deals with drag-and-drop stages.",
            },
            {
              icon: Sparkles,
              title: "Prospect intelligence",
              body: "Company context, activity timelines, notes, and AI summaries on every profile.",
            },
            {
              icon: Lock,
              title: "Security and tenancy",
              body: "Multi-tenant architecture with RLS-ready org isolation and role-based access.",
            },
          ].map((card) => (
            <div key={card.title} className="rounded-[28px] bg-[#F7F8FA] p-6">
              <card.icon className="mb-4 h-5 w-5 text-[#2B6EF6]" />
              <h3 className="text-lg font-bold text-black">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Numbers */}
      <section className="bg-black py-20 text-white sm:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Numbers behind our influence.</h2>
            <p className="mt-4 text-neutral-400">
              Built for teams that care about contact rate, qualification, meetings booked, and closed revenue.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {[
              { value: "100k+", label: "Prospects managed", detail: "Across demo and early workspaces exploring PRSPCT." },
              { value: "34%", label: "Faster follow-ups", detail: "Teams stay ahead with overdue alerts and task views." },
              { value: "80%", label: "Cleaner CRM data", detail: "Import validation and dedupe keep records trustworthy." },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                <p className="text-5xl font-extrabold tracking-tight text-white">{stat.value}</p>
                <p className="mt-3 text-lg font-semibold">{stat.label}</p>
                <p className="mt-2 text-sm text-neutral-400">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-[#FAFAFA] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-md text-3xl font-extrabold tracking-tight text-black sm:text-5xl sm:leading-[1.1]">
              Choose the plan that fits your business.
            </h2>
            <div className="relative inline-flex items-center rounded-full bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  !annual ? "bg-black text-white" : "text-neutral-500",
                )}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  annual ? "bg-black text-white" : "text-neutral-500",
                )}
              >
                Annual
              </button>
              <span className="absolute -top-3 right-2 rounded-full bg-black px-2 py-0.5 text-[10px] font-bold text-white">
                SAVE 20%
              </span>
            </div>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => {
              const price = annual ? Math.round(plan.price * 0.8) : plan.price;
              return (
                <div
                  key={plan.name}
                  className={cn(
                    "flex flex-col rounded-[28px] p-6 shadow-sm",
                    plan.featured ? "bg-black text-white" : "border border-black/5 bg-white text-black",
                  )}
                >
                  <h3 className="text-xl font-bold">{plan.name} Plan</h3>
                  <p className={cn("mt-2 text-sm", plan.featured ? "text-neutral-400" : "text-neutral-500")}>
                    {plan.description}
                  </p>
                  <p className="mt-6 flex items-end gap-1">
                    <span className="text-5xl font-extrabold tracking-tight">${price}</span>
                    <span className={cn("mb-1 text-sm", plan.featured ? "text-neutral-400" : "text-neutral-500")}>
                      /month
                    </span>
                  </p>
                  <PillButton
                    href={session ? "/app/billing" : "/signup"}
                    variant={plan.featured ? "white" : "black"}
                    className="mt-6 w-full"
                  >
                    Buy Now
                  </PillButton>
                  <p className={cn("mt-6 text-xs font-semibold uppercase tracking-wide", plan.featured ? "text-neutral-400" : "text-neutral-500")}>
                    Included features
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <span className="mt-0.5 font-bold text-[#2B6EF6]">#</span>
                        <span className={plan.featured ? "text-neutral-300" : "text-neutral-600"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-black sm:text-5xl">
            Got questions? We&apos;ve got answers.
          </h2>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-3">
          {faqs.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="px-5 pb-20">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-[#2B6EF6] px-6 py-16 text-center text-white sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.45), transparent 45%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.35), transparent 40%)",
            }}
          />
          <div className="relative">
            <span className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <h2 className="mx-auto max-w-xl text-3xl font-extrabold tracking-tight sm:text-5xl sm:leading-[1.1]">
              The modern system to run your revenue team.
            </h2>
            <PillButton href={primaryHref} variant="black" className="mt-8">
              Request A Demo
            </PillButton>
            <p className="mt-4 text-sm text-white/80">No credit card needed. Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-white py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:flex-row sm:justify-between">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-neutral-500">
              Prospecting intelligence for modern sales teams. Discover → Qualify → Engage → Close.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-sm font-bold text-black">Product</p>
              <div className="mt-3 space-y-2 text-sm text-neutral-500">
                <a href="#features" className="block hover:text-black">Features</a>
                <a href="#pricing" className="block hover:text-black">Pricing</a>
                <Link href="/signup" className="block hover:text-black">Sign up</Link>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-black">Company</p>
              <div className="mt-3 space-y-2 text-sm text-neutral-500">
                <a href="#faq" className="block hover:text-black">FAQ</a>
                <Link href="/login" className="block hover:text-black">Log in</Link>
                <Link href="/app/dashboard" className="block hover:text-black">Open app</Link>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-black">Legal</p>
              <div className="mt-3 space-y-2 text-sm text-neutral-500">
                <span className="block">Privacy Policy</span>
                <span className="block">Terms</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl px-5 text-sm text-neutral-400">
          © {new Date().getFullYear()} PRSPCT. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
