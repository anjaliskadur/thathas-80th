import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[100svh] flex-col md:flex-row">
      <AdminSidebar />
      <div className="min-w-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}
