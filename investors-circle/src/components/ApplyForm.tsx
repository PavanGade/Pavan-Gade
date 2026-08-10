import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { GlassButton } from "./ui/GlassButton";
import {
  budgetOptions,
  locationOptions,
  objectiveOptions,
  timelineOptions,
  unitOptions,
} from "../data/content";

type FormState = "idle" | "submitting" | "success";

export function ApplyForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);

  const toggleSelection = (
    value: string,
    list: string[],
    setter: (v: string[]) => void
  ) => {
    setter(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    await new Promise((r) => setTimeout(r, 1500));
    setFormState("success");
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/20 transition-colors";

  const chipClass = (selected: boolean) =>
    `px-4 py-2 rounded-full text-sm cursor-pointer transition-all ${
      selected
        ? "bg-gold-400/20 border-gold-400/50 text-gold-300 border"
        : "glass-button text-white/60"
    }`;

  return (
    <section id="apply" className="py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {formState === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel rounded-3xl p-12 text-center"
            >
              <CheckCircle className="w-16 h-16 text-gold-400 mx-auto mb-6" />
              <h2 className="font-serif text-3xl md:text-4xl mb-4">
                Welcome to the Circle.
              </h2>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Your profile has been received. Our advisory team is reviewing your
                requirements and will reach out shortly with opportunities that match
                your mandate.
              </p>
              <div className="glass-panel rounded-2xl p-6 max-w-md mx-auto">
                <h3 className="font-serif text-lg mb-2">Fast-Track Your Access</h3>
                <p className="text-sm text-white/50 mb-4">
                  Join our private WhatsApp community for real-time deal flow.
                </p>
                <GlassButton variant="primary" href="https://chat.whatsapp.com/">
                  Join the WhatsApp Community →
                </GlassButton>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center mb-12">
                <h2 className="font-serif text-4xl md:text-6xl mb-6">
                  Request Access
                </h2>
                <p className="text-white/60 max-w-2xl mx-auto">
                  Membership is strictly curated. Submit your profile below. Our
                  advisory team will review and contact you if your investment goals
                  align with our upcoming opportunities.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="glass-panel rounded-3xl p-8 md:p-10 space-y-8"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@email.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    City / Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Hyderabad, India"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-3">
                    1. What type of investor are you?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["First-Time Investor", "Experienced Investor"].map((opt) => (
                      <label key={opt} className={chipClass(false)}>
                        <input type="radio" name="investorType" value={opt} className="sr-only" required />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-3">
                    3. What is your investment budget?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {budgetOptions.map((opt) => (
                      <label key={opt} className={chipClass(false)}>
                        <input type="radio" name="budget" value={opt} className="sr-only" required />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-3">
                    4. How many units are you planning to purchase?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {unitOptions.map((opt) => (
                      <label key={opt} className={chipClass(false)}>
                        <input type="radio" name="units" value={opt} className="sr-only" required />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-3">
                    Preferred Locations (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {locationOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          toggleSelection(opt, selectedLocations, setSelectedLocations)
                        }
                        className={chipClass(selectedLocations.includes(opt))}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-3">
                    7. Investment Objective (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {objectiveOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          toggleSelection(opt, selectedObjectives, setSelectedObjectives)
                        }
                        className={chipClass(selectedObjectives.includes(opt))}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-3">
                    8. When are you planning to invest?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {timelineOptions.map((opt) => (
                      <label key={opt} className={chipClass(false)}>
                        <input type="radio" name="timeline" value={opt} className="sr-only" required />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-white/40 text-center">
                  By requesting access, you agree to a confidential review of your profile.
                </p>

                <div className="text-center">
                  <GlassButton
                    type="submit"
                    variant="primary"
                    className="!px-10 !py-4"
                  >
                    {formState === "submitting" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </GlassButton>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
