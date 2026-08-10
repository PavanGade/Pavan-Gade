import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface GlassButtonProps {
  children: ReactNode;
  variant?: "default" | "primary";
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}

export function GlassButton({
  children,
  variant = "default",
  href,
  onClick,
  className = "",
  type = "button",
}: GlassButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white cursor-pointer";
  const variantClass =
    variant === "primary" ? "glass-button-primary" : "glass-button";

  const classes = `${base} ${variantClass} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={classes}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}
