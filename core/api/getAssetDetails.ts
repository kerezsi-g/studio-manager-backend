import { api } from "encore.dev/api";
import { Annotation, MediaFile } from "../types";
import { database } from "../db";

interface GetAssetDetailsRequest {
  assetId: string;
}

interface AssetDetails {
  projectId: string;
  projectName: string;
  assetId: string;
  assetName: string;
  versions: MediaFile[];
}

interface GetAssetDetailsResponse {
  data: AssetDetails;
}

export const getAssetDetails = api<
  GetAssetDetailsRequest,
  GetAssetDetailsResponse
>(
  {
    method: "GET",
    path: "/assets/:assetId",
    expose: true,
    // auth: true,
  },
  async ({ assetId }) => {
    const result = await database.one<AssetDetails>(SqlQuery, { assetId });

    return {
      data: result,
    };
  }
);

const SqlQuery = /*sql*/ `
	select		p.project_id						as "projectId"
	,			p.project_name						as "projectName"
	,			a.asset_id							as "assetId"
	,			a.asset_name						as "assetName"
	,			a.media_type						as "mediaType"
	,			a.created							as "created"
	,			json_agg(
					json_build_object(
						'fileId',	f.file_id,
						'created',	f.created,
						'remark',	f.remark	
					) order by f.created desc
				) 									as "versions"
	from		t_projects		p
	join		t_assets		a	using ( project_id )
	join		t_files			f	using ( asset_id )
	where		asset_id = $<assetId>
	group by	p.project_id, a.asset_id
`;
