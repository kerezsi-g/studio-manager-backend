export async function generateHash(file: Bun.BunFile) {
  const hasher = new Bun.CryptoHasher("sha256");

  const buffer = await file.arrayBuffer();

  hasher.update(buffer);

  const hash = hasher.digest("hex");

  return hash;
}
