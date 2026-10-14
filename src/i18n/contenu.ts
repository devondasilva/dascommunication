/** Textes des contenus en base (services, réalisations) dans la langue voulue, avec repli sur le français. */
import type { Langue } from "@/lib/enums";

const choisir = (fr: string, en: string | null | undefined, langue: Langue) => (langue === "en" && en?.trim() ? en : fr);

export const lignes = (texte: string) =>
  texte
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

type ServiceTraduisible = {
  nom: string;
  resume: string;
  description: string;
  livrables: string;
  nomEn: string | null;
  resumeEn: string | null;
  descriptionEn: string | null;
  livrablesEn: string | null;
};

export function texteService(s: ServiceTraduisible, langue: Langue) {
  return {
    nom: choisir(s.nom, s.nomEn, langue),
    resume: choisir(s.resume, s.resumeEn, langue),
    description: choisir(s.description, s.descriptionEn, langue),
    livrables: lignes(choisir(s.livrables, s.livrablesEn, langue)),
  };
}

type RealisationTraduisible = {
  titre: string;
  titreEn: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  secteur?: string | null;
  secteurEn?: string | null;
};

export function texteRealisation(r: RealisationTraduisible, langue: Langue) {
  return {
    titre: choisir(r.titre, r.titreEn, langue),
    description: r.description ? choisir(r.description, r.descriptionEn, langue) : null,
    secteur: r.secteur ? choisir(r.secteur, r.secteurEn, langue) : null,
  };
}
