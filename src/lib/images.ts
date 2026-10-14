/**
 * Les images envoyées depuis le dashboard sont déjà optimisées (WebP 1600 px) :
 * on les affiche telles quelles. Les images d'origine du portfolio (/realisations/…)
 * passent par l'optimiseur de Next.js.
 */
export const estTeleversee = (url: string) => url.startsWith("/fichiers/") || url.startsWith("https://");
