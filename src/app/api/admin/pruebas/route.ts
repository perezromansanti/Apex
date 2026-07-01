import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pruebas")
    .insert({
      nombre: body.nombre,
      fecha: body.fecha,
      descripcion: body.descripcion ?? null,
      fecha_limite_inscripcion: body.fecha_limite_inscripcion,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ data });
}
