import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { GlassButton } from "./ui/GlassButton";

export function Hero() {
  return (
    <section className="relative min-h-screen mesh-gradient overflow-hidden pt-28 pb-20 px-6">
      <div className="absolute inset-0 grid-pattern pointer-events-none" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/20 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gold-400/10 blur-[100px] animate-pulse-glow" style={{ animationDelay: "2s" }} />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-2 mb-8"
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="text-xs uppercase tracking-[0.2em] text-white/60">
                Invitation Only
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight mb-6"
            >
              <span className="gold-gradient-text italic">an invitation</span>
              <br />
              to institutional
              <br />
              real estate.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg md:text-xl text-white/60 max-w-lg mb-10 leading-relaxed"
            >
              Exclusive Access. Better Deals. Higher Returns.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap gap-4"
            >
              <GlassButton variant="primary" href="#apply">
                Request Access
              </GlassButton>
              <GlassButton href="#insights">
                Explore Insights
              </GlassButton>
            </motion.div>
          </div>

          {/* Hero dashboard preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="glass-panel rounded-3xl p-6 animate-float">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider">Portfolio Performance</p>
                  <p className="text-3xl font-serif text-gold-400 mt-1">+47.2%</p>
                </div>
                <div className="glass-button rounded-xl px-4 py-2 text-xs text-white/70">
                  Live
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Gachibowli Pre-Launch", value: "+22%", color: "bg-accent" },
                  { label: "Kokapet Bulk Deal", value: "+18%", color: "bg-accent-cyan" },
                  { label: "Financial District", value: "+15%", color: "bg-accent-violet" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-sm text-white/80">{item.label}</span>
                    </div>
                    <span className="text-sm font-medium text-gold-400">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-serif text-white">14</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Launches</p>
                </div>
                <div>
                  <p className="text-2xl font-serif text-white">₹12Cr</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Saved</p>
                </div>
                <div>
                  <p className="text-2xl font-serif text-white">100%</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Off-Market</p>
                </div>
              </div>
            </div>

            {/* Floating accent card */}
            <div className="absolute -bottom-6 -left-6 glass-panel rounded-2xl px-5 py-4 shadow-2xl">
              <p className="text-xs text-white/50">Member ROI</p>
              <p className="text-xl font-serif gold-gradient-text">3.2× Retail</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-col items-center mt-20 gap-3"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-white/40">Discover</span>
          <ArrowDown className="w-4 h-4 text-gold-400/60 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
