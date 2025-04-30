import { BunFile } from "bun";

import * as Utils from "./utils";

export namespace FileGenerationService {
  export async function resizeImage(file: BunFile): Promise<BunFile> {
    const thumbnail = await Utils.resizeImage(file);

    return thumbnail;
  }

  export async function extractPeaks(file: BunFile): Promise<BunFile> {
    const peaks = await Utils.extractPeaks(file);

    return peaks;
  }

  export async function extractThumbnail(file: BunFile): Promise<BunFile> {
    const thumbnail = await Utils.extractThumbnail(file);

    return thumbnail;
  }

  export function genSha256Hash(buf: ArrayBuffer) {
    const hasher = new Bun.CryptoHasher("sha256");

    hasher.update(buf);

    const hash = hasher.digest("hex");

    return hash;
  }
}
