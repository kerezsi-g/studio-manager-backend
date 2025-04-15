import { db } from "db";

type QueryParams = {
  projectId: string;
  projectName: string;
};

type QueryResult = {
  projectId: string;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	UPDATE
		t_projects
	SET
		project_name = @projectName
	WHERE
		project_id = @projectId
	RETURNING
		project_id 	AS "projectId"
`);

export interface UpdateProjectArgs {
  projectId: string;
  projectName: string;
}

export function UpdateProject({ projectId, projectName }: UpdateProjectArgs) {
  const bindParams: QueryParams = {
    projectId,
    projectName,
  };

  const result = sql.get(bindParams);

  return result;
}
