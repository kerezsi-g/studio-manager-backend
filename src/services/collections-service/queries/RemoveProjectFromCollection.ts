import { db } from "db";

type QueryParams = {
  collectionId: string;
  projectId: string;
};

type QueryResult = {};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	DELETE FROM
		t_collection_projects
	WHERE
		collection_id = @collectionId
	AND
		project_id = @projectId
`);

interface Args {
  projectId: string;
  collectionId: string;
}

export function RemoveProjectFromCollection({ projectId, collectionId }: Args) {
  const bindParams: QueryParams = {
    projectId,
    collectionId,
  };

  sql.run(bindParams);
}
