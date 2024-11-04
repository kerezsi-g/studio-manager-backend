import { api } from "encore.dev/api";
import { MediaFile, Asset } from "../types";
import { database } from "../db";

interface GetAssetVersionsRequest {
  assetId: string;
}

interface GetAssetVersionsResponse {
  //   projectId: string;
  data: MediaFile[];
}

export const getAssetVersions = api<GetAssetVersionsRequest, GetAssetVersionsResponse>(
  {
    method: "GET",
    path: "/assets/:assetId/files",
    expose: true,
    // auth: true,
  },

  async ({ assetId }) => {
    const results = await database.manyOrNone<MediaFile>(SqlQuery, {
		assetId,
    });

    return {
      data: results,
    };
  }
);

const SqlQuery = /*sql*/ `
	select		file_id 	as "fileId"
	,			asset_id 	as "assetId"
	,			created 	as "created"
	,			remark 		as "remark"
	from		t_files
	where		asset_id = $<assetId>
	order by	created asc
`;
