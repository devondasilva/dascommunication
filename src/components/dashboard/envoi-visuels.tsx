"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ImagePlus, LoaderCircle } from "lucide-react";
import { televerserVisuel } from "@/actions/realisations";
import { Alerte, cx } from "@/components/ui";

const TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
const COTE_MAX = 2000;

/**
 * Réduit l'image dans le navigateur avant l'envoi (2000 px max, WebP) :
 * l'envoi est rapide et reste sous la limite de taille des serveurs.
 */
async function compresser(fichier: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(fichier);
    const echelle = Math.min(1, COTE_MAX / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * echelle);
    canvas.height = Math.round(bitmap.height * echelle);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/webp", 0.86));
    if (!blob || blob.size >= fichier.size) return fichier;
    return new File([blob], fichier.name.replace(/\.\w+$/, ".webp"), { type: "image/webp" });
  } catch {
    return fichier;
  }
}

export function EnvoiVisuels({ realisationId }: { realisationId: number }) {
  const router = useRouter();
  const champ = useRef<HTMLInputElement>(null);
  const [survol, setSurvol] = useState(false);
  const [progression, setProgression] = useState<{ fait: number; total: number } | null>(null);
  const [erreurs, setErreurs] = useState<string[]>([]);
  const [succes, setSucces] = useState<string | null>(null);

  async function envoyer(liste: FileList | File[]) {
    const fichiers = Array.from(liste);
    if (fichiers.length === 0) return;
    setErreurs([]);
    setSucces(null);
    setProgression({ fait: 0, total: fichiers.length });

    const problemes: string[] = [];
    let reussis = 0;
    for (const [i, f] of fichiers.entries()) {
      if (!TYPES.includes(f.type)) {
        problemes.push(`${f.name} : format non pris en charge (JPEG, PNG, WebP, AVIF ou GIF).`);
      } else {
        const donnees = new FormData();
        donnees.set("realisationId", String(realisationId));
        donnees.set("fichier", await compresser(f));
        try {
          const r = await televerserVisuel(donnees);
          if (r.ok) reussis++;
          else problemes.push(`${f.name} : ${r.message}`);
        } catch {
          problemes.push(`${f.name} : envoi interrompu, réessayez.`);
        }
      }
      setProgression({ fait: i + 1, total: fichiers.length });
    }

    setProgression(null);
    setErreurs(problemes);
    if (reussis) setSucces(reussis > 1 ? `${reussis} visuels ajoutés.` : "Visuel ajouté.");
    if (champ.current) champ.current.value = "";
    router.refresh();
  }

  const enCours = progression !== null;

  return (
    <div className="space-y-3">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setSurvol(true);
        }}
        onDragLeave={() => setSurvol(false)}
        onDrop={(e) => {
          e.preventDefault();
          setSurvol(false);
          if (!enCours) envoyer(e.dataTransfer.files);
        }}
        className={cx(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-6 py-10 text-center transition-colors",
          survol ? "border-marque bg-marque-pale" : "border-bordure bg-fond hover:border-marque-fonce",
          enCours && "pointer-events-none opacity-70",
        )}
      >
        {enCours ? (
          <>
            <LoaderCircle aria-hidden className="size-7 animate-spin text-marque-texte" />
            <span className="font-medium text-encre" aria-live="polite">
              Envoi {progression.fait + 1 > progression.total ? progression.total : progression.fait + 1} sur{" "}
              {progression.total}…
            </span>
            <span className="h-1.5 w-48 overflow-hidden rounded-sm bg-bordure" aria-hidden>
              <span
                className="block h-full bg-marque transition-[width]"
                style={{ width: `${(progression.fait / progression.total) * 100}%` }}
              />
            </span>
          </>
        ) : (
          <>
            <ImagePlus aria-hidden className="size-7 text-marque-texte" />
            <span className="font-medium text-encre">Glissez vos visuels ici ou cliquez pour les choisir</span>
            <span className="text-sm text-encre-muette">
              JPEG, PNG, WebP. Plusieurs fichiers possibles, redimensionnés automatiquement.
            </span>
          </>
        )}
        <input
          ref={champ}
          type="file"
          accept={TYPES.join(",")}
          multiple
          className="sr-only"
          disabled={enCours}
          onChange={(e) => e.target.files && envoyer(e.target.files)}
        />
      </label>

      {succes && <Alerte ton="succes">{succes}</Alerte>}
      {erreurs.length > 0 && (
        <Alerte ton="erreur">
          <ul className="space-y-1">
            {erreurs.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </Alerte>
      )}
    </div>
  );
}
