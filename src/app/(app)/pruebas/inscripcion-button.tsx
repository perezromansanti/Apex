"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export function InscripcionButton({
  pruebaId,
  inscrito,
  plazoVencido,
}: {
  pruebaId: string;
  inscrito: boolean;
  plazoVencido: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    await fetch("/api/inscripciones", {
      method: inscrito ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prueba_id: pruebaId }),
    });
    setLoading(false);
    router.refresh();
  }

  if (plazoVencido) {
    return (
      <span className="whitespace-nowrap text-xs uppercase tracking-[0.1em] text-zinc-400">
        {inscrito ? "Inscrito · plazo cerrado" : "Plazo cerrado"}
      </span>
    );
  }

  if (inscrito) {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        className="group flex items-center gap-1.5 whitespace-nowrap border border-ink px-3 py-1.5 text-xs uppercase tracking-[0.1em] transition-colors hover:border-red-600 hover:bg-red-600 hover:text-paper disabled:opacity-40"
      >
        <Check size={13} className="group-hover:hidden" />
        <span className="hidden group-hover:inline">Cancelar</span>
        <span className="group-hover:hidden">Inscrito</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="whitespace-nowrap border border-ink px-3 py-1.5 text-xs uppercase tracking-[0.1em] transition-colors hover:bg-ink hover:text-paper disabled:opacity-40"
    >
      Inscribirme
    </button>
  );
}
