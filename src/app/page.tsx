import type { Metadata } from "next";
import { LandingPage } from "@/components/marketing/landing-page";

export const metadata: Metadata = {
  title: "PRSPCT — AI Prospecting & Sales CRM",
  description:
    "Discover, qualify, and close with PRSPCT. Prospecting intelligence, pipeline, follow-ups, and AI-assisted selling in one workspace.",
};

export default function Home() {
  return <LandingPage />;
}
