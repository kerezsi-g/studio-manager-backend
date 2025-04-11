import { db } from "../db";

type QueryParams = {
  fileId: string;
};

type QueryResult = {
  fileId: string;
  fileName: string;
  storageType: string;
  createdAt: number;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	SELECT
		file_id			AS "fileId"
	,	file_name		AS "fileName"
	,	storage_type	AS "storageType"
	,	created_at		AS "createdAt"
	FROM
		t_files
	WHERE
		file_id = @fileId
`);

type Args = {
  fileId: string;
};

export function GetFileEntry({ fileId }: Args) {
  const bindParams: QueryParams = {
    fileId,
  };

  const result = sql.get(bindParams);

  return result;
}
