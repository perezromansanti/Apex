import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { prueba_id } = await request.json();
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { error } = await supabase
    .from("inscripciones")
    .insert({ user_id: authData.user.id, prueba_id });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { prueba_id } = await request.json();
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { error } = await supabase
    .from("inscripciones")
    .delete()
    .eq("user_id", authData.user.id)
    .eq("prueba_id", prueba_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
