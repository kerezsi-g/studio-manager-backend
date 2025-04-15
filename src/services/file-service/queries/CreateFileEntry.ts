import { db } from "db";
import { StorageType } from "types/enums";

type QueryParams = {
  sha256: string;
  fileName: string;
  contentType: string;
  createdAt: number;
  storageType: StorageType;
};

type QueryResult = {
  sha256: string;
  fileName: string;
  contentType: string;
  createdAt: number;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	INSERT INTO t_files (sha256, file_name, content_type, created_at, storage_type)
	VALUES (@sha256, @fileName, @contentType, @createdAt, @storageType)
	RETURNING sha256
`);

type Args = {
  sha256: string;
  fileName: string;
  contentType: string;
};

export function CreateFileEntry({ sha256, fileName, contentType }: Args) {
  const bindParams: QueryParams = {
    sha256,
    fileName,
    contentType,
    createdAt: Date.now(),
    storageType: StorageType.Local,
  };

  sql.run(bindParams);

  return;
}
