import { Footer } from "@/components/footer/Footer";
import { LeadForm } from "@/components/lead-form/LeadForm";
import { Navbar } from "@/components/navbar/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Request access to Investors Circle and start a confidential conversation about investment opportunities.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="pt-[var(--header-h)]">
        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
