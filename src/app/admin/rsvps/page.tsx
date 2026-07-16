import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminRsvpsPanel } from "@/components/admin/admin-rsvps-panel";

export const metadata: Metadata = {
  title: "RSVPs — Host",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminRsvpsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  return (
    <main>
      <AdminRsvpsPanel />
    </main>
  );
}
