import fs from "node:fs/promises";
import { getFilePath } from "./getFilePath";

export async function getAudioFile(fileId: string): Promise<Buffer> {
  const path = await getFilePath(fileId);

  const file = await fs.readFile(path);

  return file;
}
