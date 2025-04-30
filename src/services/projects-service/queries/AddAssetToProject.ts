import { db } from "db";

export type ProjectAssetSelector = {
  projectId: string;
  assetId: string;
  tag: string;
};

type QueryParams = ProjectAssetSelector & {
  addedAt: number;
};

const sql = db.query<ProjectAssetSelector, QueryParams>(/*sql*/ `
	INSERT INTO
		t_project_assets (project_id, asset_id, tag, added_at)
	VALUES
		(@projectId, @assetId, @tag, @addedAt)
	RETURNING
		project_id		AS "projectId",
		asset_id		AS "assetId",
		tag				AS "tag"
`);

export function AddAssetToProject({ projectId, assetId, tag }: ProjectAssetSelector) {
  const bindParams: QueryParams = {
    projectId,
    assetId,
    tag,
    addedAt: Date.now(),
  };

  const result = sql.get(bindParams);

  return result;
}
