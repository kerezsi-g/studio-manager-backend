import { FileService } from "services/file-service";
import { genVideoThumbnail } from "./utils/genVideoThumbnail";
import { Logger } from "logger";
import { genImageThumbnail } from "./utils/genImageThumbnail";

const logger = new Logger("PostProcessingService");

export namespace FilePostprocessingService {
  const MAX_WIDTH = 320;
  const MAX_HEIGHT = 240;

  interface PreviewFile {
    file: Bun.BunFile;
    contentType: string;
  }

  export async function process(sha256: string) {
    const fileMeta = await FileService.getFileMetadata(sha256);

    const [contentType] = fileMeta.contentType.split("/");

    const postProcess = getProcessFunction(contentType);

    logger.info(`Processing file ${sha256} (${contentType})...`);

    const tempFile = await FileService.getTemporaryLocalFile(sha256);

    const destinationPath = `previews/${sha256}`;

    const preview = await postProcess(tempFile);

    await FileService.uploadMedia(preview.file, destinationPath, preview.contentType);

    await tempFile.unlink();
    await preview.file.unlink();
  }

  function getProcessFunction(contentType: string): (file: Bun.BunFile) => Promise<PreviewFile> {
    if (contentType === "image") {
      return processImage;
    } else if (contentType === "video") {
      return processVideo;
    } else if (contentType === "audio") {
      return processAudio;
    }

    throw new Error(`Unsupported content type: ${contentType}`);
  }

  async function processImage(file: Bun.BunFile): Promise<PreviewFile> {
    logger.info("Generating image thumbnail...");

    const thumbnail = await genImageThumbnail(file, MAX_WIDTH, MAX_HEIGHT);

    if (!thumbnail) {
      throw new Error("Failed to generate thumbnail");
    }

    return { file: thumbnail, contentType: "image/jpeg" };
  }

  async function processVideo(file: Bun.BunFile): Promise<PreviewFile> {
    logger.info("Generating video thumbnail...");

    const thumbnail = await genVideoThumbnail(file);

    if (!thumbnail) {
      throw new Error("Failed to generate thumbnail");
    }

    return { file: thumbnail, contentType: "image/jpeg" };
  }

  function processAudio(file: Bun.BunFile): Promise<PreviewFile> {
    throw new Error("Audio post-processing is not yet implemented");
  }
}
