import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lightbulb, ShieldCheck, Users } from "lucide-react";
import { LienBouton } from "@/components/ui";
import type { Tr } from "@/i18n/commun";
import { i18n, metaLangues } from "@/i18n/serveur";
import { SITE } from "@/lib/constantes";
import photoDorcas from "../../../../public/equipe/dorcas-da-silva.webp";

export async function generateMetadata(): Promise<Metadata> {
  const { tr } = await i18n();
  return {
    title: tr("À propos", "About"),
    description: tr(
      "DAS Communication fusionne ingénierie logicielle et design stratégique pour propulser les marques. Découvrez nos valeurs et notre équipe.",
      "DAS Communication blends software engineering and strategic design to grow brands. Meet our values and our team.",
    ),
    alternates: await metaLangues("/a-propos"),
  };
}

const valeurs = (tr: Tr) => [
  {
    icone: ShieldCheck,
    titre: tr("Intégrité technique", "Technical integrity"),
    accroche: tr("Zéro dette technique", "Zero technical debt"),
    texte: tr(
      "Aucun compromis sur la sécurité, l'accessibilité et la robustesse de ce que nous livrons. Chaque ligne est pensée pour durer et évoluer sans casser.",
      "No compromise on the security, accessibility and robustness of what we deliver. Every line is written to last and to evolve without breaking.",
    ),
  },
  {
    icone: Lightbulb,
    titre: tr("Innovation utile", "Useful innovation"),
    accroche: tr("Design centré business", "Business-driven design"),
    texte: tr(
      "L'esthétique et la technique n'ont de valeur que si elles résolvent un problème concret pour votre entreprise et simplifient l'expérience de vos clients.",
      "Looks and technology only matter when they solve a real problem for your business and make life simpler for your customers.",
    ),
  },
  {
    icone: Users,
    titre: tr("Esprit de partenariat", "True partnership"),
    accroche: tr("Cocréation transparente", "Transparent co-creation"),
    texte: tr(
      "Nous ne sommes pas de simples exécutants : nous nous immergeons dans votre univers pour devenir le moteur de vos ambitions.",
      "We are more than a supplier: we immerse ourselves in your world to drive your ambitions forward.",
    ),
  },
];

const equipe = (tr: Tr) => [
  {
    nom: "Devon DA SILVA",
    role: tr("Fondateur & ingénieur full-stack", "Founder & full-stack engineer"),
    bio: tr(
      "Architecte logiciel spécialisé dans les écosystèmes modernes (React, Next.js, TypeScript). Il transforme les architectures complexes en interfaces fluides, performantes et sécurisées.",
      "Software architect specialised in modern ecosystems (React, Next.js, TypeScript). He turns complex systems into smooth, fast and secure interfaces.",
    ),
    photo: null,
  },
  {
    nom: "Dorcas DA SILVA",
    role: tr("Directrice de création & UI/UX", "Creative director & UI/UX"),
    bio: tr(
      "Spécialiste de la narration visuelle et de la psychologie des interfaces. Elle façonne des identités de marque mémorables et conçoit des parcours utilisateurs qui convertissent.",
      "Specialist in visual storytelling and interface psychology. She shapes memorable brand identities and designs user journeys that convert.",
    ),
    photo: photoDorcas,
  },
];

const initiales = (nom: string) =>
  nom
    .split(" ")
    .map((m) => m[0])
    .join("")
    .slice(0, 2);

export default async function PageAPropos() {
  const { tr, l } = await i18n();
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 md:pt-24">
        <p className="text-sm font-medium text-marque-texte">{tr("Notre manifeste", "Our manifesto")}</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight text-balance text-encre md:text-7xl">
          {tr("L'ingénierie d'abord.", "Engineering first.")}{" "}
          <span className="text-encre-muette">{tr("L'impact partout.", "Impact everywhere.")}</span>
        </h1>
        <p className="mt-8 max-w-2xl text-xl leading-relaxed text-encre-douce">
          {tr("Chez", "At")} <strong className="font-semibold text-encre">{SITE.nom}</strong>
          {tr(
            ", nous fusionnons la rigueur de l'ingénierie logicielle et la puissance du design stratégique pour propulser votre entreprise.",
            ", we combine the rigour of software engineering with the power of strategic design to move your business forward.",
          )}
        </p>
        <p className="mt-6 text-sm text-encre-muette">
          {tr(
            "Présents au Maryland, en Virginie et au Bénin, et à distance partout ailleurs.",
            "Based in Maryland, Virginia and Benin, and working remotely everywhere else.",
          )}
        </p>
      </section>

      <section className="border-y border-bordure bg-fond">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight text-encre">
            {tr("Nos principes non négociables", "Our non-negotiable principles")}
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {valeurs(tr).map(({ icone: Icone, titre, accroche, texte }) => (
              <article key={titre} className="rounded-md bg-white p-7 ring-1 ring-bordure">
                <span className="grid size-11 place-items-center rounded-xl bg-encre text-marque">
                  <Icone aria-hidden className="size-5" />
                </span>
                <p className="mt-6 text-sm font-medium text-marque-texte">{accroche}</p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-encre">{titre}</h3>
                <p className="mt-3 text-sm leading-relaxed text-encre-douce">{texte}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="text-3xl font-semibold tracking-tight text-encre md:text-4xl">
            {tr("Les esprits derrière", "The minds behind")}{" "}
            <span className="text-marque-texte">{tr("l'exécution.", "the work.")}</span>
          </h2>
          <p className="max-w-sm text-sm text-encre-muette">
            {tr(
              "Pas d'intermédiaires : vous travaillez directement avec les personnes qui conçoivent votre projet.",
              "No middlemen: you work directly with the people who design your project.",
            )}
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {equipe(tr).map((m) => (
            <article key={m.nom}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-fond ring-1 ring-bordure">
                {m.photo ? (
                  <Image
                    src={m.photo}
                    alt={`${tr("Portrait de", "Portrait of")} ${m.nom}`}
                    fill
                    sizes="(min-width: 768px) 540px, 100vw"
                    placeholder="blur"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-gradient-to-br from-marque-pale to-fond">
                    <span className="text-7xl font-semibold tracking-tight text-encre/15" aria-hidden>
                      {initiales(m.nom)}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-encre">{m.nom}</h3>
              <p className="text-sm font-medium text-marque-texte">{m.role}</p>
              <p className="mt-3 leading-relaxed text-encre-douce">{m.bio}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-lg bg-encre px-8 py-12 md:flex-row md:items-center md:px-12">
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            {tr("Travaillons ensemble.", "Let's work together.")}
          </h2>
          <div className="flex flex-wrap gap-3">
            <LienBouton href={l("/realisations")} variante="secondaire" taille="lg">
              {tr("Voir nos réalisations", "See our work")}
            </LienBouton>
            <Link
              href={l("/commander")}
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-marque px-6 font-medium text-encre transition hover:bg-white"
            >
              {tr("Démarrer un projet", "Start a project")} <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
