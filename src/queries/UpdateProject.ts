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

interface Args {
  projectId: string;
  projectName: string;
}

export function UpdateProject({ projectId, projectName }: Args) {
  const bindParams: QueryParams = {
    projectId,
    projectName,
  };

  const result = sql.get(bindParams);

  if (result) {
    return result;
  } else {
    throw new Error("Failed to update project");
  }
}
