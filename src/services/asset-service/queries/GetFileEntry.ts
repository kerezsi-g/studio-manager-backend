import { db } from "db";

export type GetFileEntryArgs = {
  userId: string;
  assetId: string;
  fileClass: string;
};

type QueryParams = {
  userId: string;
  assetId: string;
  fileClass: string;
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
	SELECT
		asset_id		AS "assetId"
	,	file_class		AS "fileClass"
	,	sha256			AS "sha256"
	,	content_type	AS "contentType"
	,	created_at		AS "createdAt"
	,	uploaded_at		AS "uploadedAt"
	FROM
		v_user_assets	AS va
	JOIN
		t_asset_files	AS af
		USING ( asset_id )
	WHERE
		va.user_id = @userId
		AND
		va.asset_id = @assetId
		AND
		af.file_class = @fileClass
`);

export function GetFileEntry({ userId, assetId, fileClass }: GetFileEntryArgs) {
  const bindParams: QueryParams = {
    userId,
    assetId,
    fileClass,
  };

  const result = statement.get(bindParams);

  return result;
}
