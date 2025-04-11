import { db } from "../db";

type QueryParams = {
  projectId: string;
  fileId: string;
  category: string;
};

type QueryResult = {};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	DELETE FROM
		t_project_files
	WHERE
		project_id = @projectId
	AND
		file_id = @fileId
	AND
		category = @category
`);

interface Args {
  projectId: string;
  fileId: string;
  category: string;
}

export function RemoveFileFromProject({ projectId, fileId, category }: Args) {
  const bindParams: QueryParams = {
    projectId,
    fileId,
    category,
  };

  sql.run(bindParams);
}
