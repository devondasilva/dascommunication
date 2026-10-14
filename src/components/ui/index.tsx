import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import {
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleSlash,
  CircleX,
  Clock,
  type LucideIcon,
} from "lucide-react";
import type { Ton } from "@/lib/constantes";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */
/*  Boutons                                                             */
/* ------------------------------------------------------------------ */

type Variante = "primaire" | "secondaire" | "fantome" | "danger";
type Taille = "sm" | "md" | "lg";

const VARIANTES: Record<Variante, string> = {
  primaire: "bg-encre text-white hover:bg-nuit",
  secondaire: "bg-white text-encre ring-1 ring-inset ring-bordure hover:bg-fond",
  fantome: "text-encre-douce hover:bg-fond hover:text-encre",
  danger: "bg-white text-red-700 ring-1 ring-inset ring-red-200 hover:bg-red-50",
};

const TAILLES: Record<Taille, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

export function classesBouton(variante: Variante = "primaire", taille: Taille = "md", extra?: string) {
  return cx(
    "inline-flex items-center justify-center rounded-xl font-medium whitespace-nowrap transition-colors",
    "disabled:pointer-events-none disabled:opacity-50",
    VARIANTES[variante],
    TAILLES[taille],
    extra,
  );
}

export function Bouton({
  variante,
  taille,
  className,
  ...props
}: ComponentProps<"button"> & { variante?: Variante; taille?: Taille }) {
  return <button className={classesBouton(variante, taille, className)} {...props} />;
}

export function LienBouton({
  variante,
  taille,
  className,
  ...props
}: ComponentProps<typeof Link> & { variante?: Variante; taille?: Taille }) {
  return <Link className={classesBouton(variante, taille, className)} {...props} />;
}

/* ------------------------------------------------------------------ */
/*  Badges de statut : icône + libellé, jamais la couleur seule          */
/* ------------------------------------------------------------------ */

const TONS: Record<Ton, { classes: string; icone: LucideIcon }> = {
  info: { classes: "bg-sky-50 text-sky-800 ring-sky-200", icone: CircleDot },
  progres: { classes: "bg-indigo-50 text-indigo-800 ring-indigo-200", icone: CircleDashed },
  attention: { classes: "bg-amber-50 text-amber-900 ring-amber-200", icone: Clock },
  succes: { classes: "bg-emerald-50 text-emerald-800 ring-emerald-200", icone: CircleCheck },
  neutre: { classes: "bg-stone-100 text-stone-700 ring-stone-200", icone: CircleSlash },
  danger: { classes: "bg-red-50 text-red-800 ring-red-200", icone: CircleX },
};

export function Badge({ ton, children, sansIcone }: { ton: Ton; children: ReactNode; sansIcone?: boolean }) {
  const { classes, icone: Icone } = TONS[ton];
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
        classes,
      )}
    >
      {!sansIcone && <Icone aria-hidden className="size-3.5" strokeWidth={2.25} />}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Conteneurs                                                          */
/* ------------------------------------------------------------------ */

export function Carte({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("rounded-xl bg-white ring-1 ring-bordure", className)} {...props} />;
}

export function Alerte({
  ton = "info",
  children,
  className,
}: {
  ton?: "info" | "succes" | "erreur";
  children: ReactNode;
  className?: string;
}) {
  const styles = {
    info: { c: "bg-sky-50 text-sky-900 ring-sky-200", I: CircleAlert },
    succes: { c: "bg-emerald-50 text-emerald-900 ring-emerald-200", I: CircleCheck },
    erreur: { c: "bg-red-50 text-red-900 ring-red-200", I: CircleAlert },
  }[ton];
  const I = styles.I;
  return (
    <div
      role={ton === "erreur" ? "alert" : "status"}
      className={cx("flex items-start gap-2.5 rounded-lg px-3.5 py-3 text-sm ring-1 ring-inset", styles.c, className)}
    >
      <I aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Champs de formulaire                                                */
/* ------------------------------------------------------------------ */

const CLASSES_SAISIE =
  "block w-full rounded-lg bg-white px-3 py-2 text-sm text-encre ring-1 ring-inset ring-bordure placeholder:text-encre-muette/70 " +
  "focus:outline-none focus:ring-2 focus:ring-marque-fonce aria-[invalid=true]:ring-red-400";

type BaseChamp = {
  label: string;
  name: string;
  erreur?: string[];
  aide?: string;
  requis?: boolean;
};

function Enveloppe({
  label,
  name,
  erreur,
  aide,
  requis,
  children,
}: BaseChamp & { children: ReactNode }) {
  // `name` sert ici d'identifiant HTML (déjà rendu unique par l'appelant si besoin)
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-encre">
        {label}
        {requis && (
          <span className="text-red-600" aria-hidden>
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {erreur?.[0] ? (
        <p id={`${name}-erreur`} className="text-sm text-red-700">
          {erreur[0]}
        </p>
      ) : aide ? (
        <p id={`${name}-aide`} className="text-xs text-encre-muette">
          {aide}
        </p>
      ) : null}
    </div>
  );
}

const ariaChamp = (id: string, name: string, erreur?: string[], aide?: string) => ({
  id,
  name,
  "aria-invalid": erreur?.length ? true : undefined,
  "aria-describedby": erreur?.length ? `${id}-erreur` : aide ? `${id}-aide` : undefined,
});

export function Champ({
  label,
  name,
  erreur,
  aide,
  requis,
  className,
  id,
  ...props
}: BaseChamp & Omit<ComponentProps<"input">, "name">) {
  return (
    <Enveloppe {...{ label, name: id ?? name, erreur, aide, requis }}>
      <input
        {...ariaChamp(id ?? name, name, erreur, aide)}
        required={requis}
        className={cx(CLASSES_SAISIE, "h-10", className)}
        {...props}
      />
    </Enveloppe>
  );
}

export function ZoneTexte({
  label,
  name,
  erreur,
  aide,
  requis,
  className,
  id,
  ...props
}: BaseChamp & Omit<ComponentProps<"textarea">, "name">) {
  return (
    <Enveloppe {...{ label, name: id ?? name, erreur, aide, requis }}>
      <textarea
        {...ariaChamp(id ?? name, name, erreur, aide)}
        required={requis}
        className={cx(CLASSES_SAISIE, "min-h-28 resize-y leading-relaxed", className)}
        {...props}
      />
    </Enveloppe>
  );
}

export function Selection({
  label,
  name,
  erreur,
  aide,
  requis,
  className,
  children,
  id,
  ...props
}: BaseChamp & Omit<ComponentProps<"select">, "name">) {
  return (
    <Enveloppe {...{ label, name: id ?? name, erreur, aide, requis }}>
      <select
        {...ariaChamp(id ?? name, name, erreur, aide)}
        required={requis}
        className={cx(CLASSES_SAISIE, "h-10 pr-8", className)}
        {...props}
      >
        {children}
      </select>
    </Enveloppe>
  );
}

/** Champ invisible pour piéger les robots de spam. */
export function PotDeMiel() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Ne pas remplir
        <input type="text" name="site_web" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  État vide                                                           */
/* ------------------------------------------------------------------ */

export function EtatVide({ titre, texte, action }: { titre: string; texte?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <p className="font-medium text-encre">{titre}</p>
      {texte && <p className="mt-1 max-w-sm text-sm text-encre-muette">{texte}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
