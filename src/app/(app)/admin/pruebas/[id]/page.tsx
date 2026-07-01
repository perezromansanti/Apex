import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PruebaForm } from "../prueba-form";

export default async function EditarPruebaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: prueba } = await supabase
    .from("pruebas")
    .select("*")
    .eq("id", id)
    .single();

  if (!prueba) notFound();

  const { data: inscripciones } = await supabase
    .from("inscripciones")
    .select("id, created_at, users(nombre, apellido, email, categoria, dorsal)")
    .eq("prueba_id", id)
    .order("created_at", { ascending: true });

  return (
    <div>
      <div className="max-w-md">
        <h1 className="text-2xl font-bold">Editar prueba</h1>
        <div className="mt-8 border-t border-line pt-8">
          <PruebaForm
            initial={{
              id: prueba.id,
              nombre: prueba.nombre,
              fecha: prueba.fecha,
              descripcion: prueba.descripcion ?? "",
              fecha_limite_inscripcion:
                prueba.fecha_limite_inscripcion.slice(0, 16),
            }}
          />
        </div>
      </div>

      <div className="mt-16 border-t border-line pt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-[0.15em] text-zinc-400">
            Inscritos ({inscripciones?.length ?? 0})
          </h2>
          <a
            href={`/api/admin/pruebas/${id}/export`}
            className="flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] transition-colors hover:text-zinc-500"
          >
            <Download size={14} />
            CSV
          </a>
        </div>
        <ul className="mt-4 divide-y divide-line">
          {(inscripciones ?? []).map((i) => {
            const socio = i.users as unknown as {
              nombre: string;
              apellido: string;
              email: string;
              categoria: string | null;
              dorsal: number | null;
            } | null;
            return (
              <li
                key={i.id}
                className="flex items-center gap-3 py-3 text-sm"
              >
                {socio?.dorsal != null && (
                  <span className="w-8 shrink-0 font-mono text-zinc-400">
                    #{socio.dorsal}
                  </span>
                )}
                <span className="font-medium">
                  {socio?.nombre} {socio?.apellido}
                </span>
                {socio?.categoria && (
                  <span className="text-zinc-400">{socio.categoria}</span>
                )}
                <span className="ml-auto text-zinc-400">{socio?.email}</span>
              </li>
            );
          })}
          {(inscripciones ?? []).length === 0 && (
            <p className="py-6 text-sm text-zinc-500">
              Sin inscritos todavía.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
