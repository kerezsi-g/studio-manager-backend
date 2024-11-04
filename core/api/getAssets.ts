import { api } from "encore.dev/api";
import { Asset } from "../types";
import { database } from "../db";

interface GetAssetsRequest {
  projectId: string;
}

interface GetAssetsResponse {
  projectId: string;
  data: Asset[];
}

export const getAssets = api<GetAssetsRequest, GetAssetsResponse>(
  {
    method: "GET",
    path: "/projects/:projectId/assets",
    expose: true,
    // auth: true,
  },
  async ({ projectId }) => {
    const result = await database.manyOrNone<Asset>(SqlQuery, {
      projectId,
    });

    return {
      projectId,
      data: result,
    };
  }
);

const SqlQuery = /*sql*/ `
	select		i.asset_id			as "assetId"
	,			i.asset_name		as "assetName"
	,			i.media_type		as "mediaType"
	,			i.created			as "created"
	,			count(f.file_id)	as "fileCount"
	,			max(f.created)		as "lastModified"
	from		t_assets		i
	left join	t_files			f using (asset_id)
	where		i.project_id = $<projectId>
	group by	i.asset_id
	order by	i.asset_name asc
`;
