import { db } from "db";

export type CreateFileEntryArgs = {
  assetId: string;
  fileClass: string;
  fileName: string;
  sha256: string;
  contentType: string;
  createdAt: number;
};

type QueryParams = {
  assetId: string;
  fileClass: string;
  fileName: string;
  sha256: string;
  contentType: string;
  createdAt: number;
  uploadedAt: number;
};

// Return the row as is
type QueryResult = QueryParams;

const statement = db.query<QueryResult, QueryParams>(/*sql*/ `
	INSERT INTO
		t_asset_files (asset_id, file_class, file_name, sha256, content_type, created_at, uploaded_at)
	VALUES
		(@assetId, @fileClass, @fileName, @sha256, @contentType, @createdAt, @uploadedAt)
	RETURNING
		asset_id		AS "assetId"
	,	file_class		AS "fileClass"
	,	file_name		AS "fileName"
	,	sha256			AS "sha256"
	,	content_type	AS "contentType"
	,	created_at		AS "createdAt"
	,	uploaded_at		AS "uploadedAt"
`);

export function CreateFileEntry({
  assetId,
  fileClass,
  fileName,
  sha256,
  contentType,
  createdAt,
}: CreateFileEntryArgs) {
  const bindParams: QueryParams = {
    assetId,
    fileClass,
    fileName,
    sha256,
    contentType,
    createdAt,
    uploadedAt: Date.now(),
  };

  const result = statement.get(bindParams);

  return result;
}
