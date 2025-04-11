import { db } from "../db";

type QueryParams = {
  projectId: string;
  collectionId: string;
};

type QueryResult = {};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	INSERT INTO
		t_collection_projects (collection_id, project_id)
	VALUES
		(@collectionId, @projectId)
`);

interface Args {
  projectId: string;
  collectionId: string;
}

export function AddProjectToCollection({ projectId, collectionId }: Args) {
  const bindParams: QueryParams = {
    projectId,
    collectionId,
  };

  sql.run(bindParams);
}
