"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, LinkButton } from "@/components/ui/button";

const links = [
  { href: "/admin/rsvps", label: "RSVPs" },
  { href: "/admin/details", label: "Event details" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-[var(--color-gold-dim)]/40 bg-[var(--color-ink-raised)] px-4 py-5 md:w-56 md:border-b-0 md:border-r md:py-8">
      <div className="flex items-center justify-between gap-4 md:block">
        <div>
          <p className="px-2 text-xs uppercase tracking-[0.35em] text-[var(--color-stone)]">Host</p>
          <p className="mt-1 px-2 font-[family-name:var(--font-display)] text-xl text-[var(--color-gold-soft)] md:mt-2">
            Admin
          </p>
        </div>
        <div className="flex gap-2 md:hidden">
          <LinkButton href="/" variant="outline" className="!rounded-md !px-3 !py-2 text-xs">
            Website
          </LinkButton>
          <Button
            type="button"
            variant="ghost"
            className="!rounded-md !px-3 !py-2 text-xs"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </div>

      <nav className="mt-5 flex flex-row gap-1 md:mt-10 md:flex-col">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-[var(--color-gold)]/15 text-[var(--color-gold-soft)]"
                  : "text-[var(--color-stone)] hover:text-[var(--color-ivory)]"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden flex-col gap-2 pt-10 md:flex">
        <LinkButton href="/" variant="outline" className="w-full !rounded-md !px-3 !py-2 text-sm">
          Back to website
        </LinkButton>
        <Button
          type="button"
          variant="ghost"
          className="w-full !rounded-md !px-3 !py-2 text-sm"
          onClick={handleLogout}
        >
          Log out
        </Button>
      </div>
    </aside>
  );
}
