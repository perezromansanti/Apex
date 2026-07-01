import { redirect } from "next/navigation";
import { AdminTabs } from "./admin-tabs";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch {
    redirect("/pruebas");
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <AdminTabs />
      <div className="mt-10">{children}</div>
    </div>
  );
}
