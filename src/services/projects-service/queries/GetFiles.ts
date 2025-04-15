import { db } from "db";

type QueryParams = {
  projectId: string;
};

type QueryResult = {
  sha256: string;
  path: string;
  contentType: string;
  addedAt: number;
  tag: string;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	SELECT					
		F.sha256				AS "sha256"
	,	F.content_type			AS "contentType"
	,	PF.file_name			AS "fileName"
	,	PF.path					AS "path"
	,	PF.tag					AS "tag"
	,	PF.added_at				AS "addedAt"
	FROM
		t_project_files PF
	JOIN
		t_files	F ON PF.sha256 = F.sha256
	WHERE
		PF.project_id = @projectId
	ORDER BY
		F.created_at DESC
`);

export function GetProjectFiles(projectId: string) {
  const bindParams: QueryParams = {
    projectId,
  };

  const result = sql.all(bindParams);

  return result;
}
