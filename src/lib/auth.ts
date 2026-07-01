import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;

  const { data: perfil } = await supabase
    .from("users")
    .select("id, nombre, apellido, email, rol")
    .eq("id", authData.user.id)
    .single();

  return perfil;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.rol !== "admin") {
    throw new Error("No autorizado");
  }
  return user;
}
