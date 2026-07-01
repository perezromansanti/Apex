"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Field, TextareaField } from "@/components/field";

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Field
        label="Nombre"
        required
        value={values.nombre}
        onChange={(e) => setValues({ ...values, nombre: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Fecha"
          type="date"
          required
          value={values.fecha}
          onChange={(e) => setValues({ ...values, fecha: e.target.value })}
        />
        <Field
          label="Plazo inscripción"
          type="datetime-local"
          required
          value={values.fecha_limite_inscripcion}
          onChange={(e) =>
            setValues({
              ...values,
              fecha_limite_inscripcion: e.target.value,
            })
          }
        />
      </div>
      <TextareaField
        label="Descripción"
        rows={3}
        value={values.descripcion}
        onChange={(e) =>
          setValues({ ...values, descripcion: e.target.value })
        }
      />
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
  );
}
