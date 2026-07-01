import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { InscripcionButton } from "./inscripcion-button";

export default async function PruebasPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  const [{ data: pruebas }, { data: misInscripciones }] = await Promise.all([
    supabase.from("pruebas").select("*").order("fecha", { ascending: true }),
    supabase.from("inscripciones").select("prueba_id").eq("user_id", user.id),
  ]);

  const inscritoEn = new Set(
    (misInscripciones ?? []).map((i) => i.prueba_id)
  );

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Pruebas disponibles</h1>
      <ul className="flex flex-col gap-4">
        {(pruebas ?? []).map((prueba) => {
          const plazoVencido =
            new Date(prueba.fecha_limite_inscripcion) < new Date();
          return (
            <li
              key={prueba.id}
              className="flex items-center justify-between rounded border p-4"
            >
              <div>
                <Link href={`/pruebas/${prueba.id}`} className="font-medium underline">
                  {prueba.nombre}
                </Link>
                <p className="text-sm text-zinc-600">
                  {new Date(prueba.fecha).toLocaleDateString("es-ES")} ·
                  inscripción hasta{" "}
                  {new Date(prueba.fecha_limite_inscripcion).toLocaleDateString(
                    "es-ES"
                  )}
                </p>
                {prueba.descripcion && (
                  <p className="mt-1 text-sm text-zinc-500">
                    {prueba.descripcion}
                  </p>
                )}
              </div>
              <InscripcionButton
                pruebaId={prueba.id}
                inscrito={inscritoEn.has(prueba.id)}
                plazoVencido={plazoVencido}
              />
            </li>
          );
        })}
        {(pruebas ?? []).length === 0 && (
          <p className="text-zinc-500">No hay pruebas publicadas todavía.</p>
        )}
      </ul>
    </main>
  );
}
