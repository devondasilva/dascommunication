import "server-only";
import { Secret, TOTP } from "otpauth";
import QRCode from "qrcode";
import { SITE } from "./constantes";

/**
 * Double authentification par code temporaire (TOTP, RFC 6238),
 * compatible Google Authenticator, Microsoft Authenticator, 1Password…
 */

function totp(secret: string, email: string) {
  return new TOTP({
    issuer: SITE.nom,
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secret),
  });
}

export function nouveauSecret2fa() {
  return new Secret({ size: 20 }).base32;
}

export async function qrCode2fa(secret: string, email: string) {
  return QRCode.toDataURL(totp(secret, email).toString(), { margin: 1, width: 220 });
}

/** Accepte le code courant et celui de la période précédente/suivante (décalage d'horloge). */
export function verifierCode2fa(secret: string, code: string) {
  if (!/^\d{6}$/.test(code)) return false;
  return totp(secret, "").validate({ token: code, window: 1 }) !== null;
}
