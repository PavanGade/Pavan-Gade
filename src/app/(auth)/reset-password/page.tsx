"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    toast.success("Password updated for the demo account");
    router.push("/login");
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Choose a new password</CardTitle>
        <CardDescription>This demo flow validates the form and returns you to login.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={6} required />
          </div>
          <Button type="submit" className="w-full">
            <ShieldCheck className="h-4 w-4" />
            Update password
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Need the demo credentials?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Go to login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
