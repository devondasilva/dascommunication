"use client";

import { createContext, useContext, useMemo } from "react";
import type { Devise, Langue } from "@/lib/enums";
import { creerTr, lienLocal } from "./commun";

const Contexte = createContext<{ langue: Langue; devise: Devise }>({ langue: "fr", devise: "XOF" });

export function FournisseurI18n({ langue, devise, children }: { langue: Langue; devise: Devise; children: React.ReactNode }) {
  const valeur = useMemo(() => ({ langue, devise }), [langue, devise]);
  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}

/** Langue et devise côté navigateur, avec tr("fr", "en") et liens localisés. */
export function useI18n() {
  const { langue, devise } = useContext(Contexte);
  return useMemo(
    () => ({ langue, devise, tr: creerTr(langue), l: (chemin: string) => lienLocal(langue, chemin) }),
    [langue, devise],
  );
}
