import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getEditableSettings } from "@/lib/get-site-config";
import { AdminDetailsForm } from "@/components/admin/admin-details-form";

export const metadata: Metadata = {
  title: "Event details — Host",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDetailsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  const settings = await getEditableSettings();

  return (
    <main>
      <AdminDetailsForm initialSettings={settings} />
    </main>
  );
}
