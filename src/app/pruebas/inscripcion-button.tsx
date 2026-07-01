"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      <span className="text-sm text-zinc-500">
        {inscrito ? "Inscrito (plazo cerrado)" : "Plazo cerrado"}
      </span>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded px-3 py-1.5 text-sm text-white ${
        inscrito ? "bg-red-600" : "bg-black"
      } disabled:opacity-50`}
    >
      {inscrito ? "Cancelar inscripción" : "Inscribirme"}
    </button>
  );
}
