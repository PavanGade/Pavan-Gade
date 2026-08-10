import { type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Layers,
  Rocket,
  Star,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { features } from "../data/content";

const iconMap: Record<string, ReactNode> = {
  rocket: <Rocket className="w-6 h-6" />,
  layers: <Layers className="w-6 h-6" />,
  star: <Star className="w-6 h-6" />,
  chart: <BarChart3 className="w-6 h-6" />,
  user: <UserCheck className="w-6 h-6" />,
  trending: <TrendingUp className="w-6 h-6" />,
};

export function FeaturesGrid() {
  return (
    <section id="benefits" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-gold-400 mb-4">
            Member Benefits
          </p>
          <h2 className="font-serif text-3xl md:text-5xl mb-4">
            Institutional tools for individual investors
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Every benefit is designed to give you the same edge that large funds
            and developers have — at individual scale.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-panel rounded-2xl p-8 group hover:border-gold-400/25 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 mb-6 group-hover:scale-110 transition-transform">
                {iconMap[feature.icon]}
              </div>
              <h3 className="font-serif text-xl mb-3 group-hover:text-gold-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
