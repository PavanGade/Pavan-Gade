import { motion } from "framer-motion";
import { personas } from "../data/content";

export function WhoIsInCircle() {
  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-5xl mb-6">
            Who is in the Circle?
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            We curate a powerful network of serious capital allocators. If you fit
            into any of these categories, you belong in the room.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona, i) => (
            <motion.div
              key={persona.role}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-panel rounded-2xl p-8 hover:bg-white/5 transition-colors"
            >
              <div className="w-10 h-10 mb-6 border border-gold-400/20 flex items-center justify-center text-gold-400 font-serif text-sm">
                0{i + 1}
              </div>
              <h4 className="font-serif text-xl mb-3">{persona.role}</h4>
              <p className="text-sm text-white/60 leading-relaxed">
                {persona.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
