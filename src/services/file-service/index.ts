import { BunFile, S3Client } from "bun";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

import config from "config";
import { Logger } from "logger";

import * as Queries from "./queries";
import * as Utils from "./utils";
import path from "node:path";
import { createWriteStream } from "node:fs";
import { generateUuid } from "utils/generate-uuid";
import { generateHash } from "utils/generate-hash";

const logger = new Logger("FileService");

const s3Client = new S3Client(config.s3);

export namespace FileService {
  export interface PrimaryFileMdt {
    fileId: string;
    sha256: string;
    fileName: string;
    contentType: string;
    uploadedAt: number;
  }

  export interface GeneratedFileMdt {
    fileId: string;
    suffix: string;
    contentType: string;
    uploadedAt: number;
  }

  export function authorize(userId: string, fileId: string) {
    /**
     * TODO: implement
     */
  }

  export async function handleReceiveFile(file: Readable, originalFileName: string) {
    const fileId = generateUuid();

    const fullPath = path.resolve("temp", originalFileName);

    const writeStream = createWriteStream(fullPath);

    await pipeline(file, writeStream);

    const tempFile = Bun.file(fullPath);

    const sha256 = await generateHash(tempFile);

    const existingFile = await Queries.GetFileByHash({ sha256 });

    if (existingFile) {
      await tempFile.unlink();
      return existingFile;
    }

    const generatedFiles = await generateFiles(tempFile);

    const primaryFileMdt = await writePrimaryMetadata(fileId, sha256, tempFile);

    for await (const generatedFile of generatedFiles) {
      await writeGeneratedMetadata(fileId, generatedFile.suffix, generatedFile.file);

      await uploadFile(generatedFile.file, `${fileId}-${generatedFile.suffix}`);
      await generatedFile.file.unlink();
    }

    await uploadFile(tempFile, fileId);

    await tempFile.unlink();

    return primaryFileMdt;
  }

  async function writePrimaryMetadata(fileId: string, hash: string, file: Bun.BunFile) {
    const stat = await file.stat();

    const name = path.basename(file.name!);

    return await Queries.WritePrimaryMetadata({
      fileId,
      sha256: hash,
      fileName: name,
      contentType: file.type,
      size: stat.size,
    });
  }

  async function writeGeneratedMetadata(fileId: string, suffix: string, file: Bun.BunFile) {
    const stat = await file.stat();

    return await Queries.WriteGeneratedMetadata({
      fileId,
      suffix,
      contentType: file.type,
      size: stat.size,
    });
  }

  async function uploadFile(file: Bun.BunFile, storageKey: string) {
    const s3file = s3Client.file(storageKey);

    await s3file.write(file, {
      type: file.type,
    });
  }

  function getS3File(fileId: string, suffix?: string) {
    const storageKey = suffix ? `${fileId}-${suffix}` : fileId;

    const s3file = s3Client.file(storageKey);

    const exists = s3file.exists();

    if (!exists) {
      throw new Error("File not found");
    }

    return s3file;
  }

  export function getFileById(fileId: string) {
    return Queries.GetFileById({ fileId });
  }

  export async function getDownloadUrl(fileId: string, suffix?: string) {
    const s3file = getS3File(fileId, suffix);

    const exists = await s3file.exists();

    if (!exists) {
      throw new Error("File not found");
    }

    const publicUrl = s3file.presign({
      expiresIn: 3600,
      method: "GET",
    });

    return publicUrl;
  }

  export async function getReadStream(fileId: string, suffix?: string) {
    const s3file = getS3File(fileId, suffix);

    return s3file.stream();
  }

  async function generateFiles(inputFile: BunFile): Promise<{ file: BunFile; suffix: string }[]> {
    const [type] = inputFile.type.split("/");

    if (type == "audio") {
      return [
        {
          file: await Utils.extractPeaks(inputFile),
          suffix: "peaks",
        },
      ];
    }

    if (type == "image") {
      return [
        {
          file: await Utils.resizeImage(inputFile),
          suffix: "thumbnail",
        },
      ];
    }

    if (type == "video") {
      const extractedFrame = await Utils.extractThumbnail(inputFile);
      const extractedAudio = await Utils.extractAudio(inputFile);

      const thumbnail = await Utils.resizeImage(extractedFrame);
      const peaks = await Utils.extractPeaks(extractedAudio);

      await extractedFrame.unlink();
      await extractedAudio.unlink();

      return [
        {
          file: thumbnail,
          suffix: "thumbnail",
        },
        {
          file: peaks,
          suffix: "peaks",
        },
      ];
    }

    throw new Error(`Unsupported file type "${inputFile.type}"`);
  }
}
