"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegistroPage() {
  const [values, setValues] = useState({
    nombre: "",
    apellido: "",
    email: "",
    categoria: "",
    dorsal: "",
  });
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          nombre: values.nombre,
          apellido: values.apellido,
          categoria: values.categoria || null,
          dorsal: values.dorsal ? Number(values.dorsal) : null,
        },
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setEnviado(true);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-4">
      <h1 className="text-2xl font-semibold">Registro</h1>
      {enviado ? (
        <p>Revisa tu email, te hemos enviado un enlace para confirmar tu cuenta.</p>
      ) : (
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
              required
              placeholder="Ej. Senior, Juvenil..."
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
              required
              min={1}
              value={values.dorsal}
              onChange={(e) => setValues({ ...values, dorsal: e.target.value })}
              className="rounded border px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Email
            <input
              type="email"
              required
              placeholder="tu@email.com"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="rounded border px-3 py-2"
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
          >
            Crear cuenta
          </button>
        </form>
      )}
      <p className="text-sm text-zinc-500">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="underline">
          Inicia sesión
        </Link>
      </p>
    </main>
  );
}
