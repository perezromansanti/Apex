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
    <div className="max-w-md">
      <h1 className="text-2xl font-bold">
        {usuario.nombre} {usuario.apellido}
      </h1>
      <div className="mt-8 border-t border-line pt-8">
        <UsuarioForm usuario={usuario} />
      </div>
    </div>
  );
}
