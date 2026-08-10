import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { VisionSection } from "./components/VisionSection";
import { AdvantageSection } from "./components/AdvantageSection";
import { InteractiveInsights } from "./components/InteractiveInsights";
import { InfographicFlow } from "./components/InfographicFlow";
import { FeaturesGrid } from "./components/FeaturesGrid";
import { WhoIsInCircle } from "./components/WhoIsInCircle";
import { StatsSection } from "./components/StatsSection";
import { ApplyForm } from "./components/ApplyForm";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <VisionSection />
        <AdvantageSection />
        <InteractiveInsights />
        <InfographicFlow />
        <FeaturesGrid />
        <WhoIsInCircle />
        <StatsSection />
        <ApplyForm />
      </main>
      <Footer />
    </div>
  );
}
