import { randomUUID } from "node:crypto";

const map = new Map<string, string>();

const KEY_LIFETIME = 5 * 60 * 1000;

export function createAccessToken(path: string) {
  const key = randomUUID();

  map.set(key, path);

  setTimeout(() => {
    map.delete(key);
  }, KEY_LIFETIME);

  return key;
}

export function getFilePathByToken(accessToken: string) {
  const path = map.get(accessToken);

  return path ?? null;
}
