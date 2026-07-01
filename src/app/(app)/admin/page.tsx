import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: pruebas } = await supabase
    .from("pruebas")
    .select("*")
    .order("fecha", { ascending: true });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pruebas</h1>
        <Link
          href="/admin/pruebas/nueva"
          className="flex items-center gap-1.5 border border-ink px-3 py-1.5 text-xs uppercase tracking-[0.1em] transition-colors hover:bg-ink hover:text-paper"
        >
          <Plus size={14} />
          Nueva
        </Link>
      </div>

      <ul className="mt-8 divide-y divide-line border-t border-line">
        {(pruebas ?? []).map((prueba) => (
          <li key={prueba.id}>
            <Link
              href={`/admin/pruebas/${prueba.id}`}
              className="group flex items-center justify-between py-4"
            >
              <div>
                <p className="font-medium">{prueba.nombre}</p>
                <p className="text-sm text-zinc-500">
                  {new Date(prueba.fecha).toLocaleDateString("es-ES")}
                </p>
              </div>
              <ArrowRight
                size={16}
                className="text-zinc-300 transition-transform group-hover:translate-x-1 group-hover:text-ink"
              />
            </Link>
          </li>
        ))}
        {(pruebas ?? []).length === 0 && (
          <p className="py-10 text-sm text-zinc-500">
            No hay pruebas creadas.
          </p>
        )}
      </ul>
    </>
  );
}
