"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Field } from "@/components/field";

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
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="rise-in w-full max-w-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
          Club deportivo
        </p>
        <h1 className="mt-2 text-4xl font-bold">Alta de socio</h1>
        <p className="mt-3 text-sm text-zinc-500">
          Un solo formulario, sin contraseña — entrarás con un enlace a tu
          email cada vez.
        </p>

        {enviado ? (
          <p className="mt-10 border-t border-line pt-6 text-sm">
            Revisa tu bandeja de entrada — te hemos enviado un enlace para
            confirmar tu cuenta.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col gap-6 border-t border-line pt-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Nombre"
                required
                value={values.nombre}
                onChange={(e) =>
                  setValues({ ...values, nombre: e.target.value })
                }
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
                required
                placeholder="Senior, Juvenil…"
                value={values.categoria}
                onChange={(e) =>
                  setValues({ ...values, categoria: e.target.value })
                }
              />
              <Field
                label="Dorsal"
                type="number"
                required
                min={1}
                value={values.dorsal}
                onChange={(e) =>
                  setValues({ ...values, dorsal: e.target.value })
                }
              />
            </div>
            <Field
              label="Email"
              type="email"
              required
              placeholder="tu@email.com"
              value={values.email}
              onChange={(e) =>
                setValues({ ...values, email: e.target.value })
              }
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="group flex items-center justify-between border border-ink px-4 py-3 text-sm font-medium transition-colors hover:bg-ink hover:text-paper disabled:opacity-40"
            >
              Crear cuenta
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>
        )}

        <p className="mt-8 text-sm text-zinc-500">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-ink underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
