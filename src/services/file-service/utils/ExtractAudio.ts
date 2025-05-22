import config from "config";

const LIB_PATH = config.libs.ffmpeg;

export async function extractAudio(file: Bun.BunFile): Promise<Bun.BunFile> {
  if (!file.name) {
    throw new Error("Input file name is missing.");
  }

  const outputFileName = file.name + ".wav";

  const commands = ["-i", file.name, "-vn", outputFileName];

  //   console.log("Running ffmpeg with commands:", commands);

  const ffmpegProcess = Bun.spawn([LIB_PATH, ...commands], {});

  await ffmpegProcess.exited;

  return Bun.file(outputFileName);
}
