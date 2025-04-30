import { db } from "db";

type QueryParams = {
  projectId: string;
  projectName: string | null;
  subject: string | null;
};

type QueryResult = {
  projectId: string;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	UPDATE
		t_projects
	SET
		project_name = COALESCE(@projectName, project_name)
	,	subject = COALESCE(@subject, subject)
	WHERE
		project_id = @projectId
	RETURNING
		project_id 	AS "projectId"
`);

export interface UpdateProjectArgs {
  projectId: string;
  projectName?: string | null;
  subject?: string | null;
}

export function UpdateProject({
  projectId,
  projectName = null,
  subject = null,
}: UpdateProjectArgs) {
  const bindParams: QueryParams = {
    projectId,
    projectName,
    subject,
  };

  const result = sql.get(bindParams);

  return result;
}
