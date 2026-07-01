"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      return;
    }
    setEnviado(true);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-4">
      <h1 className="text-2xl font-semibold">Club deportivo</h1>
      {enviado ? (
        <p>Revisa tu email, te hemos enviado un enlace de acceso.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border px-3 py-2"
          />
          <button
            type="submit"
            className="rounded bg-black px-3 py-2 text-white"
          >
            Enviar enlace de acceso
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      )}
    </main>
  );
}
