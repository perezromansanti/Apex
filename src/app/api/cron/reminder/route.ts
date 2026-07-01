import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const enUnaSemana = new Date();
  enUnaSemana.setDate(enUnaSemana.getDate() + 7);

  const { data: pruebas, error } = await supabase
    .from("pruebas")
    .select("nombre, fecha, fecha_limite_inscripcion")
    .lte("fecha_limite_inscripcion", enUnaSemana.toISOString())
    .gte("fecha_limite_inscripcion", new Date().toISOString())
    .order("fecha_limite_inscripcion", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!pruebas || pruebas.length === 0) {
    return NextResponse.json({ ok: true, enviado: false });
  }

  const lineas = pruebas.map(
    (p) =>
      `• <b>${p.nombre}</b> (${new Date(p.fecha).toLocaleDateString(
        "es-ES"
      )}) — plazo hasta ${new Date(
        p.fecha_limite_inscripcion
      ).toLocaleDateString("es-ES")}`
  );

  await sendTelegramMessage(
    `📋 <b>Recordatorio de inscripciones</b>\n\n${lineas.join("\n")}`
  );

  return NextResponse.json({ ok: true, enviado: true, pruebas: pruebas.length });
}
