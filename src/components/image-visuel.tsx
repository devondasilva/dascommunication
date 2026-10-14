import Image, { type ImageProps } from "next/image";
import { estTeleversee } from "@/lib/images";

/** next/image adapté aux visuels du portfolio (d'origine ou envoyés depuis le dashboard). */
export function ImageVisuel({ src, alt, ...props }: Omit<ImageProps, "src"> & { src: string }) {
  return <Image src={src} alt={alt} unoptimized={estTeleversee(src)} {...props} />;
}
