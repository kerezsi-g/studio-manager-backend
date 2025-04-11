import { db } from "../db";

type QueryParams = {
  userId: string;
  projectId: string;
};

type QueryResult = {
  projectId: string;
  projectName: string;
  projectType: string;
  createdAt: number;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	SELECT 
		project_id		AS "projectId"
	,	project_name	AS "projectName"
	,	project_type	AS "projectType"
	,	created_at		AS "createdAt"
	FROM
		v_user_projects
	WHERE
		user_id = @userId
	AND
		project_id = @projectId
	ORDER BY
		created_at DESC
`);

type Args = {
  userId: string;
  projectId: string;
};

export function GetProjectById({ userId, projectId }: Args) {
  const bindParams: QueryParams = {
    userId,
    projectId,
  };

  const result = sql.get(bindParams);

  if (!result) {
    throw new Error("Project not found");
  }

  return result;
}
