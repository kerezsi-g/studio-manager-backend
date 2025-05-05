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

    const thumbnailResized = await resizeImage(thumbnail);

    await thumbnail.unlink();

    return thumbnailResized;
  }
}
