import { api } from "encore.dev/api";
import { database } from "../db";
import { Collection } from "../../types";

interface CreateProjectRequest {
  collectionId: string;
  projectName: string;
}

interface CreateProjectResponse {
  data: Collection;
}

export const createProject = api<CreateProjectRequest, CreateProjectResponse>(
  {
    method: "POST",
    path: "/collections/:collectionId/projects",
    expose: true,
    auth: true,
  },
  async ({ collectionId, projectName }) => {
    const result = await database.one<Collection>(SqlQuery, {
      collectionId,
      projectName,
    });

    return {
      data: result,
    };
  }
);

const SqlQuery = /*sql*/ `
	insert into t_projects(project_name, collection_uuid)
	values ($<projectName>, $<collectionId>)
	returning
		collection_id		as	"collectionId",
		project_id			as	"projectId",
		project_name		as	"projectName"
`;
