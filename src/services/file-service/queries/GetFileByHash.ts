import { generateUuid } from "utils/generate-uuid";
import { db } from "db";
import { FileService } from "..";

type QueryParams = {
  sha256: string;
};

type QueryResult = {
  fileId: string;
  contentType: string;
  size: number;
  uploadedAt: number;
  sha256: string;
  fileName: string;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	SELECT
		file_id			AS "fileId"
	, 	sha256			AS "sha256"
	, 	file_name		AS "fileName"
	, 	content_type	AS "contentType"
	, 	size			AS "size"
	, 	uploaded_at		AS "uploadedAt"
	FROM
		t_files_primary
	WHERE
		sha256 = @sha256
`);

interface Args {
  sha256: string;
}

export function GetFileByHash({ sha256 }: Args): FileService.PrimaryFileMdt | null {
  const bindParams: QueryParams = {
    sha256,
  };

  const result = sql.get(bindParams);

  return result;
}
