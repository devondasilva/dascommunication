import type { Metadata } from "next";
import { createHash } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { connection } from "next/server";
import { Logo } from "@/components/site/logo";
import { db } from "@/db";
import { invitations } from "@/db/schema";
import { FormulaireInvitation } from "./formulaire-invitation";

export const metadata: Metadata = {
  title: "Rejoindre l'équipe",
  robots: { index: false, follow: false },
};

export default async function PageInvitation({ params }: PageProps<"/invitation/[jeton]">) {
  await connection();
  const { jeton } = await params;
  const inv = await db.query.invitations.findFirst({
    where: and(
      eq(invitations.jetonHash, createHash("sha256").update(jeton).digest("hex")),
      isNull(invitations.acceptee),
      gt(invitations.expireLe, new Date()),
    ),
    with: { role: true },
  });

  return (
    <div className="grid min-h-dvh place-items-center bg-fond px-4 py-12">
      <div className="w-full max-w-md">
        <Logo />
        <div className="mt-8 rounded-3xl bg-white p-8 ring-1 ring-bordure">
          {inv ? (
            <>
              <h1 className="text-3xl font-semibold text-encre">Bienvenue dans l&apos;équipe</h1>
              <p className="mt-2 text-encre-douce">
                Vous rejoignez DAS COM en tant que <strong className="text-encre">{inv.role.nom}</strong>. Choisissez
                votre mot de passe pour activer votre compte <strong className="text-encre">{inv.email}</strong>.
              </p>
              <div className="mt-8">
                <FormulaireInvitation jeton={jeton} />
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-encre">Lien expiré ou déjà utilisé</h1>
              <p className="mt-2 text-encre-douce">
                Les invitations sont valables 7 jours et ne servent qu&apos;une fois. Demandez un nouveau lien à
                l&apos;administrateur de DAS COM.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
