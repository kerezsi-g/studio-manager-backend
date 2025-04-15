import { db } from "db";

type QueryParams = {
  projectId: string;
  userId: string;
  addedAt: number;
};

type QueryResult = {
  projectId: string;
  userId: string;
  addedAt: number;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	INSERT INTO
		t_project_members (project_id, user_id, added_at)
	VALUES
		(@projectId, @userId, @addedAt)
	RETURNING
		project_id	AS "projectId",
		user_id 	AS "userId",
		added_at	AS "addedAt"
`);

interface Args {
  projectId: string;
  userId: string;
}

export function AddProjectMember({ projectId, userId }: Args) {
  const bindParams: QueryParams = {
    projectId,
    userId,
    addedAt: Date.now(),
  };

  const result = sql.get(bindParams);

  return result;
}
