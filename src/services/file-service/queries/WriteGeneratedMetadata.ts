import { generateUuid } from "utils/generate-uuid";
import { db } from "db";

type QueryParams = {
  fileId: string;
  suffix: string;
  contentType: string;
  size: number;
};

type QueryResult = {
  fileId: string;
  suffix: string;
  contentType: string;
  size: number;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	INSERT INTO
		t_files_generated (file_id, suffix, content_type, size)
	VALUES
		(@fileId, @suffix, @contentType, @size)
	RETURNING
		file_id			AS "fileId"
	, 	suffix			AS "suffix"
	, 	content_type	AS "contentType"
	, 	size			AS "size"
`);

interface Args {
  fileId: string;
  suffix: string;
  contentType: string;
  size: number;
}

export function WriteGeneratedMetadata({ fileId, suffix, contentType, size }: Args) {
  const bindParams: QueryParams = {
    fileId,
    suffix,
    contentType,
    size,
  };

  const result = sql.get(bindParams);

  return result;
}
