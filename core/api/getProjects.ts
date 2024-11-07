import { api } from "encore.dev/api";
import { Project } from "../types";
import { database } from "../db";

interface GetProjectsRequest {
  collectionId: string;
}

interface GetProjectsResponse {
  collectionId: string;
  data: Project[];
}

export const getProjects = api<GetProjectsRequest, GetProjectsResponse>(
  {
    method: "GET",
    path: "/collections/:collectionId/projects",
    expose: true,
    // auth: true,
  },
  async ({ collectionId }) => {
    const result = await database.manyOrNone<Project>(SqlQuery, {
      collectionId,
    });

    return {
      collectionId,
      data: result,
    };
  }
);

const SqlQuery = /*sql*/ `
	select		i.project_id		as "projectId"
	,			i.project_name		as "projectName"
	,			i.media_type		as "mediaType"
	,			i.created			as "created"
	,			count(f.file_id)	as "fileCount"
	,			max(f.created)		as "lastModified"
	from		t_projects		i
	left join	t_files			f using (project_id)
	where		i.collection_id = $<collectionId>
	group by	i.project_id
	order by	i.project_name asc
`;
