import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AdminSidebar } from "@/components/portal/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (session.role !== "admin") redirect("/login");

  return (
    <div className="flex min-h-screen bg-ink-900">
      <AdminSidebar username={session.username} />
      <main className="flex-1 overflow-auto p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
