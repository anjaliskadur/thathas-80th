import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Host",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();

  if (authed) {
    redirect("/admin/rsvps");
  }

  return (
    <main className="mx-auto flex min-h-[100svh] max-w-lg flex-col justify-center px-6 py-16">
      <p className="text-center text-xs uppercase tracking-[0.35em] text-[var(--color-stone)]">
        Host
      </p>
      <h1 className="mt-3 text-center font-[family-name:var(--font-display)] text-3xl text-[var(--color-gold-soft)]">
        Sign in
      </h1>
      <div className="mt-10">
        <AdminLoginForm />
      </div>
      <p className="mt-8 text-center text-sm text-[var(--color-stone)]">
        <Link href="/" className="hover:text-[var(--color-gold-soft)]">
          ← Back to website
        </Link>
      </p>
    </main>
  );
}
