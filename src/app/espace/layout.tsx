import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { deconnexion } from "@/actions/auth";
import { Logo } from "@/components/site/logo";
import { LienBouton } from "@/components/ui";
import { exigerConnexion } from "@/lib/auth";
import { NavEspace } from "./nav-espace";

export const metadata: Metadata = {
  title: { default: "Mon espace", template: "%s · Mon espace DAS COM" },
  robots: { index: false, follow: false },
};

export default async function LayoutEspace({ children }: { children: React.ReactNode }) {
  const c = await exigerConnexion();
  const u = c.utilisateur;

  return (
    <div className="min-h-dvh bg-fond">
      <header className="border-b border-bordure bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Logo />
            <NavEspace />
          </div>
          <div className="flex items-center gap-3">
            {u.type === "equipe" && (
              <Link href="/dashboard" className="hidden text-sm text-encre-douce hover:text-encre sm:block">
                Dashboard
              </Link>
            )}
            <LienBouton href="/commander" taille="sm" className="hidden sm:inline-flex">
              Demander un devis
            </LienBouton>
            {u.image ? (
              <Image src={u.image} alt="" width={32} height={32} className="size-8 rounded-full" unoptimized />
            ) : (
              <span aria-hidden className="grid size-8 place-items-center rounded-full bg-encre text-xs font-semibold text-white">
                {(u.nom ?? u.email).slice(0, 1).toUpperCase()}
              </span>
            )}
            <form action={deconnexion}>
              <button
                type="submit"
                className="rounded-md p-1.5 text-encre-muette hover:bg-fond hover:text-encre"
                aria-label="Se déconnecter"
                title="Se déconnecter"
              >
                <LogOut className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}
