"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Field, SelectField } from "@/components/field";

export function InvitarForm() {
  const router = useRouter();
  const [values, setValues] = useState({
    nombre: "",
    apellido: "",
    email: "",
    categoria: "",
    dorsal: "",
    rol: "socio",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/usuarios/invitar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setLoading(false);
    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Error al invitar");
      return;
    }
    router.push("/admin/usuarios");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
      <Field
        label="Email"
        type="email"
        required
        placeholder="socio@email.com"
        value={values.email}
        onChange={(e) => setValues({ ...values, email: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Categoría"
          placeholder="Senior, Juvenil…"
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
        onChange={(e) => setValues({ ...values, rol: e.target.value })}
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
        Enviar invitación
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </button>
    </form>
  );
}
