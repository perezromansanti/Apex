import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

function csvEscape(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const supabase = await createClient();

  const { data: prueba } = await supabase
    .from("pruebas")
    .select("nombre")
    .eq("id", id)
    .single();

  const { data: inscripciones, error } = await supabase
    .from("inscripciones")
    .select("created_at, users(nombre, apellido, email)")
    .eq("prueba_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const filas = [
    ["nombre", "apellido", "email", "fecha_inscripcion"],
    ...(inscripciones ?? []).map((i) => {
      const socio = i.users as unknown as {
        nombre: string;
        apellido: string;
        email: string;
      } | null;
      return [
        socio?.nombre ?? "",
        socio?.apellido ?? "",
        socio?.email ?? "",
        new Date(i.created_at).toISOString(),
      ];
    }),
  ];

  const csv = filas.map((fila) => fila.map(csvEscape).join(",")).join("\n");
  const nombreArchivo = `inscritos-${prueba?.nombre ?? id}.csv`.replace(
    /[^a-zA-Z0-9.\-_]/g,
    "_"
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
    },
  });
}
