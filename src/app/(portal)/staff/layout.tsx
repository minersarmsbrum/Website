import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { StaffSidebar } from "@/components/portal/StaffSidebar";

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session.role) redirect("/login");

  return (
    <div className="flex min-h-screen bg-ink-900">
      <StaffSidebar username={session.username} role={session.role} />
      <main className="flex-1 overflow-auto p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
