import { S3Client } from "bun";
import * as Queries from "./queries";
import { Logger } from "logger";

import config from "config";

const logger = new Logger("FileService");

const s3Client = new S3Client(config.s3);

export namespace FileService {
  interface FileMeta {
    sha256: string;
    fileName: string;
    contentType: string;
    createdAt: number;
  }

  export function authorize(userId: string, fileId: string) {
    /**
     * TODO: implement
     */
  }

  function genHash(buf: ArrayBuffer) {
    const hasher = new Bun.CryptoHasher("sha256");

    hasher.update(buf);

    const hash = hasher.digest("hex");

    return hash;
  }

  export async function getDownloadUrl(userId: string, sha256: string, preview: boolean = false) {
    authorize(userId, sha256);

    const file = await getFileMetadata(sha256);

    const s3fileName = preview ? `previews/${sha256}` : file.sha256;

    const s3file = s3Client.file(s3fileName);

    const publicUrl = s3file.presign({
      expiresIn: 3600,
      method: "GET",
    });

    return publicUrl;
  }

  export async function getUploadUrl({ sha256, fileName, contentType, createdAt }: FileMeta) {
    const entry = Queries.CreateFileEntry({
      sha256,
      fileName,
      contentType,
      createdAt,
    });

    const s3file = s3Client.file(sha256);

    const publicUrl = s3file.presign({
      expiresIn: 3600,
      method: "PUT",
    });

    return publicUrl;
  }

  /**
   * TODO: Authorization
   */
  export async function getFileMetadata(sha256: string) {
    const entry = Queries.GetFileEntry({ sha256 });

    if (!entry) {
      throw new Error("File not found");
    }

    return entry;
  }
  export async function uploadMedia(file: Bun.BunFile, fileName: string, contentType: string) {
    await s3Client.file(fileName).write(file, {
      type: contentType,
    });
  }

  export async function getTemporaryLocalFile(sha256: string) {
    const s3file = s3Client.file(sha256);

    const file = Bun.file("temp/" + sha256);
    const sink = file.writer();

    const readStream = s3file.stream();
    const reader = readStream.getReader();

    logger.info(`Writing temp file ${sha256}...`);

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        await sink.end();
        break;
      }

      await sink.write(value);
    }

    logger.info(`Temp file ${sha256} written`);

    return file;
  }

  export async function getReadStream(sha256: string) {
    const file = s3Client.file(sha256);

    const exists = await file.exists();

    if (!exists) {
      throw new Error("File not found");
    }

    return file.stream();
  }
}
