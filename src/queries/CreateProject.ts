import { db } from "db";
import { generateUuid } from "utils/generateUuid";

type QueryParams = {
  projectName: string;
  projectType: string;
  projectId: string;
  createdAt: number;
};

type QueryResult = {
  projectId: string;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	INSERT INTO
		t_projects (project_id, project_name, project_type, created_at)
	VALUES
		(@projectId, @projectName, @projectType, @createdAt)
	RETURNING
		project_id as projectId
`);

interface Args {
  projectName: string;
  projectType: string;
}

export function CreateProject({ projectName, projectType }: Args) {
  const bindParams: QueryParams = {
    projectName,
    projectType,
    projectId: generateUuid(),
    createdAt: Date.now(),
  };

  const result = sql.get(bindParams);

  if (result) {
    return result.projectId;
  } else {
    throw new Error("Failed to create project");
  }
}
