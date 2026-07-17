"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#details", label: "Details" },
  { href: "/photos", label: "Photos" },
  { href: "/rsvp", label: "RSVP" },
  { href: "/memory-wall", label: "Memory Wall" },
] as const;

function isActive(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  return pathname === href;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleBrandClick(event: React.MouseEvent<HTMLAnchorElement>) {
    setOpen(false);
    if (pathname !== "/") return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/55 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <header className="sticky top-0 z-40 border-b border-[var(--color-gold-dim)]/40 bg-[var(--color-ink)]/92 backdrop-blur-md">
        <div className="flex w-full items-center justify-between gap-3 px-4 py-3 sm:px-8 sm:py-4 lg:px-10">
          <Link
            href="/"
            onClick={handleBrandClick}
            className="shrink-0 font-[family-name:var(--font-display)] text-sm tracking-[0.16em] text-[var(--color-gold-soft)] uppercase sm:tracking-[0.2em]"
          >
            {siteConfig.honoreeShortName}&apos;s 80th
          </Link>

          <nav
            className="hidden items-center gap-x-6 text-sm text-[var(--color-stone)] md:flex"
            aria-label="Primary"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-[var(--color-gold-soft)]",
                  isActive(pathname, link.href) && "text-[var(--color-gold-soft)]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-ivory)] hover:bg-white/5 md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" strokeWidth={1.75} /> : <Menu className="h-6 w-6" strokeWidth={1.75} />}
          </button>
        </div>

        <div
          id={menuId}
          className={cn("border-t border-[var(--color-gold-dim)]/40 md:hidden", !open && "hidden")}
        >
          <nav className="flex flex-col px-2 py-2" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-3.5 text-base text-[var(--color-ivory)] hover:bg-white/5 hover:text-[var(--color-gold-soft)]",
                  isActive(pathname, link.href) && "text-[var(--color-gold-soft)]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
