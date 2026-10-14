import { pluriel } from "@/lib/format";

type Point = { cle: string; libelle: string; n: number };

/**
 * Histogramme simple (une seule série) rendu côté serveur.
 * - une teinte unique, barres fines à bouts arrondis, espacement de 2px min.
 * - infobulle au survol et au focus clavier sur chaque barre
 * - seule la dernière valeur est étiquetée en direct
 * - chaque barre est focalisable et annoncée par les lecteurs d'écran
 */
export function GraphiqueBarres({ donnees, unite = "commande" }: { donnees: Point[]; unite?: string }) {
  const max = Math.max(1, ...donnees.map((d) => d.n));
  // Graduation « ronde » pour l'axe
  const pas = max <= 4 ? 1 : max <= 10 ? 2 : Math.ceil(max / 4);
  const plafond = Math.ceil(max / pas) * pas;
  const graduations = Array.from({ length: plafond / pas + 1 }, (_, i) => i * pas);
  const derniere = donnees.length - 1;

  return (
    <figure className="overflow-x-clip">
      <div className="relative h-48">
        {/* Grille récessive */}
        {graduations.map((g) => (
          <div
            key={g}
            aria-hidden
            className="absolute inset-x-0 flex items-center gap-2"
            style={{ bottom: `${(g / plafond) * 100}%` }}
          >
            <span className="w-5 -translate-y-1/2 text-right text-[11px] tabular-nums text-encre-muette">{g}</span>
            <span className={g === 0 ? "h-px flex-1 bg-encre/25" : "h-px flex-1 bg-bordure/70"} />
          </div>
        ))}

        <div className="absolute inset-y-0 right-0 left-7 flex items-end justify-around gap-[2px]">
          {donnees.map((d, i) => (
            <div key={d.cle} className="group relative flex h-full w-full max-w-12 items-end justify-center">
              <div
                tabIndex={0}
                role="img"
                aria-label={`${d.libelle} : ${pluriel(d.n, unite)}`}
                className="w-full max-w-7 rounded-t-[4px] bg-marque-fonce outline-offset-2 transition-opacity group-hover:opacity-80"
                style={{ height: `${(d.n / plafond) * 100}%`, minHeight: d.n ? 3 : 0 }}
              />
              {i === derniere && d.n > 0 && (
                <span
                  aria-hidden
                  className="absolute text-xs font-medium tabular-nums text-encre group-hover:opacity-0"
                  style={{ bottom: `calc(${(d.n / plafond) * 100}% + 4px)` }}
                >
                  {d.n}
                </span>
              )}
              {/* Infobulle */}
              <div
                aria-hidden
                className="pointer-events-none absolute z-10 -translate-y-2 rounded-md bg-encre px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
                style={{ bottom: `${(d.n / plafond) * 100}%` }}
              >
                <span className="capitalize">{d.libelle}</span> · {pluriel(d.n, unite)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 ml-7 flex justify-around" aria-hidden>
        {donnees.map((d) => (
          <span key={d.cle} className="w-full max-w-12 text-center text-[11px] text-encre-muette capitalize">
            {d.libelle}
          </span>
        ))}
      </div>

    </figure>
  );
}
