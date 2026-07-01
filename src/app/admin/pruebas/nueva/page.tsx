import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { PruebaForm } from "../prueba-form";

export default async function NuevaPruebaPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/pruebas");
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Nueva prueba</h1>
      <PruebaForm />
    </main>
  );
}
