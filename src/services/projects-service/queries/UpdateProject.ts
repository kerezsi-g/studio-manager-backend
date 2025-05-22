import { db } from "db";

type QueryParams = {
  projectId: string;
  projectName: string | null;
  subject: string | null;
};

type QueryResult = {
  projectId: string;
  projectName: string;
  subject: string;
  projectType: string;
  createdAt: number;
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
		project_id 		AS "projectId",
		project_name 	AS "projectName",
		subject 		AS "subject",
		project_type 	AS "projectType",
		created_at 		AS "createdAt"
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
