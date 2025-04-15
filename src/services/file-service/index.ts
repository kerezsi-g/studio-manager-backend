import { S3Client } from "bun";
import * as Queries from "./queries";

const s3Client = new S3Client({
  endpoint: "http://localhost:9000",
  bucket: "studio-storage",
  accessKeyId: "yARck0qHa0jpE3TtLBnq",
  secretAccessKey: "BjhKoeGXfJDeAYuN7MQfmiChhP09UEl4oPOYwVWU",
});

export namespace FileService {
  interface FileMeta {
    sha256: string;
    fileName: string;
    contentType: string;
  }

  function validateAccess(userId: string, fileId: string) {
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

  export async function getDownloadUrl(userId: string, sha256: string) {
    validateAccess(userId, sha256);

    const file = Queries.GetFileEntry({ sha256 });

    if (!file) {
      throw new Error("File not found");
    }

    const s3file = s3Client.file(file.sha256);

    const publicUrl = s3file.presign({
      expiresIn: 3600,
      method: "GET",
    });

    return publicUrl;
  }

  export async function getUploadUrl({ sha256, fileName, contentType }: FileMeta) {
    const entry = Queries.CreateFileEntry({
      sha256,
      fileName,
      contentType,
    });

    const s3file = s3Client.file(sha256);

    const publicUrl = s3file.presign({
      expiresIn: 3600,
      method: "PUT",
    });

    return publicUrl;
  }

  //   export async function uploadMedia(buf: ArrayBuffer, descriptor: FileDescriptor) {
  //     const sha256 = genHash(buf);
  //     const s3file = s3Client.file(sha256);
  //     const exists = await s3file.exists();
  //     if (exists) {
  //       return { mediaId: sha256, exists };
  //     } else {
  //       await s3file.write(buf);
  //     }
  //     return { mediaId: sha256, exists };
  //   }
}
