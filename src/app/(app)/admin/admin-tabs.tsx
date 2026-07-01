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
    <nav aria-label="Secciones de administración" className="flex gap-4 border-b">
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
            className={`border-b-2 px-1 pb-2 text-sm ${
              active
                ? "border-black font-medium"
                : "border-transparent text-zinc-600"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
