import { db } from "db";
import { generateUuid } from "utils/generate-uuid";

type QueryParams = {
  projectName: string;
  projectType: string;
  projectId: string;
  createdAt: number;
  subject: string;
};

type QueryResult = {
  projectId: string;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	INSERT INTO
		t_projects (project_id, project_name, project_type, subject, created_at)
	VALUES
		(@projectId, @projectName, @projectType, @subject, @createdAt)
	RETURNING
		project_id as projectId
`);

export interface CreateProjectArgs {
  projectName: string;
  projectType: string;
  subject: string;
}

export function CreateProject({ projectName, projectType, subject }: CreateProjectArgs) {
  const bindParams: QueryParams = {
    projectName,
    projectType,
    subject,
    projectId: generateUuid(),
    createdAt: Date.now(),
  };

  const result = sql.get(bindParams);

  return result;
}
