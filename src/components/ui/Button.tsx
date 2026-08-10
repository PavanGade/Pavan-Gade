import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

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
    "bg-text-primary text-bg-primary hover:bg-white hover:scale-[1.02] active:scale-[0.99]",
  secondary:
    "bg-transparent text-text-primary border border-border hover:border-border-strong hover:bg-white/[0.03] hover:scale-[1.02] active:scale-[0.99]",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/[0.03]",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[0.9375rem]",
};

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className,
    showArrow = false,
  } = props;

  const classes = cn(
    "group inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
    variants[variant],
    sizes[size],
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      {showArrow ? (
        <ArrowRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
          aria-hidden
        />
      ) : null}
    </>
  );

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        className={classes}
        onClick={props.onClick}
        target={props.target}
        rel={props.rel}
      >
        {content}
      </Link>
    );
  }

  const { type = "button", ...rest } = props as ButtonAsButton;
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}
