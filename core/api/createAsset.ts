import { api } from "encore.dev/api";
import { database } from "../db";
import { Project } from "../types";

interface CreateAssetRequest {
  projectId: string;
  assetName: string;
}

interface CreateAssetResponse {
  data: Project;
}

export const createAsset = api<CreateAssetRequest, CreateAssetResponse>(
  {
    method: "POST",
    path: "/projects/:projectId/assets",
    expose: true,
    // auth: true,
  },
  async ({ projectId, assetName }) => {
    const result = await database.one<Project>(SqlQuery, {
      projectId,
      assetName,
    });

    return {
      data: result,
    };
  }
);

const SqlQuery = /*sql*/ `
	insert into t_project_items(item_name, project_uuid)
	values ($<itemName>, $<projectId>)
	returning
		project_id		as	"projectId",
		asset_id		as	"assetId",
		asset_name		as	"assetName"
`;
