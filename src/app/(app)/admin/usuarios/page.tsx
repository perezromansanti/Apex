import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function UsuariosPage() {
  const supabase = await createClient();
  const { data: usuarios } = await supabase
    .from("users")
    .select("*")
    .order("apellido", { ascending: true });

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">
        Usuarios ({usuarios?.length ?? 0})
      </h1>
      <ul className="flex flex-col gap-2">
        {(usuarios ?? []).map((u) => (
          <li key={u.id}>
            <Link
              href={`/admin/usuarios/${u.id}`}
              className="flex items-center justify-between rounded border p-3 hover:bg-zinc-50"
            >
              <div>
                <p className="font-medium">
                  {u.dorsal != null && (
                    <span className="mr-2 font-mono text-zinc-500">
                      #{u.dorsal}
                    </span>
                  )}
                  {u.nombre} {u.apellido}
                  {u.rol === "admin" && (
                    <span className="ml-2 rounded bg-black px-1.5 py-0.5 text-xs text-white">
                      admin
                    </span>
                  )}
                </p>
                <p className="text-sm text-zinc-600">
                  {u.email}
                  {u.categoria && ` · ${u.categoria}`}
                </p>
              </div>
            </Link>
          </li>
        ))}
        {(usuarios ?? []).length === 0 && (
          <p className="text-zinc-500">No hay usuarios todavía.</p>
        )}
      </ul>
    </>
  );
}
