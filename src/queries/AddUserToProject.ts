import { db } from "../db";

type QueryParams = {
  projectId: string;
  userId: string;
};

type QueryResult = {};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	INSERT INTO t_project_members (project_id, user_id)
	VALUES (@projectId, @userId)
`);

interface Args {
  projectId: string;
  userId: string;
}

export function AddUserToProject({ projectId, userId }: Args) {
  const bindParams: QueryParams = {
    projectId,
    userId,
  };

  sql.run(bindParams);
}
