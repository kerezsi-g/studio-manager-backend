import { db } from "db";
import { StorageType } from "types/enums";

type QueryParams = {
  fileId: string;
  fileName: string;
  createdAt: number;
  storageType: StorageType;
};

type QueryResult = {
  fileId: string;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	INSERT INTO t_files (file_id, file_name, created_at, storage_type)
	VALUES (@fileId, @fileName, @createdAt, @storageType)
	RETURNING file_id
`);

type Args = {
  fileId: string;
  fileName: string;
  storageType: StorageType;
};

export function CreateFileEntry({ fileId, fileName, storageType }: Args) {
  const bindParams: QueryParams = {
    fileId,
    fileName,
    createdAt: Date.now(),
    storageType,
  };

  sql.run(bindParams);

  return;
}
