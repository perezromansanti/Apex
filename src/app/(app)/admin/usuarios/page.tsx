import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function UsuariosPage() {
  const supabase = await createClient();
  const { data: usuarios } = await supabase
    .from("users")
    .select("*")
    .order("apellido", { ascending: true });

  return (
    <>
      <h1 className="text-2xl font-bold">Usuarios ({usuarios?.length ?? 0})</h1>
      <ul className="mt-8 divide-y divide-line border-t border-line">
        {(usuarios ?? []).map((u) => (
          <li key={u.id}>
            <Link
              href={`/admin/usuarios/${u.id}`}
              className="group flex items-center justify-between py-4"
            >
              <div className="flex items-center gap-3">
                {u.dorsal != null && (
                  <span className="font-mono text-sm text-zinc-400">
                    #{u.dorsal}
                  </span>
                )}
                <div>
                  <p className="flex items-center gap-2 font-medium">
                    {u.nombre} {u.apellido}
                    {u.rol === "admin" && (
                      <span className="border border-ink px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em]">
                        admin
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {u.email}
                    {u.categoria && ` · ${u.categoria}`}
                  </p>
                </div>
              </div>
              <ArrowRight
                size={16}
                className="text-zinc-300 transition-transform group-hover:translate-x-1 group-hover:text-ink"
              />
            </Link>
          </li>
        ))}
        {(usuarios ?? []).length === 0 && (
          <p className="py-10 text-sm text-zinc-500">
            No hay usuarios todavía.
          </p>
        )}
      </ul>
    </>
  );
}
