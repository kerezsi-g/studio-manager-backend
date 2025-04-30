import { db } from "db";
import { AssetType } from "schemas";

type QueryParams = {
  projectId: string;
  tag: string | null;
};

type QueryResult = {
  tag: string;
  assetId: string;
  assetName: string;
  assetType: AssetType;
  addedAt: number;
  uploadedAt: number;
  createdAt: number;
  contentType: string;
  size: number;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	SELECT					
		pa.tag				AS "tag"
	,	pa.asset_id			AS "assetId"
	,	pa.asset_name		AS "assetName"
	,	pa.asset_type		AS "assetType"
	,	pa.added_at			AS "addedAt"
	,	pa.uploaded_at		AS "uploadedAt"
	,	pa.created_at		AS "createdAt"
	,	pa.content_type		AS "contentType"
	,	pa.size				AS "size"
	FROM		
		v_project_assets pa
	WHERE
		pa.project_id = @projectId
	AND
		( @tag is NULL or pa.tag = @tag )
	ORDER BY
		pa.created_at DESC
`);

export function GetProjectAssets(projectId: string, tag: string | null = null) {
  const bindParams: QueryParams = {
    projectId,
    tag,
  };

  const result = sql.all(bindParams);

  return result;
}
