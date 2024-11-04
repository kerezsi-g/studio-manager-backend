import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { Project } from "../types";
import { database } from "../db";

interface GetProjectsResponse {
  data: Project[];
}

export const getProjects = api<void, GetProjectsResponse>(
  {
    method: "GET",
    path: "/projects",
    expose: true,
    auth: false,
  },
  async () => {
    const user = getAuthData();

    const result = await database.manyOrNone<Project>(SqlQuery);

    return {
      data: result,
    };
  }
);

const SqlQuery = /*sql*/ `
	select		project_id	as "projectId"
	,			project_name	as "projectName"
	,			created			as "created"
	from		t_projects
	order by	project_name asc
`;
