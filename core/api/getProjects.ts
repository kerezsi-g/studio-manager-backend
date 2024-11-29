import { api } from "encore.dev/api";
import { Project } from "../types";
import { database } from "../../admin/db";
import { getAuthData } from "~encore/auth";

interface GetProjectsRequest {
  collectionId: string;
}

interface GetProjectsResponse {
  collectionId: string;
  collectionName: string;
  data: Project[];
}

export const getProjects = api<GetProjectsRequest, GetProjectsResponse>(
  {
    method: "GET",
    path: "/collections/:collectionId/projects",
    expose: true,
    auth: true,
  },
  async ({ collectionId }) => {
    const { userID } = getAuthData()!;

    const result = await database.manyOrNone<Project>(GetProjects, {
      collectionId,
      userID,
    });

    const { collectionName } = await database.one<{ collectionName: string }>(
      GetCollectionDetails,
      { userID, collectionId }
    );

    return {
      collectionName,
      collectionId,
      data: result,
    };
  }
);

const GetProjects = /*sql*/ `
	select		i.project_id		as "projectId"
	,			i.project_name		as "projectName"
	,			i.media_type		as "mediaType"
	,			i.created			as "created"
	,			count(f.file_id)	as "fileCount"
	,			max(f.created)		as "lastModified"
	from		v_user_projects		i	
	join		t_collections		c using (collection_id)	
	left join	t_files				f using (project_id)
	where		i.collection_id = $<collectionId>
	and			i.user_id = $<userID>
	group by	c.collection_name,i.project_id, i.project_name, i.media_type, i.created
	order by	i.project_name asc
`;

const GetCollectionDetails = /*sql*/ `
	select		c.collection_id			as "collectionId"
	,			c.collection_name		as "collectionName"
	from		v_user_collections 		as c
	where		user_id = $<userID>
	and			collection_id = $<collectionId>
`;
