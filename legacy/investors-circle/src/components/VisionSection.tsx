import { motion } from "framer-motion";

export function VisionSection() {
  return (
    <section id="vision" className="py-24 md:py-32 px-6 relative">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl md:text-5xl leading-tight mb-8"
        >
          By the time a property brochure is printed,{" "}
          <span className="text-white/50">the best margins are already gone.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-lg text-white/60 leading-relaxed max-w-3xl mx-auto"
        >
          Real estate wealth isn't built on listings platforms. It's built in private
          meetings, pre-launch allocations, and closed-door negotiations. Investors
          Circle exists to bring serious capital together and unlock institutional-grade
          opportunities for individual buyers.
        </motion.p>
      </div>
    </section>
  );
}
