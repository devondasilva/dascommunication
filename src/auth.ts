import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { utilisateurs } from "@/db/schema";
import { authConfig } from "@/auth.config";
import { journaliser } from "@/lib/audit";
import { GOOGLE_CONFIGURE, MODE_DEMO } from "@/lib/config";
import { COMPTES_DEMO } from "@/db/peupler";
import { verifierMotDePasse } from "@/lib/mot-de-passe";
import { verifierCode2fa } from "@/lib/deux-facteurs";
import { enregistrerEchec, estBloque, reinitialiserEchecs } from "@/lib/limiteur";

/** Erreurs renvoyées au formulaire (codes volontairement peu bavards). */
class IdentifiantsInvalides extends CredentialsSignin {
  code = "identifiants";
}
class CodeRequis extends CredentialsSignin {
  code = "2fa_requis";
}
class CodeInvalide extends CredentialsSignin {
  code = "2fa_invalide";
}
class TropDeTentatives extends CredentialsSignin {
  code = "bloque";
}

const parEmail = (email: string) =>
  db.query.utilisateurs.findFirst({ where: sql`lower(${utilisateurs.email}) = ${email.toLowerCase()}` });

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...(GOOGLE_CONFIGURE ? [Google({ allowDangerousEmailAccountLinking: false })] : []),
    Credentials({
      id: "equipe",
      name: "Équipe DAS COM",
      credentials: { email: {}, motDePasse: {}, code: {} },
      async authorize(champs) {
        const email = String(champs?.email ?? "").trim().toLowerCase();
        const motDePasse = String(champs?.motDePasse ?? "");
        const code = String(champs?.code ?? "").replace(/\s/g, "");
        if (!email || !motDePasse) throw new IdentifiantsInvalides();
        if (estBloque(email)) throw new TropDeTentatives();

        const u = await parEmail(email);
        const ok = await verifierMotDePasse(motDePasse, u?.motDePasse);
        if (!u || !ok || u.type !== "equipe" || !u.actif) {
          enregistrerEchec(email);
          throw new IdentifiantsInvalides();
        }
        if (u.secret2fa) {
          if (!code) throw new CodeRequis();
          if (!verifierCode2fa(u.secret2fa, code)) {
            enregistrerEchec(email);
            throw new CodeInvalide();
          }
        }
        reinitialiserEchecs(email);
        await db.update(utilisateurs).set({ derniereConnexion: new Date() }).where(eq(utilisateurs.id, u.id));
        await journaliser({ id: u.id, email: u.email }, "connexion", "équipe");
        return { id: u.id, email: u.email, name: u.nom, image: u.image };
      },
    }),
    // Mode démo uniquement : visiter l'espace client sans configurer Google
    ...(MODE_DEMO
      ? [
          Credentials({
            id: "client-demo",
            name: "Client de démonstration",
            credentials: {},
            async authorize() {
              const email = COMPTES_DEMO.client.email;
              let u = await parEmail(email);
              if (!u) {
                [u] = await db
                  .insert(utilisateurs)
                  .values({ email, nom: "Client Démo", type: "client" })
                  .returning();
              }
              return { id: u.id, email: u.email, name: u.nom };
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    ...authConfig.callbacks,

    /** Connexion Google : crée le compte client au premier passage. */
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return true;
      const email = profile?.email?.toLowerCase();
      if (!profile || !email || profile.email_verified === false) return false;

      const existant = await parEmail(email);
      if (existant) {
        if (!existant.actif) return false;
        await db
          .update(utilisateurs)
          .set({
            googleId: account.providerAccountId,
            image: existant.image ?? (profile.picture as string | undefined),
            nom: existant.nom ?? profile.name,
            derniereConnexion: new Date(),
          })
          .where(eq(utilisateurs.id, existant.id));
        await journaliser({ id: existant.id, email }, "connexion", "google");
        return true;
      }

      const [cree] = await db
        .insert(utilisateurs)
        .values({
          email,
          nom: profile.name ?? null,
          image: (profile.picture as string | undefined) ?? null,
          googleId: account.providerAccountId,
          type: "client",
          derniereConnexion: new Date(),
        })
        .returning({ id: utilisateurs.id });
      await journaliser({ id: cree.id, email }, "inscription", "client google");
      return true;
    },

    /** Le jeton porte l'identifiant interne et le type de compte. */
    async jwt({ token, user, account }) {
      if (account && (user?.email || token.email)) {
        const u = await parEmail(String(user?.email ?? token.email));
        if (u) {
          token.uid = u.id;
          token.typeCompte = u.type;
        }
      }
      return token;
    },
  },
});
