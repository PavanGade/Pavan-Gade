import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/navbar/Navbar";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Investors Circle — a curated investment ecosystem built around research, diligence and long-term capital allocation.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="section-pad pt-32">
        <div className="container-page max-w-3xl">
          <p className="eyebrow mb-5">About</p>
          <h1 className="heading-lg">A framework for serious capital.</h1>
          <p className="body-lg mt-6">
            Investors Circle exists to connect ambitious investors with carefully
            evaluated opportunities — across real estate, private businesses and
            emerging markets — through research, diligence and independent
            thinking.
          </p>
          <p className="mt-4 text-text-secondary">
            We do not invent returns, testimonials or partnerships. Trust is
            earned through process, clarity and discipline.
          </p>
          <div className="mt-8">
            <Button href="/#contact" showArrow>
              Join Investors Circle
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
