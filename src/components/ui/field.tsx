import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const controlStyles =
  "w-full rounded-md border border-[var(--color-gold-dim)] bg-[var(--color-ink-raised)] px-4 py-3.5 text-base text-[var(--color-ivory)] placeholder:text-[var(--color-stone)] outline-none transition-colors focus:border-[var(--color-gold)] disabled:opacity-50";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(controlStyles, className)} {...props} />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(controlStyles, "resize-none", className)} {...props} />
));
Textarea.displayName = "Textarea";

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select ref={ref} className={cn(controlStyles, "appearance-none", className)} {...props} />
));
Select.displayName = "Select";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  required,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-[var(--color-gold-soft)]">
        {label}
        {required && <span className="text-[var(--color-maroon)] ml-1">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-[var(--color-stone)]">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
