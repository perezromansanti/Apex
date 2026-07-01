import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { UsuarioForm } from "./usuario-form";

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    await requireAdmin();
  } catch {
    redirect("/pruebas");
  }

  const { id } = await params;
  const supabase = await createClient();
  const { data: usuario } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (!usuario) notFound();

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">
        {usuario.nombre} {usuario.apellido}
      </h1>
      <UsuarioForm usuario={usuario} />
    </main>
  );
}
