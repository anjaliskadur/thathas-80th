import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  solid:
    "bg-[var(--color-gold)] text-[var(--color-ink)] hover:bg-[var(--color-gold-soft)]",
  outline:
    "border border-[var(--color-gold-dim)] text-[var(--color-ivory)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold-soft)]",
  ghost: "text-[var(--color-stone)] hover:text-[var(--color-gold-soft)]",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "solid", ...props }, ref) => (
    <button ref={ref} className={cn(base, variants[variant], className)} {...props} />
  )
);
Button.displayName = "Button";

type LinkButtonProps = React.ComponentProps<typeof Link> & {
  variant?: Variant;
};

export function LinkButton({ className, variant = "solid", ...props }: LinkButtonProps) {
  return <Link className={cn(base, variants[variant], className)} {...props} />;
}
