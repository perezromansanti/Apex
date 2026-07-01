"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Pruebas" },
  { href: "/admin/usuarios", label: "Usuarios" },
];

export function AdminTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Secciones de administración"
      className="flex gap-8 border-b border-line"
    >
      {TABS.map((tab) => {
        const active =
          tab.href === "/admin"
            ? pathname === "/admin" || pathname.startsWith("/admin/pruebas")
            : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`border-b-2 pb-3 text-xs uppercase tracking-[0.15em] transition-colors ${
              active
                ? "border-ink text-ink"
                : "border-transparent text-zinc-400 hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
