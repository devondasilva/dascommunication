import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/**
 * Stockage des images envoyées depuis le dashboard.
 * - BLOB_READ_WRITE_TOKEN défini → Vercel Blob (recommandé en production)
 * - sinon → dossier local servi par la route /fichiers/[nom]
 *   (./.fichiers en local ; /tmp sur Vercel, donc temporaire)
 *
 * Chaque image est redimensionnée (1600 px max) et convertie en WebP.
 */

const BLOB = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
export const STOCKAGE_PERSISTANT = BLOB || !process.env.VERCEL;

const DOSSIER_LOCAL = process.env.UPLOADS_DIR ?? (process.env.VERCEL ? "/tmp/dascom-fichiers" : "./.fichiers");
const PREFIXE_LOCAL = "/fichiers/";
const NOM_VALIDE = /^[a-z0-9-]+\.webp$/;

export const TYPES_ACCEPTES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
export const TAILLE_MAX_OCTETS = 8 * 1024 * 1024;

export type ImageEnregistree = { url: string; largeur: number; hauteur: number };

function nomFichier(base: string) {
  const propre = base
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `${propre || "visuel"}-${randomBytes(4).toString("hex")}.webp`;
}

export async function enregistrerImage(fichier: File, base: string): Promise<ImageEnregistree> {
  if (!TYPES_ACCEPTES.includes(fichier.type)) throw new Error("Format non pris en charge (JPEG, PNG, WebP, AVIF ou GIF).");
  if (fichier.size > TAILLE_MAX_OCTETS) throw new Error("Image trop lourde (8 Mo maximum).");

  const entree = Buffer.from(await fichier.arrayBuffer());
  const { data, info } = await sharp(entree, { animated: false })
    .rotate()
    .resize({ width: 1600, height: 2400, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer({ resolveWithObject: true });

  const nom = nomFichier(base);

  if (BLOB) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`realisations/${nom}`, data, { access: "public", contentType: "image/webp" });
    return { url: blob.url, largeur: info.width, hauteur: info.height };
  }

  await mkdir(DOSSIER_LOCAL, { recursive: true });
  await writeFile(path.join(DOSSIER_LOCAL, nom), data);
  return { url: PREFIXE_LOCAL + nom, largeur: info.width, hauteur: info.height };
}

export async function supprimerImage(url: string) {
  try {
    if (url.startsWith(PREFIXE_LOCAL)) {
      const nom = url.slice(PREFIXE_LOCAL.length);
      if (NOM_VALIDE.test(nom)) await unlink(path.join(DOSSIER_LOCAL, nom));
    } else if (BLOB && url.includes(".blob.vercel-storage.com/")) {
      const { del } = await import("@vercel/blob");
      await del(url);
    }
  } catch (e) {
    console.error("[stockage] suppression impossible", url, e);
  }
}

/** Lecture pour la route /fichiers/[nom] (stockage local uniquement). */
export async function lireFichierLocal(nom: string) {
  if (!NOM_VALIDE.test(nom)) return null;
  try {
    return await readFile(path.join(DOSSIER_LOCAL, nom));
  } catch {
    return null;
  }
}

