import { api } from "encore.dev/api";
import { MediaFile, Project } from "../types";
import { database } from "../db";

interface GetProjectVersionsRequest {
  projectId: string;
}

interface GetProjectVersionsResponse {
  //   collectionId: string;
  data: MediaFile[];
}

export const getProjectVersions = api<GetProjectVersionsRequest, GetProjectVersionsResponse>(
  {
    method: "GET",
    path: "/projects/:projectId/files",
    expose: true,
    // auth: true,
  },

  async ({ projectId }) => {
    const results = await database.manyOrNone<MediaFile>(SqlQuery, {
		projectId,
    });

    return {
      data: results,
    };
  }
);

const SqlQuery = /*sql*/ `
	select		file_id 	as "fileId"
	,			project_id 	as "projectId"
	,			created 	as "created"
	,			remark 		as "remark"
	from		t_files
	where		project_id = $<projectId>
	order by	created asc
`;
