import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { processSteps } from "../data/content";

export function InfographicFlow() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-gold-400 mb-4">
            How It Works
          </p>
          <h2 className="font-serif text-3xl md:text-5xl">
            From application to appreciation
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent -translate-y-1/2" />

          <div className="grid md:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="glass-panel rounded-2xl p-6 h-full text-center group hover:border-gold-400/30 transition-colors">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center font-serif text-lg text-gold-400">
                    {step.step}
                  </div>
                  <h3 className="font-serif text-xl mb-3">{step.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {step.description}
                  </p>
                  {i < processSteps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-400/40" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Visual infographic strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass-panel rounded-3xl p-8 md:p-10"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                metric: "Pre-Launch",
                value: "6–8 weeks",
                detail: "Average lead time before public announcement",
              },
              {
                metric: "Bulk Discount",
                value: "12–18%",
                detail: "Savings vs individual retail purchase",
              },
              {
                metric: "Paper Gain",
                value: "Day 1",
                detail: "Immediate appreciation upon launch pricing",
              },
            ].map((item) => (
              <div key={item.metric} className="text-center">
                <CheckCircle2 className="w-6 h-6 text-gold-400 mx-auto mb-3" />
                <p className="text-xs uppercase tracking-wider text-white/40 mb-2">
                  {item.metric}
                </p>
                <p className="font-serif text-3xl gold-gradient-text mb-2">
                  {item.value}
                </p>
                <p className="text-sm text-white/50">{item.detail}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
