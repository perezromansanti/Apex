"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full px-4 py-3 text-left text-xs uppercase tracking-[0.15em] text-red-600 transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
    >
      Cerrar sesión
    </button>
  );
}
