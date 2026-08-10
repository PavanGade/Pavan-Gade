import { motion } from "framer-motion";
import { GlassButton } from "./ui/GlassButton";

const navLinks = [
  { label: "Vision", href: "#vision" },
  { label: "Insights", href: "#insights" },
  { label: "Benefits", href: "#benefits" },
  { label: "Apply", href: "#apply" },
];

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 inset-x-0 z-50 px-4 md:px-8 py-4"
    >
      <nav className="glass-panel max-w-7xl mx-auto rounded-2xl px-6 py-3 flex items-center justify-between">
        <a href="#" className="font-serif text-xl font-semibold tracking-tight">
          Investors <span className="gold-gradient-text">Circle</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <GlassButton variant="primary" href="#apply" className="!px-5 !py-2 !text-xs">
          Request Access
        </GlassButton>
      </nav>
    </motion.header>
  );
}
