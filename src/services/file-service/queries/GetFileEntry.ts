import { db } from "db";

type QueryParams = {
  sha256: string;
};

type QueryResult = {
  sha256: string;
  fileName: string;
  storageType: string;
  contentType: string;
  createdAt: number;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	SELECT
		sha256			AS "sha256"
	,	file_name		AS "fileName"
	,	storage_type	AS "storageType"
	,	content_type	AS "contentType"
	,	created_at		AS "createdAt"
	FROM
		t_files
	WHERE
		sha256 = @sha256
`);

type Args = {
  sha256: string;
};

export function GetFileEntry({ sha256 }: Args) {
  const bindParams: QueryParams = {
    sha256,
  };

  const result = sql.get(bindParams);

  return result;
}
