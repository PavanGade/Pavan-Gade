import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/navbar/Navbar";
import { Opportunities } from "@/components/opportunities/Opportunities";
import { OpportunityExplorer } from "@/components/opportunity-explorer/OpportunityExplorer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Opportunities",
  description:
    "Explore curated investment opportunity categories across real estate, private businesses, startups and alternatives.",
  alternates: { canonical: "/opportunities/" },
};

export default function OpportunitiesPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="pt-[var(--header-h)]">
        <Opportunities />
        <OpportunityExplorer />
      </main>
      <Footer />
    </>
  );
}
