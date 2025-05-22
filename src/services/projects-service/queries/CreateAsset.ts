import { db } from "db";
import { AssetTag, AssetType } from "schemas";

type Row = {
  projectId: string;
  fileId: string;
  assetType: AssetType;
  assetName: string | null;
  tag: AssetTag | null;
};

const sql = db.query<Row, Row>(/*sql*/ `
	INSERT INTO
		t_assets(project_id, file_id, asset_type, asset_name, tag)
	VALUES
		(@projectId, @fileId, @assetType, @assetName, @tag)
	RETURNING
		project_id	AS "projectId"
	, 	file_id		AS "fileId"
	, 	asset_type	AS "assetType"
	, 	asset_name	AS "assetName"
`);

export interface CreateAssetArgs {
  projectId: string;
  fileId: string;
  assetType: AssetType;
  assetName?: string | null;
}

export function CreateAsset({ projectId, fileId, assetType, assetName = null }: CreateAssetArgs) {
  const bindParams: Row = {
    projectId,
    fileId,
    assetType,
    assetName,
    tag: assetType === AssetType.Primary ? AssetTag.PendingReview : null,
  };

  const result = sql.get(bindParams);

  return result;
}
