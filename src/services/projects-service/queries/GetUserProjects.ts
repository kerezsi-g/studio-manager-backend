import { db } from "db";

type QueryParams = {
  userId: string;
};

type QueryResult = {
  projectId: string;
  projectName: string;
  projectType: string;
  createdAt: number;
  thumbnail: string | null;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	SELECT 
		project_id		AS "projectId"
	,	project_name	AS "projectName"
	,	project_type	AS "projectType"
	,	created_at		AS "createdAt"
	,	thumbnail		AS "thumbnail"
	FROM
		v_user_projects
	WHERE
		user_id = @userId
	ORDER BY
		created_at DESC
`);

export function GetUserProjects(userId: string) {
  const bindParams: QueryParams = {
    userId,
  };

  const result = sql.all(bindParams);

  return result;
}
