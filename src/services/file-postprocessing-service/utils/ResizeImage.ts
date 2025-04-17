import { spawn } from "bun";

import config from "config";

const {
  thumbnailGeneration: { maxHeight, maxWidth, quality },
} = config;

export async function resizeImage(file: Bun.BunFile): Promise<Bun.BunFile> {
  if (!file.name) {
    throw new Error("Input file name is missing.");
  }

  const outputFileName = `${file.name}_resized.jpg`;

  const convertArgs = [
    file.name,
    "-resize",
    `${maxWidth}x${maxHeight}`,
    "-quality",
    quality.toString(),
    outputFileName,
  ];

  // console.log(`Executing ImageMagick: convert ${convertArgs.join(" ")}`);

  const convertProcess = spawn({
    cmd: ["convert", ...convertArgs],
  });

  await convertProcess.exited;

  return Bun.file(outputFileName);
}
