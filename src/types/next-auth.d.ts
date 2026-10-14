import type { DefaultSession } from "next-auth";
import type { TypeUtilisateur } from "@/lib/enums";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      type?: TypeUtilisateur;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    uid?: string;
    typeCompte?: TypeUtilisateur;
  }
}
