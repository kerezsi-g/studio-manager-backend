import { api } from "encore.dev/api";
import { MediaFile, Project } from "../../types";
import { database } from "../../admin/db";
import { getAuthData } from "~encore/auth";

interface GetProjectVersionsRequest {
  projectId: string;
}

interface GetProjectVersionsResponse {
  //   collectionId: string;
  data: MediaFile[];
}

export const getProjectVersions = api<
  GetProjectVersionsRequest,
  GetProjectVersionsResponse
>(
  {
    method: "GET",
    path: "/projects/:projectId/files",
    expose: true,
    auth: true,
  },

  async ({ projectId }) => {
    const { userID } = getAuthData()!;

    const results = await database.manyOrNone<MediaFile>(SqlQuery, {
      projectId,
	  userID
    });

    return {
      data: results,
    };
  }
);

const SqlQuery = /*sql*/ `
	select		f.file_id 	as "fileId"
	,			f.project_id 	as "projectId"
	,			f.created 	as "created"
	,			f.remark 		as "remark"
	from		v_user_projects usr
	join		t_files			f	using ( file_id )
	where		project_id = $<projectId>
	and			usr.user_id = $<userID>
	order by	created asc
`;
