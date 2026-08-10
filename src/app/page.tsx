import { FinalCta } from "@/components/final-cta/FinalCta";
import { Footer } from "@/components/footer/Footer";
import { Hero } from "@/components/hero/Hero";
import { HowItWorks } from "@/components/how-it-works/HowItWorks";
import { Insights } from "@/components/insights/Insights";
import { IntelligenceLazy } from "@/components/intelligence/IntelligenceLazy";
import { InvestorJourney } from "@/components/investor-journey/InvestorJourney";
import { LeadForm } from "@/components/lead-form/LeadForm";
import { Navbar } from "@/components/navbar/Navbar";
import { Opportunities } from "@/components/opportunities/Opportunities";
import { OpportunityExplorer } from "@/components/opportunity-explorer/OpportunityExplorer";
import { Philosophy } from "@/components/philosophy/Philosophy";
import { Principles } from "@/components/principles/Principles";
import { Stats } from "@/components/stats/Stats";
import { Testimonials } from "@/components/testimonials/Testimonials";
import { Marquee } from "@/components/ui/Marquee";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <Stats />
        <Marquee />
        <Philosophy />
        <Opportunities />
        <OpportunityExplorer />
        <HowItWorks />
        <IntelligenceLazy />
        <Insights />
        <Principles />
        <Testimonials />
        <InvestorJourney />
        <LeadForm />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
