"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
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
    <header className="border-b border-line">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5"
      >
        <div className="flex items-center gap-8">
          <Link href="/" className="font-display text-lg font-bold">
            Apex
          </Link>
          <ul className="flex items-center gap-6">
            {links.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`text-xs uppercase tracking-[0.15em] transition-colors ${
                      active ? "text-ink" : "text-zinc-400 hover:text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <details className="group relative">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 text-sm [&::-webkit-details-marker]:hidden">
            <span>{user.nombre}</span>
            <span className="text-xs uppercase tracking-[0.1em] text-zinc-400">
              {user.rol}
            </span>
            <ChevronDown
              size={14}
              className="text-zinc-400 transition-transform group-open:rotate-180"
            />
          </summary>
          <div className="absolute right-0 z-10 mt-3 w-44 border border-ink bg-paper">
            <LogoutButton />
          </div>
        </details>
      </nav>
    </header>
  );
}
