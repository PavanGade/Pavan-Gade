"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDemoStore } from "@/stores/demo-store";

type DemoRole = "admin" | "manager" | "rep";

const steps = ["Profile", "Company", "ICP"];

export default function OnboardingPage() {
  const router = useRouter();
  const session = useDemoStore((state) => state.session);
  const completeOnboarding = useDemoStore((state) => state.completeOnboarding);
  const [mounted] = React.useState(true);
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState({
    name: session?.name ?? "",
    company: "PRSPCT Demo Co",
    role: "manager" as DemoRole,
    title: "Revenue Leader",
    industry: "B2B SaaS",
    teamSize: "11-50",
    salesGoal: "Build predictable outbound pipeline",
    icpName: "High-intent SaaS buyers",
    icpIndustries: "Software, Fintech, Data Infrastructure",
    regions: "North America, Europe",
    seniorities: "Director, VP, CXO",
    departments: "Sales, Marketing, Revenue Operations",
    technologies: "Salesforce, HubSpot, Snowflake",
    employeeMin: "50",
    employeeMax: "1000",
    revenueMin: "1000000",
    revenueMax: "100000000",
  });

  React.useEffect(() => {
    if (!mounted || !session?.onboardingComplete) return;
    router.replace("/app/dashboard");
  }, [mounted, router, session]);

  const update = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const next = () => setStep((current) => Math.min(current + 1, steps.length - 1));
  const back = () => setStep((current) => Math.max(current - 1, 0));

  const finish = () => {
    completeOnboarding(
      {
        name: form.icpName,
        industries: form.icpIndustries.split(",").map((item) => item.trim()).filter(Boolean),
        employeeCountMin: Number(form.employeeMin) || 1,
        employeeCountMax: Number(form.employeeMax) || 1000,
        revenueMin: Number(form.revenueMin) || 0,
        revenueMax: Number(form.revenueMax) || 100000000,
        regions: form.regions.split(",").map((item) => item.trim()).filter(Boolean),
        seniorities: form.seniorities.split(",").map((item) => item.trim()).filter(Boolean),
        departments: form.departments.split(",").map((item) => item.trim()).filter(Boolean),
        technologies: form.technologies.split(",").map((item) => item.trim()).filter(Boolean),
      },
      {
        name: form.name,
        role: form.role,
        title: form.title,
      },
    );
    toast.success("Onboarding complete");
    router.push("/app/dashboard");
  };

  if (mounted && !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Log in to continue</CardTitle>
            <CardDescription>Your onboarding progress is attached to a demo session.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => router.push("/login")}>
              Go to login
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <Badge variant="secondary" className="mb-3">PRSPCT setup</Badge>
          <h1 className="text-4xl font-black tracking-tight">Personalize your prospecting engine</h1>
          <p className="mt-3 text-muted-foreground">A few details help tailor the demo workspace, scoring model, and ICP defaults.</p>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-2">
          {steps.map((label, index) => (
            <div key={label} className="rounded-full bg-muted p-1">
              <div className={index <= step ? "h-2 rounded-full bg-primary" : "h-2 rounded-full bg-transparent"} />
              <p className="mt-2 text-center text-xs font-medium text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{steps[step]}</CardTitle>
            <CardDescription>
              {step === 0 ? "Tell us who is setting up PRSPCT." : step === 1 ? "Define your revenue workspace and sales motion." : "Describe your ideal customer profile."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={form.name} onChange={update("name")} placeholder="Alex Morgan" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Workspace role</Label>
                  <Select id="role" value={form.role} onChange={update("role")}>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="rep">Rep</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={form.title} onChange={update("title")} />
                </div>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" value={form.company} onChange={update("company")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" value={form.industry} onChange={update("industry")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team size</Label>
                  <Select id="teamSize" value={form.teamSize} onChange={update("teamSize")}>
                    <option>1-10</option>
                    <option>11-50</option>
                    <option>51-200</option>
                    <option>201+</option>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="salesGoal">Sales goal</Label>
                  <Textarea id="salesGoal" value={form.salesGoal} onChange={update("salesGoal")} />
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="icpName">ICP name</Label>
                  <Input id="icpName" value={form.icpName} onChange={update("icpName")} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="icpIndustries">ICP industries</Label>
                  <Input id="icpIndustries" value={form.icpIndustries} onChange={update("icpIndustries")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeMin">Employee min</Label>
                  <Input id="employeeMin" type="number" value={form.employeeMin} onChange={update("employeeMin")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeMax">Employee max</Label>
                  <Input id="employeeMax" type="number" value={form.employeeMax} onChange={update("employeeMax")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revenueMin">Revenue min</Label>
                  <Input id="revenueMin" type="number" value={form.revenueMin} onChange={update("revenueMin")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revenueMax">Revenue max</Label>
                  <Input id="revenueMax" type="number" value={form.revenueMax} onChange={update("revenueMax")} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="regions">Regions</Label>
                  <Input id="regions" value={form.regions} onChange={update("regions")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seniorities">Seniorities</Label>
                  <Input id="seniorities" value={form.seniorities} onChange={update("seniorities")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departments">Departments</Label>
                  <Input id="departments" value={form.departments} onChange={update("departments")} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="technologies">Technologies</Label>
                  <Input id="technologies" value={form.technologies} onChange={update("technologies")} />
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between border-t border-border pt-6">
              <Button variant="outline" onClick={back} disabled={step === 0}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              {step < steps.length - 1 ? (
                <Button onClick={next}>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={finish}>
                  Complete onboarding
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
