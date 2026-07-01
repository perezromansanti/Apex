import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { InscripcionButton } from "../inscripcion-button";

export default async function PruebaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const supabase = await createClient();

  const [{ data: prueba }, { data: inscripcion }] = await Promise.all([
    supabase.from("pruebas").select("*").eq("id", id).single(),
    supabase
      .from("inscripciones")
      .select("id")
      .eq("user_id", user.id)
      .eq("prueba_id", id)
      .maybeSingle(),
  ]);

  if (!prueba) notFound();

  const plazoVencido = new Date(prueba.fecha_limite_inscripcion) < new Date();

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/pruebas" className="text-sm text-zinc-500 underline">
        ← Pruebas
      </Link>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{prueba.nombre}</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {new Date(prueba.fecha).toLocaleDateString("es-ES")} · inscripción
            hasta{" "}
            {new Date(prueba.fecha_limite_inscripcion).toLocaleString("es-ES")}
          </p>
        </div>
        <InscripcionButton
          pruebaId={prueba.id}
          inscrito={!!inscripcion}
          plazoVencido={plazoVencido}
        />
      </div>
      {prueba.descripcion && (
        <p className="mt-6 whitespace-pre-wrap text-zinc-700">
          {prueba.descripcion}
        </p>
      )}
    </main>
  );
}
