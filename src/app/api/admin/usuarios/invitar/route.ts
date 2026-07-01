import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const { nombre, apellido, email, categoria, dorsal, rol } = body;

  const adminClient = createAdminClient();
  const { data, error } = await adminClient.auth.admin.inviteUserByEmail(
    email,
    {
      data: {
        nombre,
        apellido,
        categoria: categoria || null,
        dorsal: dorsal ? Number(dorsal) : null,
      },
      redirectTo: `${new URL(request.url).origin}/auth/callback`,
    }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (rol === "admin" && data.user) {
    const supabase = await createClient();
    await supabase.from("users").update({ rol: "admin" }).eq("id", data.user.id);
  }

  return NextResponse.json({ ok: true });
}
