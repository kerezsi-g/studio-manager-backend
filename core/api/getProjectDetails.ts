import { api } from "encore.dev/api";
import { Review, MediaFile } from "../types";
import { database } from "../db";

interface GetProjectDetailsRequest {
  projectId: string;
}

interface ProjectDetails {
  collectionId: string;
  collectionName: string;
  projectId: string;
  projectName: string;
  versions: MediaFile[];
}

interface GetProjectDetailsResponse {
  data: ProjectDetails;
}

export const getProjectDetails = api<
  GetProjectDetailsRequest,
  GetProjectDetailsResponse
>(
  {
    method: "GET",
    path: "/projects/:projectId",
    expose: true,
    // auth: true,
  },
  async ({ projectId }) => {
    const result = await database.one<ProjectDetails>(SqlQuery, { projectId });

    return {
      data: result,
    };
  }
);

const SqlQuery = /*sql*/ `
	select		p.collection_id						as "collectionId"
	,			p.collection_name						as "collectionName"
	,			a.project_id							as "projectId"
	,			a.project_name						as "projectName"
	,			a.media_type						as "mediaType"
	,			a.created							as "created"
	,			json_agg(
					json_build_object(
						'fileId',	f.file_id,
						'created',	f.created,
						'remark',	f.remark	
					) order by f.created desc
				) 									as "versions"
	from		t_collections		p
	join		t_projects		a	using ( collection_id )
	join		t_files			f	using ( project_id )
	where		project_id = $<projectId>
	group by	p.collection_id, a.project_id
`;