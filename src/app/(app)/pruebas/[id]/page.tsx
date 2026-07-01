import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
    <main className="rise-in mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/pruebas"
        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-zinc-400 transition-colors hover:text-ink"
      >
        <ArrowLeft size={14} />
        Pruebas
      </Link>

      <div className="mt-6 flex items-start justify-between gap-6 border-t border-line pt-6">
        <div>
          <h1 className="text-3xl font-bold">{prueba.nombre}</h1>
          <p className="mt-2 text-sm text-zinc-500">
            {new Date(prueba.fecha).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            · inscripción hasta{" "}
            {new Date(prueba.fecha_limite_inscripcion).toLocaleString(
              "es-ES"
            )}
          </p>
        </div>
        <InscripcionButton
          pruebaId={prueba.id}
          inscrito={!!inscripcion}
          plazoVencido={plazoVencido}
        />
      </div>

      {prueba.descripcion && (
        <p className="mt-8 max-w-lg whitespace-pre-wrap text-zinc-700">
          {prueba.descripcion}
        </p>
      )}
    </main>
  );
}
