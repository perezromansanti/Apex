import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PruebaForm } from "../prueba-form";

export default async function EditarPruebaPage({
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
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Editar prueba</h1>
      <PruebaForm
        initial={{
          id: prueba.id,
          nombre: prueba.nombre,
          fecha: prueba.fecha,
          descripcion: prueba.descripcion ?? "",
          fecha_limite_inscripcion: prueba.fecha_limite_inscripcion.slice(
            0,
            16
          ),
        }}
      />

      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Inscritos ({inscripciones?.length ?? 0})
          </h2>
          <a
            href={`/api/admin/pruebas/${id}/export`}
            className="rounded border px-3 py-1.5 text-sm"
          >
            Exportar CSV
          </a>
        </div>
        <ul className="flex flex-col gap-2">
          {(inscripciones ?? []).map((i) => {
            const socio = i.users as unknown as {
              nombre: string;
              apellido: string;
              email: string;
              categoria: string | null;
              dorsal: number | null;
            } | null;
            return (
              <li key={i.id} className="rounded border px-3 py-2 text-sm">
                {socio?.dorsal != null && (
                  <span className="mr-2 font-mono text-zinc-500">
                    #{socio.dorsal}
                  </span>
                )}
                {socio?.nombre} {socio?.apellido}
                {socio?.categoria && ` — ${socio.categoria}`} — {socio?.email}
              </li>
            );
          })}
          {(inscripciones ?? []).length === 0 && (
            <p className="text-sm text-zinc-500">Sin inscritos todavía.</p>
          )}
        </ul>
      </div>
    </main>
  );
}
