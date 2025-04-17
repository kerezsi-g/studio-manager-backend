export async function extractThumbnail(file: Bun.BunFile): Promise<Bun.BunFile> {
  if (!file.name) {
    throw new Error("Input file name is missing.");
  }

  const outputFileName = file.name + ".jpg";

  const commands = ["-i", file.name, "-vf", "thumbnail", "-vframes", "1", outputFileName];

  //   console.log("Running ffmpeg with commands:", commands);

  const ffmpegProcess = Bun.spawn(["ffmpeg", ...commands], {});

  await ffmpegProcess.exited;

  return Bun.file(outputFileName);
}
