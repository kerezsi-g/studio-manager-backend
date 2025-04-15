import { db } from "db";

type QueryParams = {
  projectId: string;
};

type QueryResult = {
  userId: string;
  name: string;
  email: string;
  addedAt: number;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	SELECT
		U.user_id	AS "userId"
	,	U.name		AS "name"
	,	U.email		AS "email"
	,	PM.added_at	AS "addedAt"
	FROM
		t_project_members PM
	JOIN
		t_users U
	ON
		PM.user_id = U.user_id
	WHERE
		PM.project_id = @projectId
	ORDER BY
		U.name ASC
`);

export function GetProjectMembers(projectId: string) {
  const bindParams: QueryParams = {
    projectId,
  };

  const result = sql.all(bindParams);

  return result;
}
