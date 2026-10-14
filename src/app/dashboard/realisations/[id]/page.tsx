import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowLeft, ArrowUp, ExternalLink, Star, Trash2 } from "lucide-react";
import { deplacerVisuel, modifierTexteVisuel, supprimerRealisation, supprimerVisuel } from "@/actions/realisations";
import { EntetePage } from "@/components/dashboard/entete-page";
import { EnvoiVisuels } from "@/components/dashboard/envoi-visuels";
import { FormulaireRealisation } from "@/components/dashboard/formulaire-realisation";
import { ImageVisuel } from "@/components/image-visuel";
import { Alerte, Carte } from "@/components/ui";
import { BoutonConfirmation } from "@/components/ui/bouton-envoi";
import { exigerEquipe } from "@/lib/auth";
import { MODE_DEMO } from "@/lib/config";
import { LIBELLES_REALISATION } from "@/lib/constantes";
import { realisationParId } from "@/lib/donnees";
import { STOCKAGE_PERSISTANT } from "@/lib/stockage";

export const metadata = { title: "Modifier la réalisation" };

const boutonIcone =
  "grid size-8 place-items-center rounded-sm bg-white/95 text-encre shadow-sm ring-1 ring-bordure hover:bg-white disabled:opacity-40";

export default async function PageRealisationAdmin({ params, searchParams }: PageProps<"/dashboard/realisations/[id]">) {
  await exigerEquipe("realisations.gerer");
  const id = Number((await params).id);
  const { nouvelle } = await searchParams;
  if (!Number.isInteger(id)) notFound();
  const r = await realisationParId(id);
  if (!r) notFound();

  return (
    <div className="max-w-5xl">
      <Link href="/dashboard/realisations" className="inline-flex items-center gap-1.5 text-sm text-encre-muette hover:text-encre">
        <ArrowLeft aria-hidden className="size-4" /> Réalisations
      </Link>
      <div className="mt-4">
        <EntetePage
          titre={r.titre}
          description={LIBELLES_REALISATION[r.categorie]}
          actions={
            r.publie && r.visuels.length > 0 ? (
              <Link
                href={`/realisations/${r.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-marque-texte hover:underline"
              >
                Voir sur le site <ExternalLink aria-hidden className="size-3.5" />
              </Link>
            ) : undefined
          }
        />
      </div>

      {nouvelle && (
        <Alerte ton="succes" className="mb-6">
          Réalisation créée. Ajoutez maintenant ses visuels : le premier servira de couverture.
        </Alerte>
      )}

      {/* ── Visuels ─────────────────────────────────────────── */}
      <Carte className="p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold text-encre">Visuels</h2>
          <p className="text-sm text-encre-muette">
            Le premier visuel est la couverture. Utilisez les flèches pour changer l&apos;ordre.
          </p>
        </div>

        {!STOCKAGE_PERSISTANT && (
          <Alerte ton="info" className="mt-4">
            {MODE_DEMO ? "Mode démo : " : ""}les visuels envoyés sont stockés temporairement. Configurez Vercel Blob
            (variable <code className="text-xs">BLOB_READ_WRITE_TOKEN</code>) pour les conserver.
          </Alerte>
        )}

        <div className="mt-5">
          <EnvoiVisuels realisationId={r.id} />
        </div>

        {r.visuels.length > 0 && (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {r.visuels.map((v, i) => (
              <li key={v.id} className="overflow-hidden rounded-md ring-1 ring-bordure">
                <div className="relative aspect-[4/3] bg-fond">
                  <ImageVisuel
                    src={v.url}
                    alt={v.alt}
                    fill
                    sizes="(min-width: 1024px) 300px, 50vw"
                    className={r.categorie === "logos" ? "object-contain p-4" : "object-contain"}
                  />
                  {i === 0 && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 rounded-sm bg-marque px-1.5 py-0.5 text-xs font-medium text-nuit">
                      <Star aria-hidden className="size-3" /> Couverture
                    </span>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <form action={deplacerVisuel}>
                      <input type="hidden" name="id" value={v.id} />
                      <input type="hidden" name="sens" value="avant" />
                      <button type="submit" className={boutonIcone} disabled={i === 0} aria-label="Avancer d'une place">
                        <ArrowUp aria-hidden className="size-4" />
                      </button>
                    </form>
                    <form action={deplacerVisuel}>
                      <input type="hidden" name="id" value={v.id} />
                      <input type="hidden" name="sens" value="apres" />
                      <button
                        type="submit"
                        className={boutonIcone}
                        disabled={i === r.visuels.length - 1}
                        aria-label="Reculer d'une place"
                      >
                        <ArrowDown aria-hidden className="size-4" />
                      </button>
                    </form>
                  </div>
                </div>
                <div className="space-y-2 p-3">
                  <form action={modifierTexteVisuel} className="flex gap-2">
                    <input type="hidden" name="id" value={v.id} />
                    <label htmlFor={`alt-${v.id}`} className="sr-only">
                      Description du visuel
                    </label>
                    <input
                      id={`alt-${v.id}`}
                      name="alt"
                      defaultValue={v.alt}
                      placeholder="Description (accessibilité, SEO)"
                      className="h-8 min-w-0 flex-1 rounded-sm bg-white px-2 text-xs ring-1 ring-bordure ring-inset focus:ring-2 focus:ring-marque-fonce focus:outline-none"
                    />
                    <button type="submit" className="h-8 rounded-sm px-2 text-xs font-medium text-marque-texte hover:bg-fond">
                      OK
                    </button>
                  </form>
                  <div className="flex items-center justify-between gap-2">
                    {i > 0 ? (
                      <form action={deplacerVisuel}>
                        <input type="hidden" name="id" value={v.id} />
                        <input type="hidden" name="sens" value="couverture" />
                        <button type="submit" className="text-xs font-medium text-encre-douce hover:text-encre hover:underline">
                          Utiliser en couverture
                        </button>
                      </form>
                    ) : (
                      <span className="text-xs text-encre-muette">
                        {v.largeur} × {v.hauteur} px
                      </span>
                    )}
                    <form action={supprimerVisuel}>
                      <input type="hidden" name="id" value={v.id} />
                      <BoutonConfirmation
                        variante="fantome"
                        taille="sm"
                        className="h-7 px-2 text-xs text-red-700 hover:bg-red-50 hover:text-red-800"
                        message="Supprimer ce visuel ?"
                        aria-label="Supprimer ce visuel"
                      >
                        <Trash2 aria-hidden className="size-3.5" /> Supprimer
                      </BoutonConfirmation>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {r.visuels.length === 0 && (
          <p className="mt-4 text-sm text-encre-muette">
            Sans visuel, la réalisation n&apos;apparaît pas encore sur le site.
          </p>
        )}
      </Carte>

      {/* ── Informations ────────────────────────────────────── */}
      <Carte className="mt-6 p-6">
        <h2 className="mb-5 text-lg font-semibold text-encre">Informations</h2>
        <FormulaireRealisation realisation={r} />
      </Carte>

      <Carte className="mt-6 flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-encre">Supprimer cette réalisation</p>
          <p className="text-xs text-encre-muette">Ses visuels envoyés depuis le dashboard sont aussi supprimés.</p>
        </div>
        <form action={supprimerRealisation}>
          <input type="hidden" name="id" value={r.id} />
          <BoutonConfirmation variante="danger" taille="sm" message={`Supprimer définitivement « ${r.titre} » ?`}>
            <Trash2 aria-hidden className="size-4" /> Supprimer
          </BoutonConfirmation>
        </form>
      </Carte>
    </div>
  );
}
