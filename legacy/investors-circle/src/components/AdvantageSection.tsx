import { motion } from "framer-motion";
import { Shield, TrendingUp } from "lucide-react";

export function AdvantageSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl" />

          <div className="grid md:grid-cols-2 gap-10 items-center relative">
            <div>
              <div className="inline-flex items-center gap-2 text-gold-400 mb-4">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wider">The Advantage</span>
              </div>
              <h3 className="font-serif text-3xl md:text-4xl mb-6 leading-tight">
                Our members bypass the retail market entirely, accessing projects at their true absolute floor price.
              </h3>
              <p className="text-white/60 leading-relaxed">
                We acquire positions before the market even knows they exist — securing
                institutional pricing for individual investors through collective capital
                deployment and developer relationships.
              </p>
            </div>

            <div className="relative">
              <div className="glass-panel rounded-2xl p-6 border border-gold-400/20">
                <div className="flex items-end gap-4 h-48">
                  {[
                    { label: "Retail", height: 35, color: "bg-white/20" },
                    { label: "Circle", height: 85, color: "bg-gradient-to-t from-gold-500 to-gold-300" },
                  ].map((bar) => (
                    <div key={bar.label} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${bar.height}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className={`w-full rounded-t-lg ${bar.color}`}
                      />
                      <span className="text-xs text-white/50">{bar.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-gold-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>3.2× better entry pricing vs retail</span>
                </div>
              </div>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center font-serif text-2xl md:text-3xl italic gold-gradient-text mt-12"
          >
            We acquire positions.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
