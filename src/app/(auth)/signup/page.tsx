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

export default function SignupPage() {
  const router = useRouter();
  const signup = useDemoStore((state) => state.signup);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const session = signup(email, password, name || "Demo User");

    if (!session) {
      toast.error("Enter a valid email and a password of at least 6 characters.");
      return;
    }

    toast.success("Account created. Let's personalize PRSPCT.");
    router.push("/onboarding");
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Create your PRSPCT workspace</CardTitle>
        <CardDescription>Start with demo data and finish setup in under a minute.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Alex Morgan" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required />
          </div>
          <div className="rounded-lg border border-border bg-muted p-3 text-sm text-muted-foreground">
            Demo hint: existing users can log in with <span className="font-semibold text-foreground">admin@prspct.demo</span> /{" "}
            <span className="font-semibold text-foreground">demo1234</span>.
          </div>
          <Button type="submit" className="w-full">
            Create account
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
