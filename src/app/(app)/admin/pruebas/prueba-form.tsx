"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PruebaFormValues = {
  id?: string;
  nombre: string;
  fecha: string;
  descripcion: string;
  fecha_limite_inscripcion: string;
};

export function PruebaForm({
  initial,
}: {
  initial?: Partial<PruebaFormValues>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<PruebaFormValues>({
    nombre: initial?.nombre ?? "",
    fecha: initial?.fecha ?? "",
    descripcion: initial?.descripcion ?? "",
    fecha_limite_inscripcion: initial?.fecha_limite_inscripcion ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = initial?.id
      ? `/api/admin/pruebas/${initial.id}`
      : "/api/admin/pruebas";
    const method = initial?.id ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setLoading(false);
    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Error al guardar");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
        Fecha de la prueba
        <input
          type="date"
          required
          value={values.fecha}
          onChange={(e) => setValues({ ...values, fecha: e.target.value })}
          className="rounded border px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Fecha límite de inscripción
        <input
          type="datetime-local"
          required
          value={values.fecha_limite_inscripcion}
          onChange={(e) =>
            setValues({
              ...values,
              fecha_limite_inscripcion: e.target.value,
            })
          }
          className="rounded border px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Descripción
        <textarea
          value={values.descripcion}
          onChange={(e) =>
            setValues({ ...values, descripcion: e.target.value })
          }
          className="rounded border px-3 py-2"
        />
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
  );
}
