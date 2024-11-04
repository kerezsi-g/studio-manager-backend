import { api } from "encore.dev/api";
import { database } from "../db";
import { Project } from "../types";

interface CreateProjectRequest {
  projectName: string;
}

interface CreateProjectResponse {
  data: Project;
}

export const createProject = api<CreateProjectRequest, CreateProjectResponse>(
  {
    method: "POST",
    path: "/projects",
    expose: true,
    // auth: true,
  },
  async ({ projectName }) => {
    const result = await database.one<Project>(SqlQuery, { projectName });

    return {
      data: result,
    };
  }
);

const SqlQuery = /*sql*/ `
	insert into t_projects(project_name)
	values ($<projectName>)
	returning	project_id		as	"projectId"
	,			project_name	as	"projectName"
	,			created			as	"created"
`;
