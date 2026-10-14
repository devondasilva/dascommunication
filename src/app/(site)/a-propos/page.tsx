import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lightbulb, ShieldCheck, Users } from "lucide-react";
import { LienBouton } from "@/components/ui";
import { SITE } from "@/lib/constantes";
import photoDorcas from "../../../../public/equipe/dorcas-da-silva.webp";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "DAS Communication fusionne ingénierie logicielle et design stratégique pour propulser les marques. Découvrez nos valeurs et notre équipe.",
};

const VALEURS = [
  {
    icone: ShieldCheck,
    titre: "Intégrité technique",
    accroche: "Zéro dette technique",
    texte:
      "Aucun compromis sur la sécurité, l'accessibilité et la robustesse de ce que nous livrons. Chaque ligne est pensée pour durer et évoluer sans casser.",
  },
  {
    icone: Lightbulb,
    titre: "Innovation utile",
    accroche: "Design centré business",
    texte:
      "L'esthétique et la technique n'ont de valeur que si elles résolvent un problème concret pour votre entreprise et simplifient l'expérience de vos clients.",
  },
  {
    icone: Users,
    titre: "Esprit de partenariat",
    accroche: "Cocréation transparente",
    texte:
      "Nous ne sommes pas de simples exécutants : nous nous immergeons dans votre univers pour devenir le moteur de vos ambitions.",
  },
];

const EQUIPE = [
  {
    nom: "Devon DA SILVA",
    role: "Fondateur & ingénieur full-stack",
    bio: "Architecte logiciel spécialisé dans les écosystèmes modernes (React, Next.js, TypeScript). Il transforme les architectures complexes en interfaces fluides, performantes et sécurisées.",
    photo: null,
  },
  {
    nom: "Dorcas DA SILVA",
    role: "Directrice de création & UI/UX",
    bio: "Spécialiste de la narration visuelle et de la psychologie des interfaces. Elle façonne des identités de marque mémorables et conçoit des parcours utilisateurs qui convertissent.",
    photo: photoDorcas,
  },
];

const initiales = (nom: string) =>
  nom
    .split(" ")
    .map((m) => m[0])
    .join("")
    .slice(0, 2);

export default function PageAPropos() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 md:pt-24">
        <p className="text-sm font-medium text-marque-texte">Notre manifeste</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight text-balance text-encre md:text-7xl">
          L&apos;ingénierie d&apos;abord. <span className="text-encre-muette">L&apos;impact partout.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-xl leading-relaxed text-encre-douce">
          Chez <strong className="font-semibold text-encre">{SITE.nom}</strong>, nous fusionnons la rigueur de
          l&apos;ingénierie logicielle et la puissance du design stratégique pour propulser votre entreprise.
        </p>
        <p className="mt-6 text-sm text-encre-muette">Présents au Maryland, en Virginie et au Bénin, et à distance partout ailleurs.</p>
      </section>

      <section className="border-y border-bordure bg-fond">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight text-encre">Nos principes non négociables</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {VALEURS.map(({ icone: Icone, titre, accroche, texte }) => (
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
            Les esprits derrière <span className="text-marque-texte">l&apos;exécution.</span>
          </h2>
          <p className="max-w-sm text-sm text-encre-muette">
            Pas d&apos;intermédiaires : vous travaillez directement avec les personnes qui conçoivent votre projet.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {EQUIPE.map((m) => (
            <article key={m.nom}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-fond ring-1 ring-bordure">
                {m.photo ? (
                  <Image
                    src={m.photo}
                    alt={`Portrait de ${m.nom}`}
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
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">Travaillons ensemble.</h2>
          <div className="flex flex-wrap gap-3">
            <LienBouton href="/realisations" variante="secondaire" taille="lg">
              Voir nos réalisations
            </LienBouton>
            <Link
              href="/commander"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-marque px-6 font-medium text-encre transition hover:bg-white"
            >
              Démarrer un projet <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
