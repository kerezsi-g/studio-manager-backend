import { db } from "db";
import { AssetTag, AssetType, ProjectAsset } from "schemas";

type QueryParams = {
  projectId: string;
  assetType: AssetType;
};

type QueryResult = {
  projectId: string;
  fileId: string;
  assetType: AssetType;
  tag: AssetTag | null;
  assetName: string;
  uploadedAt: number;
  contentType: string;
  size: number;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	SELECT					
		project_id		AS "projectId"
	, 	file_id			AS "fileId"
	, 	asset_type		AS "assetType"
	, 	tag				AS "tag"
	, 	asset_name		AS "assetName"
	, 	uploaded_at		AS "uploadedAt"
	, 	content_type	AS "contentType"
	, 	size			AS "size"
	FROM		
		v_assets
	WHERE
		project_id = @projectId
	AND
		asset_type = @assetType
	ORDER BY
		uploaded_at DESC
`);

type Args = {
  projectId: string;
  assetType: AssetType;
};

export function GetAssetsByType({ projectId, assetType }: Args): ProjectAsset[] {
  const bindParams: QueryParams = {
    projectId,
    assetType,
  };

  const result = sql.all(bindParams);

  return result;
}
