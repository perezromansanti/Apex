"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Field, SelectField } from "@/components/field";

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
    <div className="flex flex-col gap-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <p className="text-sm text-zinc-500">{usuario.email}</p>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Nombre"
            required
            value={values.nombre}
            onChange={(e) => setValues({ ...values, nombre: e.target.value })}
          />
          <Field
            label="Apellido"
            required
            value={values.apellido}
            onChange={(e) =>
              setValues({ ...values, apellido: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Categoría"
            value={values.categoria}
            onChange={(e) =>
              setValues({ ...values, categoria: e.target.value })
            }
          />
          <Field
            label="Dorsal"
            type="number"
            min={1}
            value={values.dorsal}
            onChange={(e) => setValues({ ...values, dorsal: e.target.value })}
          />
        </div>
        <SelectField
          label="Rol"
          value={values.rol}
          onChange={(e) =>
            setValues({ ...values, rol: e.target.value as "admin" | "socio" })
          }
        >
          <option value="socio">socio</option>
          <option value="admin">admin</option>
        </SelectField>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="group flex items-center justify-between border border-ink px-4 py-3 text-sm font-medium transition-colors hover:bg-ink hover:text-paper disabled:opacity-40"
        >
          Guardar
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </form>

      <div className="border-t border-line pt-6">
        {confirmando ? (
          <div className="flex items-center gap-3">
            <p className="text-sm">
              ¿Eliminar a {usuario.nombre} definitivamente?
            </p>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="border border-red-600 px-3 py-1.5 text-xs uppercase tracking-[0.1em] text-red-600 transition-colors hover:bg-red-600 hover:text-paper disabled:opacity-50"
            >
              Sí, eliminar
            </button>
            <button
              onClick={() => setConfirmando(false)}
              className="border border-line px-3 py-1.5 text-xs uppercase tracking-[0.1em] text-zinc-500"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmando(true)}
            className="text-xs uppercase tracking-[0.1em] text-red-600 underline"
          >
            Eliminar usuario
          </button>
        )}
      </div>
    </div>
  );
}
