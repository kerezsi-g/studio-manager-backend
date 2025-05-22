import { generateUuid } from "utils/generate-uuid";
import { db } from "db";
import { FileService } from "..";

type QueryParams = {
  fileId: string;
  sha256: string;
  fileName: string;
  contentType: string;
  size: number;
  uploadedAt: number;
};

type QueryResult = {
  fileId: string;
  sha256: string;
  fileName: string;
  contentType: string;
  size: number;
  uploadedAt: number;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	INSERT INTO
		t_files_primary (file_id, sha256, file_name, content_type, size, uploaded_at)
	VALUES
		(@fileId, @sha256, @fileName, @contentType, @size, @uploadedAt)
	RETURNING
		file_id			AS "fileId"
	, 	sha256			AS "sha256"
	, 	file_name		AS "fileName"
	, 	content_type	AS "contentType"
	, 	size			AS "size"
	, 	uploaded_at	AS "uploadedAt"
`);

interface Args {
  fileId: string;
  sha256: string;
  fileName: string;
  contentType: string;
  size: number;
}

export function WritePrimaryMetadata({
  fileId,
  sha256,
  fileName,
  contentType,
  size,
}: Args): FileService.PrimaryFileMdt {
  const bindParams: QueryParams = {
    fileId,
    sha256,
    fileName,
    contentType,
    size,
    uploadedAt: Date.now(),
  };

  const result = sql.get(bindParams);

  if (!result) {
    throw new Error("Failed to write primary metadata");
  }

  return result;
}
