import { db } from "db";
import { ProjectAssetSelector } from "./AddAssetToProject";

const sql = db.query<{}, ProjectAssetSelector>(/*sql*/ `
	DELETE FROM
		t_project_assets
	WHERE
		project_id = @projectId
	AND
		asset_id = @assetId
	AND
		tag = @tag
`);

export function RemoveAssetFromProject({ projectId, assetId, tag }: ProjectAssetSelector) {
  const bindParams: ProjectAssetSelector = {
    projectId,
    assetId,
    tag,
  };

  const result = sql.run(bindParams);

  return result;
}
