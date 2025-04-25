import { db } from "db";
import { ProjectType } from "schemas/ProjectType.type";

type QueryParams = {
  projectId: string;
};

type QueryResult = {
  projectId: string;
  projectName: string;
  projectType: ProjectType;
  createdAt: number;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	SELECT 
		project_id		AS "projectId"
	,	project_name	AS "projectName"
	,	project_type	AS "projectType"
	,	created_at		AS "createdAt"
	FROM
		t_projects
	WHERE
		project_id = @projectId
	ORDER BY
		created_at DESC
`);

export function GetProjectById(projectId: string) {
  const bindParams: QueryParams = {
    projectId,
  };

  const result = sql.get(bindParams);

  if (!result) {
    throw new Error("Project not found");
  }

  return result;
}
