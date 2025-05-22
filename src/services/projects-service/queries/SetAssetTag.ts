import { db } from "db";
import { AssetTag, AssetType } from "schemas";

type QueryParams = {
  projectId: string;
  fileId: string;
  assetType: AssetType;
  tag: AssetTag;
};

type QueryResult = {
  projectId: string;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	UPDATE
		t_assets
	SET
		tag = @tag
	WHERE
		project_id = @projectId
	AND
		file_id = @fileId
	AND
		asset_type = @assetType
	RETURNING
		project_id 	AS "projectId"
`);

type Arg = {
  projectId: string;
  fileId: string;
  tag: AssetTag;
};

export function SetAssetTag({ projectId, fileId, tag }: Arg) {
  const bindParams: QueryParams = {
    projectId,
    fileId,
    tag,
    assetType: AssetType.Primary,
  };

  const result = sql.get(bindParams);

  return result;
}
