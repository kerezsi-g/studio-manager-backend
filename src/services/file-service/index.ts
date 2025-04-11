import { S3Client } from "bun";
import { CreateFileEntry } from "queries/CreateFileEntry";
import { GetFileEntry } from "queries/GetFileEntry";
import { StorageType } from "types/enums";

const localStore = new S3Client({
  endpoint: "http://localhost:9000",
  bucket: "studio-storage",
  accessKeyId: "yARck0qHa0jpE3TtLBnq",
  secretAccessKey: "BjhKoeGXfJDeAYuN7MQfmiChhP09UEl4oPOYwVWU",
});

export namespace FileService {
  export interface FileDescriptor {
    
	storageType: StorageType;
    fileName: string;
	
  }

  function validateAccess(userId: string, fileId: string) {
    /**
     * TODO: implement
     */
  }

  function getStorageClient(type: string) {
    if (type === StorageType.Local) {
      return localStore;
    }

    if (type === StorageType.Cloud) {
      throw new Error("Cloud storage not yet implemented");
    }

    throw new Error("Unknown storage type");
  }

  function genHash(buf: ArrayBuffer) {
    const hasher = new Bun.CryptoHasher("sha256");

    hasher.update(buf);

    const hash = hasher.digest("hex");

    return hash;
  }

  export async function getDownloadUrl(userId: string, fileId: string) {
    validateAccess(userId, fileId);

    const file = GetFileEntry({ fileId });

    if (!file) {
      throw new Error("File not found");
    }

    const s3Client = getStorageClient(file.storageType);

    const s3file = s3Client.file(file.fileId);

    const publicUrl = s3file.presign({
      expiresIn: 3600,
      method: "GET",
    });

    return publicUrl;
  }

  export async function getUploadUrl(hash: string, descriptor: FileDescriptor) {
    CreateFileEntry({
      fileId: hash,
      fileName: descriptor.fileName,
      storageType: descriptor.storageType,
    });

    const s3Client = getStorageClient(descriptor.storageType);
    const s3file = s3Client.file(hash);

    const publicUrl = s3file.presign({
      expiresIn: 3600,
      method: "PUT",
    });

    return publicUrl;
  }

  export async function uploadMedia(buf: ArrayBuffer, descriptor: FileDescriptor) {
    const mediaId = genHash(buf);
    const s3Client = getStorageClient(descriptor.storageType);
    const s3file = s3Client.file(mediaId);

    const exists = await s3file.exists();

    if (exists) {
      return { mediaId, exists };
    } else {
      await s3file.write(buf);
    }

    return { mediaId, exists };
  }
}
