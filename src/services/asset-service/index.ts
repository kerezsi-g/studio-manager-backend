import { S3Client } from "bun";
import { AssetType } from "schemas";
import * as Queries from "./queries";

import path from "node:path";
import { mkdir, exists } from "node:fs/promises";

import config from "config";

const s3Client = new S3Client(config.s3);

export namespace AssetService {
  interface CreateAssetArgs {
    assetName: string;
    assetType: AssetType;
  }

  interface FileSelector {
    assetId: string;
    fileClass: string;
  }

  export function createAsset({ assetName, assetType }: CreateAssetArgs) {
    const result = Queries.CreateAsset({ assetName, assetType });

    if (!result) {
      throw new Error("Failed to create asset");
    }

    return result;
  }

  export function updateAsset() {}

  export function deleteAsset() {}

  export function createUploadUrl(args: Queries.CreateFileEntryArgs) {
    const fileEntry = createFileEntry(args);

    const s3file = getS3File(fileEntry);

    const publicUrl = s3file.presign({
      expiresIn: 3600,
      method: "PUT",
    });

    return publicUrl;
  }

  /**
   * Returns a presigned publicly accessible URL for the file if it exists
   */
  export async function getPublicAccessUrl(userId: string, { assetId, fileClass }: FileSelector) {
    const fileEntry = Queries.GetFileEntry({ userId, assetId, fileClass });

    if (!fileEntry) {
      throw new Error("File not found");
    }

    const s3file = await getS3FileStrict(fileEntry);

    const publicUrl = s3file.presign({
      expiresIn: 3600,
      method: "GET",
    });

    return publicUrl;
  }

  /**
   * Returns a read stream for the file if it exists
   */
  export async function getReadStream(userId: string, { assetId, fileClass }: FileSelector) {
    const fileEntry = Queries.GetFileEntry({ userId, assetId, fileClass });

    if (!fileEntry) {
      throw new Error("File not found");
    }

    const s3file = await getS3FileStrict(fileEntry);

    return s3file.stream();
  }

  function createFileEntry(args: Queries.CreateFileEntryArgs) {
    const result = Queries.CreateFileEntry(args);

    if (!result) {
      throw new Error("Failed to create file entry");
    }

    return result;
  }

  function getS3File({ assetId, fileClass }: FileSelector) {
    return s3Client.file(`${assetId}-${fileClass}`);
  }

  /**
   * Acquires a handle for the specified file if it exists
   */
  async function getS3FileStrict(file: FileSelector) {
    const s3file = getS3File(file);

    const exists = await s3file.exists();

    if (!exists) {
      throw new Error("File not found");
    }

    return s3file;
  }

  async function createTemporaryLocalFile(file: FileSelector) {
    const s3file = await getS3FileStrict(file);

    const tempDirExists = await exists("temp");
    if (!tempDirExists) await mkdir("temp");

    const tempFile = Bun.file(path.resolve("temp", `${file.assetId}`));

    const sink = tempFile.writer();
    const readStream = s3file.stream();
    const reader = readStream.getReader();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        await sink.end();
        break;
      }

      await sink.write(value);
    }

    return tempFile;
  }
}
