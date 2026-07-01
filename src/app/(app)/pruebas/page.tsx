import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
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
    <main className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
        Hola, {user.nombre}
      </p>
      <h1 className="mt-2 text-3xl font-bold">Pruebas disponibles</h1>

      <ul className="mt-10 divide-y divide-line border-t border-line">
        {(pruebas ?? []).map((prueba, i) => {
          const plazoVencido =
            new Date(prueba.fecha_limite_inscripcion) < new Date();
          return (
            <li
              key={prueba.id}
              style={{ animationDelay: `${i * 60}ms` }}
              className="rise-in flex items-start justify-between gap-6 py-6"
            >
              <div className="flex gap-4">
                <CalendarDays
                  size={18}
                  className="mt-1 shrink-0 text-zinc-400"
                />
                <div>
                  <Link
                    href={`/pruebas/${prueba.id}`}
                    className="text-lg font-semibold hover:underline"
                  >
                    {prueba.nombre}
                  </Link>
                  <p className="mt-1 text-sm text-zinc-500">
                    {new Date(prueba.fecha).toLocaleDateString("es-ES")} ·
                    inscripción hasta{" "}
                    {new Date(
                      prueba.fecha_limite_inscripcion
                    ).toLocaleDateString("es-ES")}
                  </p>
                  {prueba.descripcion && (
                    <p className="mt-2 max-w-md text-sm text-zinc-600">
                      {prueba.descripcion}
                    </p>
                  )}
                </div>
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
          <p className="py-10 text-sm text-zinc-500">
            No hay pruebas publicadas todavía.
          </p>
        )}
      </ul>
    </main>
  );
}
