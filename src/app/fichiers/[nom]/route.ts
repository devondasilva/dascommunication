import { lireFichierLocal } from "@/lib/stockage";

/** Sert les images envoyées depuis le dashboard quand Vercel Blob n'est pas configuré. */
export async function GET(_: Request, { params }: RouteContext<"/fichiers/[nom]">) {
  const { nom } = await params;
  const contenu = await lireFichierLocal(nom);
  if (!contenu) return new Response("Introuvable", { status: 404 });
  return new Response(new Uint8Array(contenu), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
