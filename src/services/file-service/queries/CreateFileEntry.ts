import { db } from "db";

type QueryParams = {
  sha256: string;
  fileName: string;
  contentType: string;
  createdAt: number;
  uploadedAt: number;
};

type QueryResult = {
  sha256: string;
  fileName: string;
  contentType: string;
  createdAt: number;
  uploadedAt: number;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	INSERT INTO t_files (sha256, file_name, content_type, created_at, uploaded_at)
	VALUES (@sha256, @fileName, @contentType, @createdAt, @uploadedAt)
	RETURNING sha256
`);

type Args = {
  sha256: string;
  fileName: string;
  contentType: string;
  createdAt: number;
};

export function CreateFileEntry({ sha256, fileName, contentType, createdAt }: Args) {
  const bindParams: QueryParams = {
    sha256,
    fileName,
    contentType,
    createdAt,
    uploadedAt: Date.now(),
  };

  sql.run(bindParams);

  return;
}
