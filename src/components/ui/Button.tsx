"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  useRef,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  showArrow?: boolean;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const variants: Record<Variant, string> = {
  primary:
    "bg-white text-black hover:bg-zinc-100 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
  secondary:
    "bg-transparent text-white border border-white/15 hover:border-white/30 hover:bg-white/[0.04]",
  ghost: "bg-transparent text-zinc-400 hover:text-white",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[0.9375rem] md:h-[3.25rem] md:px-7",
};

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className,
    showArrow = false,
  } = props;
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  const classes = cn(
    "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-medium tracking-tight transition-[transform,background-color,border-color,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
    variants[variant],
    sizes[size],
    className,
  );

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate3d(${x * 0.12}px, ${y * 0.18}px, 0) scale(1.02)`;
  };

  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translate3d(0,0,0) scale(1)";
  };

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {showArrow ? (
        <ArrowRight
          className="relative z-10 size-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden
        />
      ) : null}
    </>
  );

  if ("href" in props && props.href) {
    return (
      <motion.div whileTap={reduce ? undefined : { scale: 0.98 }}>
        <Link
          ref={ref as React.RefObject<HTMLAnchorElement>}
          href={props.href}
          className={classes}
          onClick={props.onClick}
          target={props.target}
          rel={props.rel}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  const { type = "button", ...rest } = props as ButtonAsButton;
  return (
    <motion.div whileTap={reduce ? undefined : { scale: 0.98 }}>
      <button
        ref={ref as React.RefObject<HTMLButtonElement>}
        type={type}
        className={classes}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        {...rest}
      >
        {content}
      </button>
    </motion.div>
  );
}
