import { db } from "../db";

type QueryParams = {
  projectId: string;
};

type QueryResult = {
  fileId: string;
  fileName: string;
  category: string;
  createdAt: number;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	SELECT
		F.file_id			AS "fileId"
	,	F.file_name			AS "fileName"
	,	PF.category			AS "category"
	,	F.created_at		AS "createdAt"
	FROM
		t_project_files PF
	JOIN
		t_files	F ON PF.file_id = F.file_id
	WHERE
		PF.project_id = @projectId
	ORDER BY
		F.created_at DESC
`);

type Args = {
  projectId: string;
};

export function GetProjectFiles({ projectId }: Args) {
  const bindParams: QueryParams = {
    projectId,
  };

  const result = sql.all(bindParams);

  return result;
}
