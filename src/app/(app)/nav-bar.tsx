"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./logout-button";

type Usuario = {
  nombre: string;
  apellido: string;
  rol: "admin" | "socio";
};

export function NavBar({ user }: { user: Usuario }) {
  const pathname = usePathname();

  const links = [{ href: "/pruebas", label: "Pruebas" }];
  if (user.rol === "admin") {
    links.push({ href: "/admin", label: "Admin" });
  }

  return (
    <header className="border-b">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold">
            Apex
          </Link>
          <ul className="flex items-center gap-4 text-sm">
            {links.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={active ? "font-medium" : "text-zinc-600"}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <details className="relative">
          <summary className="cursor-pointer list-none rounded border px-3 py-1.5 text-sm">
            {user.nombre} <span className="text-zinc-500">({user.rol})</span>
          </summary>
          <div className="absolute right-0 z-10 mt-2 w-40 rounded border bg-white shadow-md">
            <LogoutButton />
          </div>
        </details>
      </nav>
    </header>
  );
}
