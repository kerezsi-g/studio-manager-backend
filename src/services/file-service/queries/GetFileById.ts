import { generateUuid } from "utils/generate-uuid";
import { db } from "db";
import { FileService } from "..";

type QueryParams = {
  fileId: string;
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
		file_id = @fileId
`);

interface Args {
  fileId: string;
}

export function GetFileById({ fileId }: Args): FileService.PrimaryFileMdt {
  const bindParams: QueryParams = {
    fileId,
  };

  const result = sql.get(bindParams);

  if (!result) {
    throw new Error("File not found");
  }

  return result;
}
