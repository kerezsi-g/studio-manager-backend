import { db } from "db";

export type UpdateFileEntryArgs = {
  assetId: string;
  fileClass: string;
  size: number;
  uploadedAt: number;
};

type QueryParams = {
  assetId: string;
  fileClass: string;
  size: number;
  uploadedAt: number;
};

// Return the row as is
type QueryResult = {
  assetId: string;
  fileClass: string;
  sha256: string;
  contentType: string;
  createdAt: number;
  uploadedAt: number;
  status: string;
};

const statement = db.query<QueryResult, QueryParams>(/*sql*/ `
	UPDATE
		t_asset_files
	SET
		size			= @size
	,	uploaded_at		= @uploadedAt
	WHERE
		asset_id		= @assetId
	AND
		file_class		= @fileClass
	RETURNING
		asset_id		AS "assetId"
	,	file_class		AS "fileClass"
	,	sha256			AS "sha256"
	,	content_type	AS "contentType"
	,	created_at		AS "createdAt"
	,	uploaded_at		AS "uploadedAt"
`);

export function UpdateFileEntry({ assetId, fileClass, size, uploadedAt }: UpdateFileEntryArgs) {
  const bindParams: QueryParams = {
    assetId,
    fileClass,
    size,
    uploadedAt,
  };

  const result = statement.get(bindParams);

  if (!result) {
    throw new Error("Failed to update file entry");
  }

  return result;
}
