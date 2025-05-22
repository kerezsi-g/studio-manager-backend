import { db } from "db";

type QueryParams = {
  projectId: string;
  fileId: string;
  assetType: string;
};

const sql = db.query<{}, QueryParams>(/*sql*/ `
	DELETE FROM
		t_assets
	WHERE
		project_id = @projectId
	AND
		file_id = @fileId
	AND
		asset_type = @assetType
`);

interface Args {
  projectId: string;
  fileId: string;
  assetType: string;
}

export function DeleteAsset({ projectId, fileId, assetType }: Args) {
  const bindParams: QueryParams = {
    projectId,
    fileId,
    assetType,
  };

  const result = sql.run(bindParams);

  return result;
}
