"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDemoStore } from "@/stores/demo-store";

export default function VerifyEmailPage() {
  const router = useRouter();
  const session = useDemoStore((state) => state.session);

  const continueFlow = () => {
    toast.success("Email verified");
    router.push(session ? (session.onboardingComplete ? "/app/dashboard" : "/onboarding") : "/login");
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="h-7 w-7" />
        </div>
        <CardTitle className="text-3xl">Verify your email</CardTitle>
        <CardDescription>Demo verification is instant, but this mirrors the production flow.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground">
          Demo hint: use <span className="font-semibold text-foreground">admin@prspct.demo</span> /{" "}
          <span className="font-semibold text-foreground">demo1234</span> on login.
        </div>
        <Button className="w-full" onClick={continueFlow}>
          <CheckCircle2 className="h-4 w-4" />
          I verified my email
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => toast.success("Verification email resent")}
        >
          Resend email
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already verified?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
