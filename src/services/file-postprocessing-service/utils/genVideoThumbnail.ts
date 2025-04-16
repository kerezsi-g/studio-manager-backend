// import { spawn } from "node:child_process";

const FRAMES = 5 * 60 * 30; //5 minutes to seconds, multiplied by assumed 30fps

export async function genVideoThumbnail(file: Bun.BunFile) {
  const fullPath = file.name!;

  const thumbnailFilePath = fullPath + "_preview.jpg";

  //   const thumbnailFile = Bun.file(thumbnailFilePath);
  //   const writer = thumbnailFile.writer();

  const promise = new Promise((resolve, reject) => {
    const commands = ["-i", fullPath, "-vf", "thumbnail", "-vframes", "1", thumbnailFilePath];

    console.log("Running ffmpeg with commands:", commands);

    const ffmpegProcess = Bun.spawn(["ffmpeg", ...commands], {
      onExit: (code) => {
        resolve(thumbnailFilePath);
      },
    });

    // ffmpegProcess.stdout.

    // ffmpegProcess.stdout("data", (data) => {
    //   console.log("writing chunk", data);
    //   writer.write(data);
    // });

    // ffmpegProcess.stdout.on("close", (code) => {
    //   //   writer.end();
    //   if (code === 0) {
    //     resolve(thumbnailFilePath);
    //   } else {
    //     resolve(null);
    //   }
    // });

    // ffmpegProcess.on("error", (err) => {
    //   reject(err);
    // });
  });

  console.log("Created thumbnail" + thumbnailFilePath);

  await promise;

  return Bun.file(thumbnailFilePath);
}
