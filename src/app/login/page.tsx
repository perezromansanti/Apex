"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: false,
      },
    });
    setLoading(false);
    if (error) {
      setError(
        error.message.includes("Signups not allowed")
          ? "No encontramos esa cuenta. ¿Aún no te has registrado?"
          : error.message
      );
      return;
    }
    setEnviado(true);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="rise-in w-full max-w-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
          Club deportivo
        </p>
        <h1 className="mt-2 text-4xl font-bold">Apex</h1>
        <p className="mt-3 text-sm text-zinc-500">
          Accede con tu email para ver las próximas pruebas e inscribirte.
        </p>

        {enviado ? (
          <p className="mt-10 border-t border-line pt-6 text-sm">
            Revisa tu bandeja de entrada — te hemos enviado un enlace de
            acceso.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col gap-6 border-t border-line pt-6"
          >
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.15em] text-zinc-400">
                Email
              </span>
              <input
                type="email"
                required
                autoFocus
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-0 border-b border-line bg-transparent py-2 text-base outline-none transition-colors focus:border-ink"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="group flex items-center justify-between border border-ink px-4 py-3 text-sm font-medium transition-colors hover:bg-ink hover:text-paper disabled:opacity-40"
            >
              Enviar enlace de acceso
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
        )}

        <p className="mt-8 text-sm text-zinc-500">
          ¿Aún no tienes cuenta?{" "}
          <Link href="/registro" className="text-ink underline">
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
}
