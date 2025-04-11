import { db } from "../db";

type QueryParams = {
  projectId: string;
  userId: string;
};

type QueryResult = {};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	DELETE FROM t_project_members
	WHERE project_id = @projectId
	AND user_id = @userId
`);

interface Args {
  projectId: string;
  userId: string;
}

export function RemoveUserFromProject({ projectId, userId }: Args) {
  const bindParams: QueryParams = {
    projectId,
    userId,
  };

  sql.run(bindParams);
}
