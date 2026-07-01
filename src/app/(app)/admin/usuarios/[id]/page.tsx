import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UsuarioForm } from "./usuario-form";

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: usuario } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (!usuario) notFound();

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-semibold">
        {usuario.nombre} {usuario.apellido}
      </h1>
      <UsuarioForm usuario={usuario} />
    </div>
  );
}
