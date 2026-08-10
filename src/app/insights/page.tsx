import { Footer } from "@/components/footer/Footer";
import { InsightCard } from "@/components/insights/InsightCard";
import { Navbar } from "@/components/navbar/Navbar";
import { insights } from "@/data/opportunities";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Market perspective, investment themes and capital intelligence from Investors Circle.",
  alternates: { canonical: "/insights/" },
};

export default function InsightsPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="section-pad pt-32">
        <div className="container-page">
          <p className="eyebrow mb-5">Insights</p>
          <h1 className="heading-lg">Perspective beyond the headline.</h1>
          <p className="body-lg mt-4 mb-12">
            Placeholder editorial content until published insights are available.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
