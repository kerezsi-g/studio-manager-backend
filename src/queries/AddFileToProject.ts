import { db } from "../db";

type QueryParams = {
  projectId: string;
  fileId: string;
  category: string;
};

type QueryResult = {};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	INSERT INTO
		t_project_files (project_id, file_id, category)
	VALUES
		(@projectId, @fileId, @category)
`);

interface Args {
  projectId: string;
  fileId: string;
  category: string;
}

export function AddFileToProject({ projectId, fileId, category }: Args) {
  const bindParams: QueryParams = {
    projectId,
    fileId,
    category,
  };

  sql.run(bindParams);
}
