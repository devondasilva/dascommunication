import { Entete } from "@/components/site/entete";
import { PiedDePage } from "@/components/site/pied-de-page";

export default function LayoutSite({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:shadow"
      >
        Aller au contenu
      </a>
      <Entete />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <PiedDePage />
    </div>
  );
}
