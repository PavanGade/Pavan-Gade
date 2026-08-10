"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDemoStore } from "@/stores/demo-store";

export default function LoginPage() {
  const router = useRouter();
  const login = useDemoStore((state) => state.login);
  const session = useDemoStore((state) => state.session);
  const [email, setEmail] = React.useState("admin@prspct.demo");
  const [password, setPassword] = React.useState("demo1234");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!session) return;
    router.replace(session.onboardingComplete ? "/app/dashboard" : "/onboarding");
  }, [router, session]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const ok = login(email, password);
    setLoading(false);

    if (!ok) {
      toast.error("Use a @prspct.demo email and a password of at least 6 characters.");
      return;
    }

    const nextSession = useDemoStore.getState().session;
    toast.success("Welcome back to PRSPCT");
    router.push(nextSession?.onboardingComplete ? "/app/dashboard" : "/onboarding");
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Log in to PRSPCT</CardTitle>
        <CardDescription>Use the demo account to explore the authenticated app shell.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          <div className="rounded-lg border border-border bg-muted p-3 text-sm text-muted-foreground">
            Demo hint: <span className="font-semibold text-foreground">admin@prspct.demo</span> /{" "}
            <span className="font-semibold text-foreground">demo1234</span>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to PRSPCT?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
