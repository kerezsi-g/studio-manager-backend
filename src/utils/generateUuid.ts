import crypto from "crypto";


export function generateUuidV4() {
  return crypto.randomUUID();
}
