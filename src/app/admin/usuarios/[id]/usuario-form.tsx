"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Usuario = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  categoria: string | null;
  dorsal: number | null;
  rol: "admin" | "socio";
};

export function UsuarioForm({ usuario }: { usuario: Usuario }) {
  const router = useRouter();
  const [values, setValues] = useState({
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    categoria: usuario.categoria ?? "",
    dorsal: usuario.dorsal != null ? String(usuario.dorsal) : "",
    rol: usuario.rol,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/admin/usuarios/${usuario.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: values.nombre,
        apellido: values.apellido,
        categoria: values.categoria || null,
        dorsal: values.dorsal ? Number(values.dorsal) : null,
        rol: values.rol,
      }),
    });

    setLoading(false);
    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Error al guardar");
      return;
    }
    router.push("/admin/usuarios");
    router.refresh();
  }

  async function handleDelete() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/usuarios/${usuario.id}`, {
      method: "DELETE",
    });
    setLoading(false);
    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Error al eliminar");
      return;
    }
    router.push("/admin/usuarios");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <p className="text-sm text-zinc-500">{usuario.email}</p>
        <label className="flex flex-col gap-1 text-sm">
          Nombre
          <input
            required
            value={values.nombre}
            onChange={(e) => setValues({ ...values, nombre: e.target.value })}
            className="rounded border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Apellido
          <input
            required
            value={values.apellido}
            onChange={(e) =>
              setValues({ ...values, apellido: e.target.value })
            }
            className="rounded border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Categoría
          <input
            value={values.categoria}
            onChange={(e) =>
              setValues({ ...values, categoria: e.target.value })
            }
            className="rounded border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Dorsal
          <input
            type="number"
            min={1}
            value={values.dorsal}
            onChange={(e) => setValues({ ...values, dorsal: e.target.value })}
            className="rounded border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Rol
          <select
            value={values.rol}
            onChange={(e) =>
              setValues({
                ...values,
                rol: e.target.value as "admin" | "socio",
              })
            }
            className="rounded border px-3 py-2"
          >
            <option value="socio">socio</option>
            <option value="admin">admin</option>
          </select>
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
        >
          Guardar
        </button>
      </form>

      <div className="border-t pt-4">
        {confirmando ? (
          <div className="flex items-center gap-2">
            <p className="text-sm">¿Eliminar a {usuario.nombre} definitivamente?</p>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="rounded bg-red-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
            >
              Sí, eliminar
            </button>
            <button
              onClick={() => setConfirmando(false)}
              className="rounded border px-3 py-1.5 text-sm"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmando(true)}
            className="text-sm text-red-600 underline"
          >
            Eliminar usuario
          </button>
        )}
      </div>
    </div>
  );
}
