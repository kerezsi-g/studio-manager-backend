import { spawn } from "bun";
import { BunFile } from "bun";

export async function genImageThumbnail(
  file: BunFile,
  maxWidth: number,
  maxHeight: number
): Promise<BunFile | null> {
  const fullPath = file.name;

  if (!fullPath) {
    console.error("Input file name is missing.");
    return null;
  }

  const thumbnailFilePath = `${fullPath}_thumbnail.jpg`; // Consistent naming

  try {
    await new Promise<void>(async (resolve, reject) => {
      const convertArgs = [
        fullPath,
        "-resize",
        `${maxWidth}x${maxHeight}`, // e.g., "640x480"
        "-quality",
        "85", // Adjust quality as needed
        thumbnailFilePath,
      ];

      console.log(`Executing ImageMagick: convert ${convertArgs.join(" ")}`);

      const convertProcess = spawn({
        cmd: ["convert", ...convertArgs],
        onExit: (code) => {
          resolve();
        },
      });
    });

    console.log(`Created thumbnail: ${thumbnailFilePath}`);
    return Bun.file(thumbnailFilePath);
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    return null;
  }
}
