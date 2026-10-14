"use server";

import { cookies } from "next/headers";
import { COOKIE_DEVISE, estDevise } from "./commun";

/** Mémorise la devise choisie par le visiteur (un an). */
export async function choisirDevise(formData: FormData) {
  const devise = formData.get("devise");
  if (!estDevise(devise)) return;
  (await cookies()).set(COOKIE_DEVISE, devise, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
