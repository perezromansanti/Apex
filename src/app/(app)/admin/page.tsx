import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: pruebas } = await supabase
    .from("pruebas")
    .select("*")
    .order("fecha", { ascending: true });

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pruebas (admin)</h1>
        <Link
          href="/admin/pruebas/nueva"
          className="rounded bg-black px-3 py-1.5 text-sm text-white"
        >
          Nueva prueba
        </Link>
      </div>
      <ul className="flex flex-col gap-3">
        {(pruebas ?? []).map((prueba) => (
          <li key={prueba.id}>
            <Link
              href={`/admin/pruebas/${prueba.id}`}
              className="flex items-center justify-between rounded border p-4 hover:bg-zinc-50"
            >
              <div>
                <p className="font-medium">{prueba.nombre}</p>
                <p className="text-sm text-zinc-600">
                  {new Date(prueba.fecha).toLocaleDateString("es-ES")}
                </p>
              </div>
            </Link>
          </li>
        ))}
        {(pruebas ?? []).length === 0 && (
          <p className="text-zinc-500">No hay pruebas creadas.</p>
        )}
      </ul>
    </>
  );
}
