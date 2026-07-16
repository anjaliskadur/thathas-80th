import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * The memory wall has no accounts. Instead, whoever creates a memory gets a
 * one-time random token back in the API response. The browser stores it
 * (see src/lib/memory-tokens.ts) and must present it again to edit/delete
 * that entry. Only the sha-256 hash is ever persisted in the database, so a
 * database leak can't be used to forge edit access.
 */
export function generateEditToken() {
  return randomBytes(24).toString("base64url");
}

export function hashEditToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function verifyEditToken(token: string, hash: string) {
  const candidate = Buffer.from(hashEditToken(token), "hex");
  const actual = Buffer.from(hash, "hex");
  if (candidate.length !== actual.length) return false;
  return timingSafeEqual(candidate, actual);
}
